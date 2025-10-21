#!/bin/bash

# Service Request Management System - Startup Script
# This script starts all components of the SRM system

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKEND_PORT=8010
FRONTEND_PORT=3002
WEBSOCKET_PORT=8011
DATABASE_NAME="srm_db"

echo -e "${BLUE}🚀 Starting Service Request Management System${NC}"
echo "=================================================="

# Function to check if a command exists
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}❌ Error: $1 is not installed${NC}"
        echo -e "${YELLOW}Please install $1 and try again${NC}"
        exit 1
    fi
}

# Function to check if port is available
check_port() {
    local port=$1
    local service=$2
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        echo -e "${YELLOW}⚠️  Port $port is already in use (needed for $service)${NC}"
        echo -e "${YELLOW}Please stop the service using port $port or change the configuration${NC}"
        exit 1
    fi
}

# Function to wait for service to start
wait_for_service() {
    local port=$1
    local service=$2
    local max_attempts=30
    local attempt=1
    
    echo -e "${YELLOW}⏳ Waiting for $service to start on port $port...${NC}"
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s "http://localhost:$port/health" >/dev/null 2>&1; then
            echo -e "${GREEN}✅ $service is ready!${NC}"
            return 0
        fi
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo -e "${RED}❌ $service failed to start within 60 seconds${NC}"
    return 1
}

# Check prerequisites
echo -e "${BLUE}🔍 Checking prerequisites...${NC}"
check_command "node"
check_command "npm"
check_command "psql"

# Check Node.js version
NODE_VERSION=$(node -v | sed 's/v//')
MIN_NODE_VERSION="18.0.0"
if [ "$(printf '%s\n' "$MIN_NODE_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$MIN_NODE_VERSION" ]; then
    echo -e "${RED}❌ Node.js version $NODE_VERSION is too old. Minimum required: $MIN_NODE_VERSION${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites check passed${NC}"

# Check ports availability
echo -e "${BLUE}🔌 Checking port availability...${NC}"
check_port $BACKEND_PORT "Backend API"
check_port $FRONTEND_PORT "Frontend"
check_port $WEBSOCKET_PORT "WebSocket Server"

echo -e "${GREEN}✅ All ports are available${NC}"

# Check environment variables
echo -e "${BLUE}🔐 Checking environment configuration...${NC}"
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}⚠️  Backend .env file not found. Creating from template...${NC}"
    if [ -f "backend/.env.example" ]; then
        cp backend/.env.example backend/.env
        echo -e "${YELLOW}Please update backend/.env with your configuration before running again${NC}"
        exit 1
    else
        echo -e "${RED}❌ No .env.example found. Please create backend/.env manually${NC}"
        exit 1
    fi
fi

# Check database connection
echo -e "${BLUE}🗄️  Checking database connection...${NC}"
if ! PGPASSWORD=srm_password psql -h localhost -p 5432 -U srm_user -d "$DATABASE_NAME" -c "SELECT 1;" >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Database connection failed. Make sure PostgreSQL is running and database exists.${NC}"
    read -p "Would you like to initialize the database? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${BLUE}📊 Initializing database...${NC}"
        ./scripts/init-database.sh
    else
        echo -e "${RED}❌ Database is required to run the system${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✅ Database connection successful${NC}"

# Install dependencies if needed
echo -e "${BLUE}📦 Checking and installing dependencies...${NC}"

# Backend dependencies
if [ ! -d "backend/node_modules" ]; then
    echo -e "${YELLOW}Installing backend dependencies...${NC}"
    cd backend && npm install && cd ..
fi

# Frontend dependencies  
if [ ! -d "frontend/node_modules" ]; then
    echo -e "${YELLOW}Installing frontend dependencies...${NC}"
    cd frontend && npm install && cd ..
fi

echo -e "${GREEN}✅ Dependencies are ready${NC}"

# Build backend
echo -e "${BLUE}🔨 Building backend...${NC}"
cd backend && npm run build && cd ..
echo -e "${GREEN}✅ Backend built successfully${NC}"

# Build frontend for production (optional)
if [ "$1" = "--production" ]; then
    echo -e "${BLUE}🔨 Building frontend for production...${NC}"
    cd frontend && npm run build && cd ..
    echo -e "${GREEN}✅ Frontend built successfully${NC}"
fi

# Start services
echo -e "${BLUE}🚀 Starting services...${NC}"

# Start backend
echo -e "${YELLOW}Starting backend server...${NC}"
(cd backend && npm start 2>&1 | tee ../backend.log) &
BACKEND_PID=$!

# Wait for backend to be ready
if wait_for_service $BACKEND_PORT "Backend API"; then
    echo -e "${GREEN}✅ Backend started successfully (PID: $BACKEND_PID)${NC}"
else
    echo -e "${RED}❌ Failed to start backend${NC}"
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
fi

# Start frontend
if [ "$1" = "--production" ]; then
    echo -e "${YELLOW}Starting frontend in production mode...${NC}"
    (cd frontend && npx serve -s dist -l $FRONTEND_PORT 2>&1 | tee ../frontend.log) &
    FRONTEND_PID=$!
else
    echo -e "${YELLOW}Starting frontend in development mode...${NC}"
    (cd frontend && npm run dev 2>&1 | tee ../frontend.log) &
    FRONTEND_PID=$!
fi

# Wait a moment for frontend to start
sleep 5

# Create PID file for easy cleanup
echo $BACKEND_PID > .backend.pid
echo $FRONTEND_PID > .frontend.pid

echo ""
echo -e "${GREEN}🎉 SRM System started successfully!${NC}"
echo "=================================================="
echo -e "${BLUE}📍 Service URLs:${NC}"
echo -e "   Frontend:     ${GREEN}http://localhost:$FRONTEND_PORT${NC}"
echo -e "   Backend API:  ${GREEN}http://localhost:$BACKEND_PORT${NC}"
echo -e "   WebSocket:    ${GREEN}ws://localhost:$WEBSOCKET_PORT${NC}"
echo -e "   Health Check: ${GREEN}http://localhost:$BACKEND_PORT/health${NC}"
echo ""
echo -e "${BLUE}📊 System Information:${NC}"
echo -e "   Backend PID:  $BACKEND_PID"
echo -e "   Frontend PID: $FRONTEND_PID"
echo -e "   Database:     $DATABASE_NAME"
echo ""
echo -e "${YELLOW}💡 Useful commands:${NC}"
echo -e "   Stop system:    ${GREEN}./stop-system.sh${NC}"
echo -e "   Check status:   ${GREEN}./check-system.sh${NC}"
echo -e "   View logs:      ${GREEN}./view-logs.sh${NC}"
echo -e "   Backend logs:   ${GREEN}tail -f backend.log${NC}"
echo -e "   Frontend logs:  ${GREEN}tail -f frontend.log${NC}"
echo ""
echo -e "${GREEN}✨ Happy coding! The SRM system is ready to serve requests.${NC}"

# Keep script running to show real-time status
echo -e "${BLUE}🔄 System is running... Press Ctrl+C to stop all services${NC}"
echo ""

# Trap Ctrl+C to cleanup
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Shutting down SRM system...${NC}"
    if [ -f .backend.pid ]; then
        BACKEND_PID=$(cat .backend.pid)
        kill $BACKEND_PID 2>/dev/null && echo -e "${GREEN}✅ Backend stopped${NC}" || echo -e "${YELLOW}⚠️  Backend already stopped${NC}"
        rm .backend.pid
    fi
    if [ -f .frontend.pid ]; then
        FRONTEND_PID=$(cat .frontend.pid)
        kill $FRONTEND_PID 2>/dev/null && echo -e "${GREEN}✅ Frontend stopped${NC}" || echo -e "${YELLOW}⚠️  Frontend already stopped${NC}"
        rm .frontend.pid
    fi
    echo -e "${GREEN}🏁 SRM system stopped successfully${NC}"
    exit 0
}

trap cleanup INT

# Monitor services
while true; do
    sleep 10
    if ! kill -0 $BACKEND_PID 2>/dev/null; then
        echo -e "${RED}❌ Backend process died unexpectedly${NC}"
        echo -e "${YELLOW}💡 Check backend.log for details${NC}"
        echo -e "${BLUE}Last 20 lines of backend.log:${NC}"
        tail -n 20 backend.log 2>/dev/null || echo "No backend.log found"
        cleanup
    fi
    if ! kill -0 $FRONTEND_PID 2>/dev/null; then
        echo -e "${RED}❌ Frontend process died unexpectedly${NC}"
        echo -e "${YELLOW}💡 Check frontend.log for details${NC}"
        echo -e "${BLUE}Last 20 lines of frontend.log:${NC}"
        tail -n 20 frontend.log 2>/dev/null || echo "No frontend.log found"
        cleanup
    fi
done
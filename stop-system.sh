#!/bin/bash

# Service Request Management System - Stop Script
# This script stops all components of the SRM system

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🛑 Stopping Service Request Management System${NC}"
echo "=================================================="

# Function to stop process by PID file
stop_service() {
    local pid_file=$1
    local service_name=$2
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if kill -0 "$pid" 2>/dev/null; then
            echo -e "${YELLOW}Stopping $service_name (PID: $pid)...${NC}"
            kill "$pid"
            sleep 2
            
            # Check if process is still running
            if kill -0 "$pid" 2>/dev/null; then
                echo -e "${YELLOW}Force stopping $service_name...${NC}"
                kill -9 "$pid" 2>/dev/null || true
            fi
            
            echo -e "${GREEN}✅ $service_name stopped${NC}"
        else
            echo -e "${YELLOW}⚠️  $service_name was not running${NC}"
        fi
        rm "$pid_file"
    else
        echo -e "${YELLOW}⚠️  No PID file found for $service_name${NC}"
    fi
}

# Stop backend
stop_service ".backend.pid" "Backend"

# Stop frontend
stop_service ".frontend.pid" "Frontend"

# Stop any remaining processes on known ports
echo -e "${BLUE}🔍 Checking for remaining processes...${NC}"

# Check backend port (8010)
BACKEND_PID=$(lsof -ti:8010)
if [ ! -z "$BACKEND_PID" ]; then
    echo -e "${YELLOW}Found process on port 8010 (PID: $BACKEND_PID), stopping...${NC}"
    kill -9 $BACKEND_PID 2>/dev/null || true
    echo -e "${GREEN}✅ Process on port 8010 stopped${NC}"
fi

# Check frontend port (3002)
FRONTEND_PID=$(lsof -ti:3002)
if [ ! -z "$FRONTEND_PID" ]; then
    echo -e "${YELLOW}Found process on port 3002 (PID: $FRONTEND_PID), stopping...${NC}"
    kill -9 $FRONTEND_PID 2>/dev/null || true
    echo -e "${GREEN}✅ Process on port 3002 stopped${NC}"
fi

# Check WebSocket port (8011)
WEBSOCKET_PID=$(lsof -ti:8011)
if [ ! -z "$WEBSOCKET_PID" ]; then
    echo -e "${YELLOW}Found process on port 8011 (PID: $WEBSOCKET_PID), stopping...${NC}"
    kill -9 $WEBSOCKET_PID 2>/dev/null || true
    echo -e "${GREEN}✅ Process on port 8011 stopped${NC}"
fi

# Clean up any remaining PID files
rm -f .backend.pid .frontend.pid

echo ""
echo -e "${GREEN}🏁 SRM system stopped successfully${NC}"
echo -e "${BLUE}💡 To start the system again, run: ${GREEN}./start-system.sh${NC}"
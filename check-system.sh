#!/bin/bash

# Service Request Management System - Health Check Script
# This script checks the status of all SRM system components

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

echo -e "${BLUE}🔍 SRM System Health Check${NC}"
echo "=========================="
echo ""

# Function to check HTTP service
check_http_service() {
    local port=$1
    local service_name=$2
    local endpoint=$3
    
    printf "%-20s: " "$service_name"
    
    if curl -s -f "http://localhost:$port$endpoint" >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Running${NC} (port $port)"
        return 0
    else
        echo -e "${RED}❌ Not running${NC} (port $port)"
        return 1
    fi
}

# Function to check if process is running on port
check_port_process() {
    local port=$1
    local service_name=$2
    
    printf "%-20s: " "$service_name"
    
    local pid=$(lsof -ti:$port 2>/dev/null)
    if [ ! -z "$pid" ]; then
        echo -e "${GREEN}✅ Running${NC} (port $port, PID: $pid)"
        return 0
    else
        echo -e "${RED}❌ Not running${NC} (port $port)"
        return 1
    fi
}

# Function to check database connection
check_database() {
    printf "%-20s: " "Database"
    
    if psql -d "$DATABASE_NAME" -c "SELECT 1;" >/dev/null 2>&1; then
        local count=$(psql -d "$DATABASE_NAME" -t -c "SELECT COUNT(*) FROM service_requests;" 2>/dev/null | xargs)
        if [ ! -z "$count" ]; then
            echo -e "${GREEN}✅ Connected${NC} ($count requests in database)"
        else
            echo -e "${GREEN}✅ Connected${NC} (unable to count records)"
        fi
        return 0
    else
        echo -e "${RED}❌ Connection failed${NC}"
        return 1
    fi
}

# Function to check system resources
check_system_resources() {
    echo ""
    echo -e "${BLUE}📊 System Resources:${NC}"
    
    # Check disk space
    local disk_usage=$(df -h . | awk 'NR==2 {print $5}' | sed 's/%//')
    printf "%-20s: " "Disk Usage"
    if [ "$disk_usage" -lt 90 ]; then
        echo -e "${GREEN}$disk_usage%${NC} (available)"
    else
        echo -e "${RED}$disk_usage%${NC} (low space warning)"
    fi
    
    # Check memory usage (if available)
    if command -v free >/dev/null 2>&1; then
        local mem_usage=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100.0}')
        printf "%-20s: " "Memory Usage"
        if [ "$mem_usage" -lt 85 ]; then
            echo -e "${GREEN}$mem_usage%${NC} (normal)"
        else
            echo -e "${YELLOW}$mem_usage%${NC} (high usage)"
        fi
    elif command -v vm_stat >/dev/null 2>&1; then
        # macOS memory check
        printf "%-20s: " "Memory Usage"
        echo -e "${GREEN}Available${NC} (macOS system)"
    fi
    
    # Check Node.js version
    if command -v node >/dev/null 2>&1; then
        local node_version=$(node -v)
        printf "%-20s: " "Node.js Version"
        echo -e "${GREEN}$node_version${NC}"
    fi
    
    # Check PostgreSQL version
    if command -v psql >/dev/null 2>&1; then
        local pg_version=$(psql --version | awk '{print $3}')
        printf "%-20s: " "PostgreSQL"
        echo -e "${GREEN}$pg_version${NC}"
    fi
}

# Function to check API endpoints
check_api_endpoints() {
    echo ""
    echo -e "${BLUE}🌐 API Endpoints:${NC}"
    
    # Health endpoint
    printf "%-25s: " "Health Check"
    if curl -s "http://localhost:$BACKEND_PORT/health" >/dev/null 2>&1; then
        local response=$(curl -s "http://localhost:$BACKEND_PORT/health" | head -c 100)
        echo -e "${GREEN}✅ Responding${NC}"
    else
        echo -e "${RED}❌ Not responding${NC}"
    fi
    
    # Service requests endpoint
    printf "%-25s: " "Service Requests API"
    if curl -s "http://localhost:$BACKEND_PORT/api/service-requests" >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Responding${NC}"
    else
        echo -e "${RED}❌ Not responding${NC}"
    fi
    
    # Chatbot endpoint
    printf "%-25s: " "Chatbot API"
    if curl -s "http://localhost:$BACKEND_PORT/api/chatbot/welcome" >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Responding${NC}"
    else
        echo -e "${RED}❌ Not responding${NC}"
    fi
}

# Function to check configuration files
check_configuration() {
    echo ""
    echo -e "${BLUE}⚙️  Configuration:${NC}"
    
    # Backend .env file
    printf "%-20s: " "Backend .env"
    if [ -f "backend/.env" ]; then
        echo -e "${GREEN}✅ Present${NC}"
        
        # Check for required variables
        if grep -q "OPENAI_API_KEY.*your_openai_api_key_here\|OPENAI_API_KEY=\"\"" backend/.env; then
            echo -e "${YELLOW}   ⚠️  OpenAI API key needs to be set${NC}"
        fi
        
        if grep -q "ANTHROPIC_API_KEY.*your_anthropic_api_key_here\|ANTHROPIC_API_KEY=\"\"" backend/.env; then
            echo -e "${YELLOW}   ⚠️  Anthropic API key needs to be set${NC}"
        fi
    else
        echo -e "${RED}❌ Missing${NC}"
    fi
    
    # Database schema
    printf "%-20s: " "Database Schema"
    if [ -f "database/schema.sql" ]; then
        echo -e "${GREEN}✅ Present${NC}"
    else
        echo -e "${RED}❌ Missing${NC}"
    fi
    
    # Package files
    printf "%-20s: " "Backend Package"
    if [ -f "backend/package.json" ]; then
        echo -e "${GREEN}✅ Present${NC}"
    else
        echo -e "${RED}❌ Missing${NC}"
    fi
    
    printf "%-20s: " "Frontend Package"
    if [ -f "frontend/package.json" ]; then
        echo -e "${GREEN}✅ Present${NC}"
    else
        echo -e "${RED}❌ Missing${NC}"
    fi
}

# Main health check
echo -e "${BLUE}🔍 Service Status:${NC}"
backend_status=0
frontend_status=0
websocket_status=0
database_status=0

# Check services
if ! check_http_service $BACKEND_PORT "Backend API" "/health"; then
    backend_status=1
fi

if ! check_port_process $FRONTEND_PORT "Frontend"; then
    frontend_status=1
fi

if ! check_port_process $WEBSOCKET_PORT "WebSocket Server"; then
    websocket_status=1
fi

if ! check_database; then
    database_status=1
fi

# Check system resources
check_system_resources

# Check API endpoints if backend is running
if [ $backend_status -eq 0 ]; then
    check_api_endpoints
fi

# Check configuration
check_configuration

# Overall status
echo ""
echo -e "${BLUE}📋 Overall Status:${NC}"
echo "=================="

total_issues=$((backend_status + frontend_status + websocket_status + database_status))

if [ $total_issues -eq 0 ]; then
    echo -e "${GREEN}🎉 All systems are operational!${NC}"
    echo -e "${GREEN}✨ SRM system is ready to handle requests${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Found $total_issues issue(s)${NC}"
    
    if [ $backend_status -eq 1 ]; then
        echo -e "${RED}   • Backend API is not running${NC}"
    fi
    if [ $frontend_status -eq 1 ]; then
        echo -e "${RED}   • Frontend is not running${NC}"
    fi
    if [ $websocket_status -eq 1 ]; then
        echo -e "${RED}   • WebSocket server is not running${NC}"
    fi
    if [ $database_status -eq 1 ]; then
        echo -e "${RED}   • Database connection failed${NC}"
    fi
    
    echo ""
    echo -e "${YELLOW}💡 To start the system:${NC} ./start-system.sh"
    echo -e "${YELLOW}💡 To initialize database:${NC} ./scripts/init-database.sh"
    exit 1
fi
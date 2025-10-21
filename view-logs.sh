#!/bin/bash

# Service Request Management System - Log Viewer Script
# This script helps view and monitor logs from SRM system components

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
LOG_DIR="logs"
BACKEND_LOG="$LOG_DIR/backend.log"
FRONTEND_LOG="$LOG_DIR/frontend.log"

echo -e "${BLUE}📋 SRM System Log Viewer${NC}"
echo "========================"
echo ""

# Create logs directory if it doesn't exist
mkdir -p "$LOG_DIR"

# Function to show menu
show_menu() {
    echo -e "${BLUE}Select logs to view:${NC}"
    echo "1. Backend logs (real-time)"
    echo "2. Frontend logs (real-time)" 
    echo "3. System processes"
    echo "4. Database logs"
    echo "5. All logs (combined)"
    echo "6. Error logs only"
    echo "7. Exit"
    echo ""
    read -p "Enter your choice (1-7): " choice
}

# Function to view backend logs
view_backend_logs() {
    echo -e "${GREEN}📊 Backend Logs (Press Ctrl+C to stop)${NC}"
    echo "======================================="
    
    if [ -f .backend.pid ]; then
        local pid=$(cat .backend.pid)
        if kill -0 "$pid" 2>/dev/null; then
            # If backend is running, follow its output
            echo -e "${YELLOW}Following backend process logs...${NC}"
            tail -f /proc/$pid/fd/1 2>/dev/null || {
                echo -e "${YELLOW}Unable to follow process logs, checking log files...${NC}"
                if [ -f "$BACKEND_LOG" ]; then
                    tail -f "$BACKEND_LOG"
                else
                    echo -e "${RED}No backend log file found${NC}"
                fi
            }
        else
            echo -e "${YELLOW}Backend not running, showing recent logs...${NC}"
            if [ -f "$BACKEND_LOG" ]; then
                tail -n 50 "$BACKEND_LOG"
            else
                echo -e "${RED}No backend log file found${NC}"
            fi
        fi
    else
        echo -e "${YELLOW}Backend PID file not found${NC}"
        # Try to find backend logs in common locations
        if [ -f "backend/logs/app.log" ]; then
            tail -f "backend/logs/app.log"
        elif [ -f "$BACKEND_LOG" ]; then
            tail -f "$BACKEND_LOG"
        else
            echo -e "${RED}No backend logs found${NC}"
        fi
    fi
}

# Function to view frontend logs
view_frontend_logs() {
    echo -e "${GREEN}🌐 Frontend Logs (Press Ctrl+C to stop)${NC}"
    echo "========================================"
    
    if [ -f .frontend.pid ]; then
        local pid=$(cat .frontend.pid)
        if kill -0 "$pid" 2>/dev/null; then
            echo -e "${YELLOW}Following frontend process logs...${NC}"
            tail -f /proc/$pid/fd/1 2>/dev/null || {
                echo -e "${YELLOW}Unable to follow process logs, checking log files...${NC}"
                if [ -f "$FRONTEND_LOG" ]; then
                    tail -f "$FRONTEND_LOG"
                else
                    echo -e "${RED}No frontend log file found${NC}"
                fi
            }
        else
            echo -e "${YELLOW}Frontend not running, showing recent logs...${NC}"
            if [ -f "$FRONTEND_LOG" ]; then
                tail -n 50 "$FRONTEND_LOG"
            else
                echo -e "${RED}No frontend log file found${NC}"
            fi
        fi
    else
        echo -e "${YELLOW}Frontend PID file not found${NC}"
        if [ -f "$FRONTEND_LOG" ]; then
            tail -f "$FRONTEND_LOG"
        else
            echo -e "${RED}No frontend logs found${NC}"
        fi
    fi
}

# Function to view system processes
view_system_processes() {
    echo -e "${GREEN}⚙️  System Processes${NC}"
    echo "===================="
    
    echo -e "${BLUE}Node.js processes:${NC}"
    ps aux | grep node | grep -v grep | head -10
    
    echo ""
    echo -e "${BLUE}Processes on SRM ports:${NC}"
    echo "Port 3000 (Frontend):"
    lsof -i :3000 2>/dev/null || echo "  No process found"
    
    echo "Port 3001 (Backend):"
    lsof -i :3001 2>/dev/null || echo "  No process found"
    
    echo "Port 3002 (WebSocket):"
    lsof -i :3002 2>/dev/null || echo "  No process found"
    
    echo ""
    echo -e "${BLUE}PostgreSQL processes:${NC}"
    ps aux | grep postgres | grep -v grep || echo "No PostgreSQL processes found"
}

# Function to view database logs
view_database_logs() {
    echo -e "${GREEN}🗄️  Database Logs${NC}"
    echo "================="
    
    # Try to find PostgreSQL log directory
    local pg_log_dirs=(
        "/usr/local/var/log/postgresql"
        "/var/log/postgresql" 
        "/opt/homebrew/var/log/postgresql"
        "/usr/local/var/postgres"
    )
    
    local found_logs=false
    for log_dir in "${pg_log_dirs[@]}"; do
        if [ -d "$log_dir" ] && [ "$(ls -A $log_dir 2>/dev/null)" ]; then
            echo -e "${YELLOW}Found PostgreSQL logs in: $log_dir${NC}"
            ls -lt "$log_dir"/*.log 2>/dev/null | head -5
            echo ""
            echo -e "${BLUE}Recent database activity:${NC}"
            tail -n 20 "$log_dir"/*.log 2>/dev/null | head -50
            found_logs=true
            break
        fi
    done
    
    if [ "$found_logs" = false ]; then
        echo -e "${YELLOW}PostgreSQL logs not found in common locations${NC}"
        echo -e "${YELLOW}You may need to check your PostgreSQL configuration for log location${NC}"
    fi
    
    echo ""
    echo -e "${BLUE}Database connections:${NC}"
    psql -d srm_db -c "SELECT count(*) as active_connections FROM pg_stat_activity WHERE state = 'active';" 2>/dev/null || echo "Unable to connect to database"
}

# Function to view combined logs
view_combined_logs() {
    echo -e "${GREEN}📋 Combined Logs (Press Ctrl+C to stop)${NC}"
    echo "======================================"
    
    local log_files=()
    
    if [ -f "$BACKEND_LOG" ]; then
        log_files+=("$BACKEND_LOG")
    fi
    
    if [ -f "$FRONTEND_LOG" ]; then
        log_files+=("$FRONTEND_LOG")
    fi
    
    if [ ${#log_files[@]} -gt 0 ]; then
        tail -f "${log_files[@]}"
    else
        echo -e "${YELLOW}No log files found, monitoring process outputs...${NC}"
        
        if [ -f .backend.pid ] && [ -f .frontend.pid ]; then
            local backend_pid=$(cat .backend.pid)
            local frontend_pid=$(cat .frontend.pid)
            
            if kill -0 "$backend_pid" 2>/dev/null && kill -0 "$frontend_pid" 2>/dev/null; then
                echo -e "${BLUE}Monitoring backend (PID: $backend_pid) and frontend (PID: $frontend_pid)...${NC}"
                # This is a simplified monitoring - in practice, you might want to use a more sophisticated approach
                while true; do
                    echo -e "${BLUE}[$(date)] System Status:${NC}"
                    ./check-system.sh --brief 2>/dev/null || echo "Status check failed"
                    sleep 10
                done
            else
                echo -e "${RED}Services not running${NC}"
            fi
        else
            echo -e "${RED}No services running${NC}"
        fi
    fi
}

# Function to view error logs only
view_error_logs() {
    echo -e "${GREEN}🚨 Error Logs${NC}"
    echo "============="
    
    echo -e "${BLUE}Recent errors from all sources:${NC}"
    
    # Check backend logs for errors
    if [ -f "$BACKEND_LOG" ]; then
        echo -e "${YELLOW}Backend errors:${NC}"
        grep -i "error\|fail\|exception" "$BACKEND_LOG" | tail -n 10 || echo "No errors found in backend logs"
        echo ""
    fi
    
    # Check frontend logs for errors
    if [ -f "$FRONTEND_LOG" ]; then
        echo -e "${YELLOW}Frontend errors:${NC}"
        grep -i "error\|fail\|exception" "$FRONTEND_LOG" | tail -n 10 || echo "No errors found in frontend logs"
        echo ""
    fi
    
    # Check system logs
    echo -e "${YELLOW}System errors (last 24 hours):${NC}"
    if command -v journalctl >/dev/null 2>&1; then
        journalctl --since="24 hours ago" --priority=err | tail -n 10 || echo "No system errors found"
    elif [ -f /var/log/syslog ]; then
        grep -i error /var/log/syslog | tail -n 10 || echo "No system errors found"
    else
        echo "System log not accessible"
    fi
    
    # Check for Node.js crashes
    echo ""
    echo -e "${YELLOW}Recent Node.js crashes:${NC}"
    ps aux | grep node | grep -v grep >/dev/null || echo "No Node.js processes currently running"
}

# Main loop
while true; do
    show_menu
    
    case $choice in
        1)
            view_backend_logs
            ;;
        2)
            view_frontend_logs
            ;;
        3)
            view_system_processes
            echo ""
            read -p "Press Enter to continue..."
            ;;
        4)
            view_database_logs
            echo ""
            read -p "Press Enter to continue..."
            ;;
        5)
            view_combined_logs
            ;;
        6)
            view_error_logs
            echo ""
            read -p "Press Enter to continue..."
            ;;
        7)
            echo -e "${GREEN}👋 Goodbye!${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid choice. Please select 1-7.${NC}"
            ;;
    esac
    
    echo ""
    echo "================================"
    echo ""
done
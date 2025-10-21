#!/bin/bash

# Database initialization script for SRM system

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

DATABASE_NAME="srm_db"
DATABASE_USER="srm_user"
SCHEMA_FILE="./database/schema.sql"

echo -e "${BLUE}🗄️  Initializing SRM Database${NC}"
echo "================================="

# Check if PostgreSQL is running
if ! pg_isready >/dev/null 2>&1; then
    echo -e "${RED}❌ PostgreSQL is not running${NC}"
    echo -e "${YELLOW}Please start PostgreSQL and try again${NC}"
    echo -e "${YELLOW}macOS: brew services start postgresql${NC}"
    echo -e "${YELLOW}Linux: sudo systemctl start postgresql${NC}"
    exit 1
fi

echo -e "${GREEN}✅ PostgreSQL is running${NC}"

# Check if schema file exists
if [ ! -f "$SCHEMA_FILE" ]; then
    echo -e "${RED}❌ Schema file not found: $SCHEMA_FILE${NC}"
    exit 1
fi

# Function to run SQL command
run_sql() {
    local sql="$1"
    local description="$2"
    
    echo -e "${YELLOW}$description...${NC}"
    if psql postgres -v ON_ERROR_STOP=1 -c "$sql" >/dev/null 2>&1; then
        echo -e "${GREEN}✅ $description completed${NC}"
    else
        echo -e "${RED}❌ Failed: $description${NC}"
        return 1
    fi
}

# Function to run SQL file
run_sql_file() {
    local file="$1"
    local description="$2"
    
    echo -e "${YELLOW}$description...${NC}"
    if psql -v ON_ERROR_STOP=1 -d "$DATABASE_NAME" -f "$file" >/dev/null 2>&1; then
        echo -e "${GREEN}✅ $description completed${NC}"
    else
        echo -e "${RED}❌ Failed: $description${NC}"
        return 1
    fi
}

# Ask user for confirmation
echo -e "${YELLOW}⚠️  This will create/recreate the database: $DATABASE_NAME${NC}"
echo -e "${YELLOW}   Any existing data will be lost!${NC}"
read -p "Do you want to continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}🚫 Database initialization cancelled${NC}"
    exit 0
fi

# Drop existing database if it exists
echo -e "${BLUE}🗑️  Cleaning up existing database...${NC}"
psql -c "DROP DATABASE IF EXISTS $DATABASE_NAME;" >/dev/null 2>&1
psql -c "DROP USER IF EXISTS $DATABASE_USER;" >/dev/null 2>&1

# Create database user
run_sql "CREATE USER $DATABASE_USER WITH PASSWORD 'srm_password';" "Creating database user"

# Create database
run_sql "CREATE DATABASE $DATABASE_NAME OWNER $DATABASE_USER;" "Creating database"

# Grant privileges
run_sql "GRANT ALL PRIVILEGES ON DATABASE $DATABASE_NAME TO $DATABASE_USER;" "Granting privileges"

# Run schema file
echo -e "${BLUE}📊 Running database schema...${NC}"
run_sql_file "$SCHEMA_FILE" "Creating tables and schema"

# Insert sample data (optional)
echo -e "${BLUE}🌱 Adding sample data...${NC}"
psql -d "$DATABASE_NAME" -c "
-- Sample service request
INSERT INTO service_requests (
    title, 
    description, 
    status, 
    priority, 
    category,
    customer_name, 
    customer_email,
    created_at
) VALUES (
    'Test Service Request', 
    'This is a sample service request for testing purposes.', 
    'new', 
    'medium', 
    'technical_support',
    'John Doe', 
    'john.doe@example.com',
    NOW()
);
" >/dev/null 2>&1

echo -e "${GREEN}✅ Sample data added${NC}"

# Test database connection
echo -e "${BLUE}🔍 Testing database connection...${NC}"
if psql -d "$DATABASE_NAME" -c "SELECT COUNT(*) FROM service_requests;" >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Database connection test successful${NC}"
else
    echo -e "${RED}❌ Database connection test failed${NC}"
    exit 1
fi

# Create .env file if it doesn't exist
ENV_FILE="./backend/.env"
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${BLUE}📝 Creating backend .env file...${NC}"
    cat > "$ENV_FILE" << EOF
# Database Configuration
DATABASE_URL=postgresql://$DATABASE_USER:srm_password@localhost:5432/$DATABASE_NAME

# Server Configuration
PORT=3001
NODE_ENV=development

# WebSocket Configuration
WEBSOCKET_PORT=3002

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# AI Configuration (Update with your API keys)
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
AI_OPENAI_MODEL=gpt-4
AI_ANTHROPIC_MODEL=claude-3-sonnet-20240229

# Logging
LOG_LEVEL=info
EOF
    echo -e "${GREEN}✅ Backend .env file created${NC}"
    echo -e "${YELLOW}⚠️  Please update the AI API keys in backend/.env${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Database initialization completed successfully!${NC}"
echo "=================================================="
echo -e "${BLUE}📋 Database Details:${NC}"
echo -e "   Database: ${GREEN}$DATABASE_NAME${NC}"
echo -e "   User:     ${GREEN}$DATABASE_USER${NC}"
echo -e "   Password: ${GREEN}srm_password${NC}"
echo -e "   Host:     ${GREEN}localhost${NC}"
echo -e "   Port:     ${GREEN}5432${NC}"
echo ""
echo -e "${BLUE}🔗 Connection String:${NC}"
echo -e "   ${GREEN}postgresql://$DATABASE_USER:srm_password@localhost:5432/$DATABASE_NAME${NC}"
echo ""
echo -e "${YELLOW}💡 Next Steps:${NC}"
echo -e "   1. Update AI API keys in ${GREEN}backend/.env${NC}"
echo -e "   2. Run ${GREEN}./start-system.sh${NC} to start the application"
echo ""
echo -e "${GREEN}✨ Happy coding!${NC}"
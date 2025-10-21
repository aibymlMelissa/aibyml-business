-- Service Request Management Database Schema

-- Enum types for workflow states and priorities
CREATE TYPE request_status AS ENUM (
    'new',
    'registered', 
    'classified',
    'request_fulfilled',
    'aborted',
    'closed'
);

CREATE TYPE request_priority AS ENUM (
    'low',
    'medium', 
    'high',
    'critical'
);

CREATE TYPE request_category AS ENUM (
    'technical_support',
    'account_management',
    'billing',
    'general_inquiry',
    'complaint',
    'feature_request'
);

-- Service Requests table
CREATE TABLE service_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status request_status DEFAULT 'new',
    priority request_priority DEFAULT 'medium',
    category request_category,
    
    -- Customer information
    customer_name VARCHAR(255),
    customer_email VARCHAR(255),
    customer_phone VARCHAR(50),
    
    -- Classification data
    classification_confidence DECIMAL(3,2),
    classification_notes TEXT,
    
    -- AI processing metadata
    ai_classification_engine VARCHAR(100),
    ai_handling_engine VARCHAR(100),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    registered_at TIMESTAMP,
    classified_at TIMESTAMP,
    fulfilled_at TIMESTAMP,
    closed_at TIMESTAMP,
    
    -- Assignment
    assigned_to VARCHAR(255),
    department VARCHAR(100),
    
    CONSTRAINT valid_email CHECK (customer_email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$')
);

-- Workflow State History
CREATE TABLE workflow_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID REFERENCES service_requests(id) ON DELETE CASCADE,
    from_status request_status,
    to_status request_status NOT NULL,
    changed_by VARCHAR(255),
    change_reason TEXT,
    ai_confidence DECIMAL(3,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI Processing Logs
CREATE TABLE ai_processing_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID REFERENCES service_requests(id) ON DELETE CASCADE,
    engine_name VARCHAR(100) NOT NULL,
    engine_type VARCHAR(50) NOT NULL, -- 'classification', 'handling'
    input_data JSONB,
    output_data JSONB,
    confidence_score DECIMAL(3,2),
    processing_time_ms INTEGER,
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Request Attachments
CREATE TABLE request_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID REFERENCES service_requests(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT,
    mime_type VARCHAR(100),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Request Comments/Updates
CREATE TABLE request_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID REFERENCES service_requests(id) ON DELETE CASCADE,
    update_type VARCHAR(50) NOT NULL, -- 'comment', 'status_change', 'assignment'
    content TEXT,
    created_by VARCHAR(255),
    is_internal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_service_requests_status ON service_requests(status);
CREATE INDEX idx_service_requests_created_at ON service_requests(created_at);
CREATE INDEX idx_service_requests_customer_email ON service_requests(customer_email);
CREATE INDEX idx_workflow_history_request_id ON workflow_history(request_id);
CREATE INDEX idx_ai_processing_logs_request_id ON ai_processing_logs(request_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_service_requests_updated_at 
    BEFORE UPDATE ON service_requests 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
# 🚀 Service Request Management System (SRM)

A modern, AI-powered service request management system built with TypeScript, featuring conversational AI chatbot, real-time updates, and automated workflow processing. Transform how you handle service requests with intelligent classification, natural language processing, and seamless user experience.

## ✨ Key Features

🤖 **AI Chatbot Interface** - Natural language conversation for request creation  
🎤 **Voice Input Support** - Speech-to-text for accessibility  
🗣️ **Talking Avatar** - Text-to-speech responses with future 3D avatar support  
⚡ **Real-time Updates** - WebSocket-powered live notifications  
🧠 **Dual AI Engines** - OpenAI + Anthropic for intelligent processing  
📊 **Comprehensive Dashboard** - Modern React interface with real-time data  
🔄 **Automated Workflow** - Smart status transitions and escalation  
📝 **Form Pre-filling** - AI extracts data from conversations to populate forms

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (React TS)    │◄──►│   (Express TS)  │◄──►│ (PostgreSQL)    │
│   Port: 3000    │    │   Port: 3001    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                       ┌─────────────────┐
                       │   WebSocket     │
                       │   Port: 3002    │
                       └─────────────────┘
```

### 🎯 Backend (`/backend`)
- **Express.js** TypeScript API server with comprehensive validation
- **PostgreSQL** database with optimized schema and indexes
- **Triple AI Integration**:
  - 🧠 **OpenAI GPT-4** - Request classification and analysis
  - 🤖 **Anthropic Claude** - Conversational responses and handling
  - 💬 **Chatbot Engine** - Natural language processing for conversations
- **WebSocket Server** - Real-time bidirectional communication
- **Automated Workflows** - State management and transition logic
- **Comprehensive Logging** - AI processing metrics and audit trails

### 🌐 Frontend (`/frontend`)
- **React 19** with TypeScript for type safety
- **Vite** for lightning-fast development and builds
- **Tailwind CSS** for modern, responsive styling
- **Zustand** for efficient state management
- **Conversational UI** - Advanced chatbot interface with voice support
- **Real-time Updates** - WebSocket integration for live data
- **Accessibility** - Screen reader support and keyboard navigation
- **PWA Ready** - Installable web application

### 🗄️ Database (`/database`)
- **PostgreSQL** with comprehensive schema design
- **Workflow Tracking** - Complete audit trail of state changes
- **AI Processing Logs** - Detailed metrics and performance data
- **Optimized Indexes** - Fast queries and efficient data retrieval
- **Data Validation** - Database-level constraints and checks

## 🚀 Quick Start

### 📋 Prerequisites
- **Node.js** 18.0+ ([Download](https://nodejs.org/))
- **PostgreSQL** 12.0+ ([Download](https://www.postgresql.org/download/))
- **OpenAI API Key** ([Get yours](https://platform.openai.com/api-keys))
- **Anthropic API Key** ([Get yours](https://console.anthropic.com/))

### ⚡ One-Command Setup

```bash
# 1. Initialize database and configuration
./scripts/init-database.sh

# 2. Add your API keys to backend/.env
nano backend/.env

# 3. Start the entire system
./start-system.sh
```

**That's it! 🎉** Your SRM system will be running at:
- 🌐 **Frontend**: http://localhost:3000
- 🔧 **Backend**: http://localhost:3001
- 💓 **Health Check**: http://localhost:3001/health

### 📚 Available Scripts

| Script | Purpose |
|--------|---------|
| `./start-system.sh` | 🚀 Start all services (dev mode) |
| `./start-system.sh --production` | 🏭 Start in production mode |
| `./stop-system.sh` | 🛑 Stop all services |
| `./check-system.sh` | 🔍 Health check all components |
| `./view-logs.sh` | 📋 Interactive log viewer |
| `./scripts/init-database.sh` | 🗄️ Initialize/reset database |

### 🔧 Manual Setup (if needed)

<details>
<summary>Click to expand manual setup instructions</summary>

1. **Database Setup**:
```bash
./scripts/init-database.sh
# Creates database, user, schema, and sample data
```

2. **Backend Setup**:
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your API keys
npm run build
npm start
```

3. **Frontend Setup**:
```bash
cd frontend
npm install
npm run dev
```

</details>

## 🔄 Intelligent Workflow

The SRM system follows an automated workflow with AI-powered decision making:

```
🆕 New Request
    ↓ (Auto-validation)
📝 Registered  
    ↓ (OpenAI GPT-4 Analysis)
🧠 Classified
    ↓ (Anthropic Claude Processing)
⚡ Fulfilled / 🚨 Aborted
    ↓ (Manual/Auto closure)
✅ Closed
```

### 📋 Workflow Stages

1. **🆕 New Request**
   - User creates request via form or AI chatbot
   - Basic validation and data sanitization
   - WebSocket notification sent

2. **📝 Registration** 
   - System validates required fields
   - Assigns unique ID and timestamps
   - Status updated to 'registered'

3. **🧠 AI Classification**
   - **OpenAI GPT-4** analyzes request content
   - Determines category, priority, and department
   - Confidence scoring and reasoning provided
   - Status updated to 'classified'

4. **⚡ AI Handling**
   - **Anthropic Claude** processes classified request
   - Generates detailed resolution recommendations
   - Estimates completion time and effort
   - Decides if human intervention required

5. **🎯 Resolution**
   - **Fulfilled**: AI successfully resolved the request
   - **Aborted**: Requires human intervention or escalation
   - Real-time updates sent to dashboard

6. **✅ Closure**
   - Final status confirmation
   - Workflow history preserved
   - Analytics and reporting data updated

## 🌐 API Endpoints

### 📝 Service Requests
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/service-requests` | 🆕 Create new request |
| `GET` | `/api/service-requests` | 📋 List all requests with filtering |
| `GET` | `/api/service-requests/:id` | 🔍 Get specific request details |
| `PUT` | `/api/service-requests/:id` | ✏️ Update request information |

### 🔄 Workflow Actions  
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/service-requests/:id/register` | 📝 Register and validate request |
| `POST` | `/api/service-requests/:id/classify` | 🧠 AI classification with OpenAI |
| `POST` | `/api/service-requests/:id/handle` | ⚡ AI handling with Anthropic |
| `POST` | `/api/service-requests/:id/close` | ✅ Close completed request |
| `POST` | `/api/service-requests/:id/abort` | 🚨 Abort request (needs human help) |

### 🤖 Chatbot API
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/chatbot/conversation` | 💬 Process conversational message |
| `GET` | `/api/chatbot/welcome` | 👋 Get welcome message |

### 🔧 System Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | 💓 System health check and status |

## ⚡ Real-time Features

The system provides seamless real-time updates via **WebSocket** connection:

### 📡 Live Notifications
- 🆕 **New Request Creation** - Instant dashboard updates
- 🔄 **Status Changes** - Real-time workflow progression  
- 🧠 **AI Processing** - Live AI analysis completion
- 👤 **Assignment Updates** - Immediate assignment notifications
- ✅ **Request Closure** - Final status confirmations
- 🚨 **System Alerts** - Error notifications and warnings

### 🎮 Interactive Features
- **Live Dashboard** - Auto-refreshing request counters and status
- **Real-time Chat** - Instant AI chatbot responses
- **Progress Indicators** - Live workflow stage visualization
- **Notification Toasts** - User-friendly status updates

## 🤖 Advanced AI Integration

### 🧠 Classification Engine (OpenAI GPT-4)
```typescript
// AI Classification Result
{
  category: 'technical_support' | 'billing' | 'complaint' | ...,
  priority: 'low' | 'medium' | 'high' | 'critical',
  confidence: 0.95, // 0.0 - 1.0
  reasoning: "Detailed explanation of classification logic",
  suggestedDepartment: "IT Support"
}
```

### 🤖 Handling Engine (Anthropic Claude)
```typescript
// AI Handling Result  
{
  recommendedAction: "Step-by-step resolution plan",
  estimatedResolutionTime: "2-4 hours",
  confidence: 0.87,
  reasoning: "Detailed analysis and recommendation logic", 
  requiresHumanIntervention: false
}
```

### 💬 Conversational AI (Chatbot)
- **Natural Language Processing** - Understands user intent and context
- **Smart Form Pre-filling** - Extracts structured data from conversations
- **Voice Input Support** - Speech-to-text integration
- **Context Awareness** - Maintains conversation history
- **Multi-turn Conversations** - Asks clarifying questions when needed

## 👩‍💻 Development

### 🛠️ Development Commands

| Component | Command | Description |
|-----------|---------|-------------|
| **System** | `./start-system.sh` | 🚀 Start all services in dev mode |
| **System** | `./check-system.sh` | 🔍 Health check all components |
| **System** | `./view-logs.sh` | 📋 Interactive log viewer |

### 🎯 Backend Development
```bash
cd backend
npm run dev          # 🔄 Development server with hot reload
npm run build        # 🔨 Build TypeScript to JavaScript  
npm run typecheck    # ✅ Type checking without emit
npm run lint         # 🧹 ESLint code linting
npm start            # 🚀 Start production server
```

### 🌐 Frontend Development  
```bash
cd frontend
npm run dev          # 🔄 Vite dev server with hot reload
npm run build        # 📦 Production build with optimization
npm run typecheck    # ✅ TypeScript type checking
npm run lint         # 🧹 ESLint code linting  
npm run preview      # 👀 Preview production build
```

### 🗄️ Database Management
```bash
./scripts/init-database.sh    # 🔄 Initialize/reset database
psql srm_db                   # 🐘 Connect to database directly
```

## 📊 Monitoring & Debugging

### 🔍 Health Monitoring
- **System Status**: `./check-system.sh` - Complete health check
- **API Health**: `curl http://localhost:3001/health` - Backend health
- **Database**: `psql -d srm_db -c "SELECT COUNT(*) FROM service_requests;"` - DB connectivity

### 📋 Log Management
- **Interactive Logs**: `./view-logs.sh` - Menu-driven log viewer
- **Backend Logs**: View real-time API and processing logs
- **Frontend Logs**: Development server and build logs
- **Database Logs**: PostgreSQL activity and error logs
- **Error Filtering**: View only errors and warnings

### 🐛 Troubleshooting
| Issue | Solution |
|-------|----------|
| Port conflicts | `./stop-system.sh` then restart |
| Database connection failed | `./scripts/init-database.sh` |
| Missing dependencies | Check `node_modules` directories |
| API key errors | Verify keys in `backend/.env` |
| TypeScript errors | Run `npm run typecheck` in affected component |

## 🚀 Future Enhancements

### 🎭 3D Talking Avatar
- **Ready Player Me Integration** - Professional 3D avatars
- **Facial Animation** - Lip-sync with speech synthesis  
- **Emotion Expression** - Context-aware facial expressions
- **Custom Avatars** - User-selectable avatar appearances

### 🧠 Advanced AI Features
- **Multi-language Support** - Conversations in multiple languages
- **Sentiment Analysis** - Detect user emotion and urgency levels
- **Learning System** - Improve responses based on feedback
- **Voice Cloning** - Custom AI voice personalities

### 📱 Mobile & Accessibility
- **Progressive Web App** - Installable mobile application
- **Offline Support** - Basic functionality without internet
- **Screen Reader** - Full accessibility compliance
- **Voice Navigation** - Complete hands-free operation

### 🔒 Enterprise Features
- **Single Sign-On** - Integration with enterprise authentication
- **Role-Based Access** - Granular permission system
- **Advanced Analytics** - Detailed reporting and insights
- **API Rate Limiting** - Enterprise-grade API protection

## 📄 Documentation

- 📖 **[Startup Guide](STARTUP_GUIDE.md)** - Comprehensive setup instructions
- ⚡ **[Quick Reference](QUICK_REFERENCE.md)** - One-page command reference  
- 🤖 **[Chatbot Features](CHATBOT_FEATURE.md)** - Detailed chatbot documentation
- 🔧 **API Documentation** - Interactive API docs at `/api/docs` (coming soon)

## 🤝 Contributing

1. **Fork the Repository** - Create your own copy
2. **Feature Branch** - `git checkout -b feature/amazing-feature`
3. **Development** - Make your changes with tests
4. **Quality Checks** - Run `./check-system.sh` and fix any issues
5. **Commit** - `git commit -m 'Add amazing feature'`  
6. **Pull Request** - Submit your changes for review

### 📋 Contribution Guidelines
- Follow existing TypeScript and React patterns
- Add comprehensive error handling
- Include unit tests for new features
- Update documentation for user-facing changes
- Maintain accessibility standards

## 📞 Support

### 🐛 Issues & Bug Reports
- **System Issues**: Run `./check-system.sh` for diagnostic information
- **Log Analysis**: Use `./view-logs.sh` to identify specific errors
- **Database Issues**: Check PostgreSQL logs and connection settings
- **AI Integration**: Verify API keys and model availability

### 💡 Feature Requests
We welcome suggestions for new features! Consider:
- User experience improvements
- AI capability enhancements  
- Performance optimizations
- Accessibility features
- Integration possibilities

---

**🎉 Ready to transform your service request management? Start with `./start-system.sh` and experience the future of AI-powered customer service!**
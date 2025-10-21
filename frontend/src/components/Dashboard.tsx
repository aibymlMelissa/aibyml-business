import { useEffect, useState } from 'react';
import { useRequestStore } from '../store/requestStore.js';
import { useWebSocket } from '../hooks/useWebSocket.js';
import { RequestForm } from './RequestForm.jsx';
import { RequestCard } from './RequestCard.jsx';
import { RequestDetails } from './RequestDetails.jsx';
import { Chatbot } from './Chatbot.jsx';
import type { RequestStatus, CreateServiceRequestDTO, ServiceRequest } from '../types/index.js';
import { Plus, Filter, Wifi, WifiOff, Bot, Clock, AlertCircle, CheckCircle2, TrendingUp, Users, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

export function Dashboard() {
  const {
    requests,
    loading,
    error,
    selectedRequest,
    fetchRequests,
    createRequest,
    selectRequest,
    updateRequestInStore,
    addRequestToStore
  } = useRequestStore();

  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState<RequestStatus | 'all'>('all');
  const [chatbotMinimized, setChatbotMinimized] = useState(true);
  const [formPrefillData, setFormPrefillData] = useState<Partial<CreateServiceRequestDTO> | undefined>();
  const [selectedService, setSelectedService] = useState<string>('');

  const services = [
    "AI Bookkeeping Service System via WhatsApp",
    "AI Factory Self-Servced Generate AI Services",
    "AI Legal Assistant Services",
    "AI Recruitment Services",
    "AI Sales Assistant System Services",
    "AI Secretary Service via WhatsApp",
    "AI Strategic Planning Services"
  ];
  
  const { isConnected, lastMessage } = useWebSocket('ws://localhost:8011');

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  useEffect(() => {
    if (lastMessage) {
      handleWebSocketMessage(lastMessage);
    }
  }, [lastMessage]);

  const handleWebSocketMessage = (message: { type: string; data: any }) => {
    switch (message.type) {
      case 'request_created':
        addRequestToStore(message.data);
        toast.success('New service request created');
        break;
      case 'request_registered':
        updateRequestInStore(message.data);
        toast.success('Request registered successfully');
        break;
      case 'request_classified':
        updateRequestInStore(message.data);
        toast.success('Request classified by AI');
        break;
      case 'request_handled':
        updateRequestInStore(message.data.request);
        if (message.data.requiresHuman) {
          toast.error('Request requires human intervention');
        } else {
          toast.success('Request handled automatically');
        }
        break;
      case 'request_closed':
        updateRequestInStore(message.data);
        toast.success('Request closed');
        break;
      case 'request_aborted':
        updateRequestInStore(message.data.request);
        toast.error(`Request aborted: ${message.data.reason || 'Unknown reason'}`);
        break;
      case 'request_updated':
        updateRequestInStore(message.data);
        break;
    }
  };

  const handleCreateRequest = async (data: CreateServiceRequestDTO) => {
    await createRequest(data);
    setShowForm(false);
    setFormPrefillData(undefined);
  };

  const handleChatbotFormPreFill = (data: Partial<CreateServiceRequestDTO>) => {
    setFormPrefillData(data);
    setShowForm(true);
    setChatbotMinimized(true);
    toast.success('Form pre-filled with chatbot data!');
  };

  const handleServiceSelect = (service: string) => {
    setSelectedService(service);
    if (service) {
      setShowForm(true);
      setFormPrefillData({
        title: `Request for ${service}`,
        description: `Service request for: ${service}`
      });
      toast.success(`Selected: ${service}`);
    }
  };

  const filteredRequests = requests.filter(request => 
    statusFilter === 'all' || request.status === statusFilter
  );

  const getStatusCounts = () => {
    return requests.reduce((acc, request) => {
      acc[request.status] = (acc[request.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  };

  const getPriorityBreakdown = () => {
    return requests.reduce((acc, request) => {
      const priority = request.priority || 'low';
      acc[priority] = (acc[priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  };

  const getCategoryBreakdown = () => {
    return requests.reduce((acc, request) => {
      const category = request.category || 'general_inquiry';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  };

  const getTodayStats = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayRequests = requests.filter(req => {
      const createdDate = new Date(req.createdAt);
      return createdDate >= today;
    });

    const completedToday = requests.filter(req => {
      if (!req.closedAt && !req.fulfilledAt) return false;
      const completedDate = new Date(req.closedAt || req.fulfilledAt!);
      return completedDate >= today;
    });

    return {
      created: todayRequests.length,
      completed: completedToday.length,
      pending: requests.filter(r => !['closed', 'request_fulfilled'].includes(r.status)).length
    };
  };

  const getRecentActivity = (): Array<{request: ServiceRequest, activity: string, timestamp: string}> => {
    const activities: Array<{request: ServiceRequest, activity: string, timestamp: string}> = [];
    
    requests.forEach(request => {
      if (request.createdAt) {
        activities.push({
          request,
          activity: 'Created',
          timestamp: request.createdAt
        });
      }
      if (request.registeredAt) {
        activities.push({
          request,
          activity: 'Registered',
          timestamp: request.registeredAt
        });
      }
      if (request.classifiedAt) {
        activities.push({
          request,
          activity: 'Classified',
          timestamp: request.classifiedAt
        });
      }
      if (request.fulfilledAt) {
        activities.push({
          request,
          activity: 'Fulfilled',
          timestamp: request.fulfilledAt
        });
      }
      if (request.closedAt) {
        activities.push({
          request,
          activity: 'Closed',
          timestamp: request.closedAt
        });
      }
    });

    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);
  };

  const statusCounts = getStatusCounts();
  const priorityBreakdown = getPriorityBreakdown();
  const categoryBreakdown = getCategoryBreakdown();
  const todayStats = getTodayStats();
  const recentActivity = getRecentActivity();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="w-full max-w-7xl mx-auto">
        <header className="bg-white shadow-sm border-b rounded-t-lg">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex-1">
                <h1 className="text-2xl text-gray-900">Platform of Request Service</h1>
                <div className="flex items-center gap-2 mt-2">
                  <h2 className="text-2xl font-bold text-gray-900">for the following services</h2>
                  <select
                    value={selectedService}
                    onChange={(e) => handleServiceSelect(e.target.value)}
                    className="ml-2 px-4 py-2 border border-gray-300 rounded-md text-base font-semibold text-gray-700 bg-white hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a service...</option>
                    {services.map((service, index) => (
                      <option key={index} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center mt-2">
                  {isConnected ? (
                    <div className="flex items-center text-green-600">
                      <Wifi className="w-4 h-4 mr-1" />
                      <span className="text-sm">Connected</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600">
                      <WifiOff className="w-4 h-4 mr-1" />
                      <span className="text-sm">Disconnected</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setChatbotMinimized(!chatbotMinimized)}
                  className={`px-4 py-2 rounded-md flex items-center transition-colors ${
                    chatbotMinimized 
                      ? 'bg-green-600 text-white hover:bg-green-700' 
                      : 'bg-gray-600 text-white hover:bg-gray-700'
                  }`}
                >
                  <Bot className="w-4 h-4 mr-2" />
                  {chatbotMinimized ? 'Chat with AI' : 'Hide Chat'}
                </button>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Request
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="bg-white px-4 sm:px-6 lg:px-8 py-6 rounded-b-lg shadow-sm">
        {/* Status Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
          {Object.entries(statusCounts).map(([status, count]) => (
            <div key={status} className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-500 capitalize">
                    {status.replace('_', ' ')}
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{count}</div>
                </div>
                <div className="text-blue-500">
                  {status === 'new' && <Clock className="w-6 h-6" />}
                  {status === 'registered' && <Users className="w-6 h-6" />}
                  {status === 'classified' && <TrendingUp className="w-6 h-6" />}
                  {status === 'request_fulfilled' && <CheckCircle2 className="w-6 h-6" />}
                  {status === 'closed' && <CheckCircle2 className="w-6 h-6" />}
                  {status === 'aborted' && <AlertCircle className="w-6 h-6" />}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Today's Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm opacity-90">Created Today</div>
                <div className="text-3xl font-bold">{todayStats.created}</div>
              </div>
              <Plus className="w-8 h-8 opacity-80" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm opacity-90">Completed Today</div>
                <div className="text-3xl font-bold">{todayStats.completed}</div>
              </div>
              <CheckCircle2 className="w-8 h-8 opacity-80" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm opacity-90">Pending</div>
                <div className="text-3xl font-bold">{todayStats.pending}</div>
              </div>
              <Clock className="w-8 h-8 opacity-80" />
            </div>
          </div>
        </div>

        {/* Priority and Category Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Breakdown</h3>
            <div className="space-y-3">
              {Object.entries(priorityBreakdown).map(([priority, count]) => (
                <div key={priority} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      priority === 'critical' ? 'bg-red-500' :
                      priority === 'high' ? 'bg-orange-500' :
                      priority === 'medium' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}></div>
                    <span className="capitalize text-gray-700">{priority}</span>
                  </div>
                  <span className="font-semibold text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Breakdown</h3>
            <div className="space-y-3">
              {Object.entries(categoryBreakdown).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="capitalize text-gray-700">{category.replace('_', ' ')}</span>
                  <span className="font-semibold text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-3 ${
                    activity.activity === 'Created' ? 'bg-blue-500' :
                    activity.activity === 'Registered' ? 'bg-purple-500' :
                    activity.activity === 'Classified' ? 'bg-yellow-500' :
                    activity.activity === 'Fulfilled' ? 'bg-green-500' :
                    'bg-gray-500'
                  }`}></div>
                  <div>
                    <span className="text-gray-900 font-medium">{activity.request.title}</span>
                    <span className="text-gray-600 mx-2">•</span>
                    <span className="text-gray-600">{activity.activity}</span>
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(activity.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as RequestStatus | 'all')}
              className="px-3 py-1 border border-gray-300 rounded-md"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="registered">Registered</option>
              <option value="classified">Classified</option>
              <option value="request_fulfilled">Fulfilled</option>
              <option value="aborted">Aborted</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {loading ? (
              <div className="text-center py-8">Loading requests...</div>
            ) : (
              <div className="space-y-4">
                {filteredRequests.map((request) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    onClick={() => selectRequest(request)}
                    className={selectedRequest?.id === request.id ? 'ring-2 ring-blue-500' : ''}
                  />
                ))}
                {filteredRequests.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No requests found
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            {showForm ? (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">New Request</h2>
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <RequestForm 
                  onSubmit={handleCreateRequest} 
                  loading={loading} 
                  prefillData={formPrefillData}
                />
              </div>
            ) : selectedRequest ? (
              <RequestDetails request={selectedRequest} />
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
                Select a request to view details
              </div>
            )}
          </div>
        </div>
        </main>
      </div>
      
      {/* Chatbot Component */}
      {showForm && (
        <div className="fixed bottom-4 left-4 w-96 z-40">
          <Chatbot
            onFormPreFill={handleChatbotFormPreFill}
            isMinimized={chatbotMinimized}
            onToggleMinimize={() => setChatbotMinimized(!chatbotMinimized)}
          />
        </div>
      )}
    </div>
  );
}


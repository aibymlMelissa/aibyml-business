import type { ServiceRequest } from '../types/index.js';
import { Clock, User, Mail, Phone, Tag, Building } from 'lucide-react';

interface RequestDetailsProps {
  request: ServiceRequest;
}

export function RequestDetails({ request }: RequestDetailsProps) {
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeColor = (status: string): string => {
    const colors = {
      'new': 'bg-gray-100 text-gray-800',
      'registered': 'bg-blue-100 text-blue-800',
      'classified': 'bg-yellow-100 text-yellow-800',
      'request_fulfilled': 'bg-green-100 text-green-800',
      'aborted': 'bg-red-100 text-red-800',
      'closed': 'bg-gray-100 text-gray-600'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="border-b border-gray-200 pb-4 mb-4">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-semibold text-gray-900">{request.title}</h2>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(request.status)}`}>
            {request.status.replace('_', ' ')}
          </span>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span className="font-medium">ID: {request.id.slice(0, 8)}</span>
          <span className={`px-2 py-1 rounded text-xs ${
            request.priority === 'critical' ? 'bg-red-100 text-red-800' :
            request.priority === 'high' ? 'bg-orange-100 text-orange-800' :
            request.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            {request.priority} priority
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="font-medium text-gray-900 mb-2">Description</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{request.description}</p>
        </div>

        {request.category && (
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Category</h3>
            <div className="flex items-center">
              <Tag className="w-4 h-4 mr-2 text-gray-500" />
              <span className="capitalize">{request.category.replace('_', ' ')}</span>
            </div>
          </div>
        )}

        <div>
          <h3 className="font-medium text-gray-900 mb-2">Customer Information</h3>
          <div className="space-y-2">
            {request.customerName && (
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2 text-gray-500" />
                <span>{request.customerName}</span>
              </div>
            )}
            {request.customerEmail && (
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-gray-500" />
                <span>{request.customerEmail}</span>
              </div>
            )}
            {request.customerPhone && (
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-gray-500" />
                <span>{request.customerPhone}</span>
              </div>
            )}
          </div>
        </div>

        {(request.assignedTo || request.department) && (
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Assignment</h3>
            <div className="space-y-2">
              {request.assignedTo && (
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2 text-gray-500" />
                  <span>Assigned to: {request.assignedTo}</span>
                </div>
              )}
              {request.department && (
                <div className="flex items-center">
                  <Building className="w-4 h-4 mr-2 text-gray-500" />
                  <span>Department: {request.department}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div>
          <h3 className="font-medium text-gray-900 mb-2">Timeline</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-gray-500" />
              <span>Created: {formatDate(request.createdAt)}</span>
            </div>
            {request.registeredAt && (
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-blue-500" />
                <span>Registered: {formatDate(request.registeredAt)}</span>
              </div>
            )}
            {request.classifiedAt && (
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-yellow-500" />
                <span>Classified: {formatDate(request.classifiedAt)}</span>
              </div>
            )}
            {request.fulfilledAt && (
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-green-500" />
                <span>Fulfilled: {formatDate(request.fulfilledAt)}</span>
              </div>
            )}
            {request.closedAt && (
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-gray-500" />
                <span>Closed: {formatDate(request.closedAt)}</span>
              </div>
            )}
          </div>
        </div>

        {(request.aiClassificationEngine || request.aiHandlingEngine) && (
          <div>
            <h3 className="font-medium text-gray-900 mb-2">AI Processing</h3>
            <div className="space-y-1 text-sm text-gray-600">
              {request.aiClassificationEngine && (
                <div>Classification: {request.aiClassificationEngine}</div>
              )}
              {request.aiHandlingEngine && (
                <div>Handling: {request.aiHandlingEngine}</div>
              )}
              {request.classificationConfidence && (
                <div>Confidence: {(request.classificationConfidence * 100).toFixed(1)}%</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
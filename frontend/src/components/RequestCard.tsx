import type { ServiceRequest, RequestStatus, RequestPriority } from '../types/index.js';
import { Clock, User, Mail, Phone } from 'lucide-react';

interface RequestCardProps {
  request: ServiceRequest;
  onClick?: () => void;
  className?: string;
}

export function RequestCard({ request, onClick, className = '' }: RequestCardProps) {
  const getStatusColor = (status: RequestStatus): string => {
    const colors = {
      'new': 'bg-gray-100 text-gray-800',
      'registered': 'bg-blue-100 text-blue-800',
      'classified': 'bg-yellow-100 text-yellow-800',
      'request_fulfilled': 'bg-green-100 text-green-800',
      'aborted': 'bg-red-100 text-red-800',
      'closed': 'bg-gray-100 text-gray-600'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: RequestPriority): string => {
    const colors = {
      'low': 'bg-green-100 text-green-800',
      'medium': 'bg-yellow-100 text-yellow-800', 
      'high': 'bg-orange-100 text-orange-800',
      'critical': 'bg-red-100 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer text-center ${className}`}
      onClick={onClick}
    >
      <div className="flex flex-col items-center mb-3">
        <h3 className="font-semibold text-lg text-gray-900 mb-2 text-center">
          {request.title}
        </h3>
        <div className="flex space-x-2 flex-shrink-0">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
            {request.status.replace('_', ' ')}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
            {request.priority}
          </span>
        </div>
      </div>

      <p className="text-gray-600 mb-3 line-clamp-2 text-center">
        {request.description}
      </p>

      {request.category && (
        <div className="mb-3 text-center">
          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
            {request.category.replace('_', ' ')}
          </span>
        </div>
      )}

      <div className="flex items-center justify-center text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {formatDate(request.createdAt)}
          </div>
          
          {request.customerName && (
            <div className="flex items-center">
              <User className="w-4 h-4 mr-1" />
              {request.customerName}
            </div>
          )}
        </div>

        <div className="flex space-x-2">
          {request.customerEmail && (
            <Mail className="w-4 h-4 text-gray-400" />
          )}
          {request.customerPhone && (
            <Phone className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </div>

      {request.assignedTo && (
        <div className="mt-2 pt-2 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-500">
            Assigned to: <span className="font-medium">{request.assignedTo}</span>
            {request.department && ` • ${request.department}`}
          </p>
        </div>
      )}
    </div>
  );
}
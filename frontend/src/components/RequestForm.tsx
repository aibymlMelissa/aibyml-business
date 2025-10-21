import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import type { CreateServiceRequestDTO } from '../types/index.js';

interface RequestFormProps {
  onSubmit: (data: CreateServiceRequestDTO) => void;
  loading?: boolean;
  prefillData?: Partial<CreateServiceRequestDTO>;
}

interface FormData extends CreateServiceRequestDTO {
  homeAddress?: string;
  serviceType?: 'repair' | 'maintenance' | 'installation' | 'other';
  requestedDate?: string;
  applicantName?: string;
}

export function RequestForm({ onSubmit, loading = false, prefillData }: RequestFormProps) {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>();

  // Pre-fill form when chatbot provides data
  useEffect(() => {
    if (prefillData) {
      Object.entries(prefillData).forEach(([key, value]) => {
        if (value !== undefined) {
          setValue(key as keyof FormData, value);
        }
      });
    }
  }, [prefillData, setValue]);

  const handleFormSubmit = (data: FormData) => {
    const requestData: CreateServiceRequestDTO = {
      title: `${data.serviceType || 'Service'} Request - ${data.title}`,
      description: `Service Type: ${data.serviceType || 'Not specified'}
      
${data.description}

Requested Date: ${data.requestedDate || 'Not specified'}
Home Address: ${data.homeAddress || 'Not provided'}
Applicant: ${data.applicantName || 'Not specified'}`,
      priority: data.priority,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone
    };
    
    onSubmit(requestData);
    reset();
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mr-3">
            <span className="text-white font-bold text-lg">ABC</span>
          </div>
          <span className="text-2xl font-bold text-gray-700">ABC Solutions</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">SERVICE REQUEST FORM</h1>
        <p className="text-gray-600 bg-gray-100 inline-block px-4 py-2 rounded">
          Customer Service Request Form Template
        </p>
      </div>
      
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
        <div>
          <h2 className="text-xl font-bold text-blue-600 mb-4">Customer Information:</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer Name:
              </label>
              <input
                {...register('customerName', { required: 'Customer name is required' })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                placeholder="Enter customer name"
              />
              {errors.customerName && (
                <p className="text-red-500 text-sm mt-1">{errors.customerName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number:
              </label>
              <input
                {...register('customerPhone')}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                placeholder="Enter contact number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Home Address:
              </label>
              <input
                {...register('homeAddress')}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                placeholder="Enter home address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address:
              </label>
              <input
                {...register('customerEmail', {
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                type="email"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                placeholder="Enter email address"
              />
              {errors.customerEmail && (
                <p className="text-red-500 text-sm mt-1">{errors.customerEmail.message}</p>
              )}
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-blue-600 mb-4">Service Request Details:</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Requested:
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['repair', 'maintenance', 'installation', 'other'].map((type) => (
                  <label key={type} className="flex items-center">
                    <input
                      {...register('serviceType')}
                      type="radio"
                      value={type}
                      className="mr-3 w-4 h-4 text-blue-600"
                    />
                    <span className="capitalize">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Title:
              </label>
              <input
                {...register('title', { required: 'Service title is required' })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                placeholder="Brief title for the service request"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description of Service Requested:
              </label>
              <textarea
                {...register('description', { required: 'Description is required' })}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                placeholder="Detailed description of the service requested"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date and Time Requested:
                </label>
                <input
                  {...register('requestedDate')}
                  type="datetime-local"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Urgency Level:
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: 'low', label: 'Low' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'high', label: 'High' },
                    { value: 'critical', label: 'Emergency' }
                  ].map((priority) => (
                    <label key={priority.value} className="flex items-center">
                      <input
                        {...register('priority')}
                        type="radio"
                        value={priority.value}
                        defaultChecked={priority.value === 'medium'}
                        className="mr-3 w-4 h-4 text-blue-600"
                      />
                      <span>{priority.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-blue-600 mb-4">Approval:</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Applicant Name:
              </label>
              <input
                {...register('applicantName')}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                placeholder="Name of person submitting request"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Request Submission Date:
              </label>
              <input
                type="date"
                value={new Date().toISOString().split('T')[0]}
                readOnly
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-md bg-gray-50"
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-blue-600 mb-4">Service Personnel:</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-600 italic mb-4">
                This section will be automatically filled by AI classification and assignment system
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Completed By:
                  </label>
                  <input
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-md bg-gray-100"
                    placeholder="Will be assigned automatically"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date:
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-md bg-gray-100"
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 px-6 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold"
          >
            {loading ? 'Submitting Request...' : 'Submit Service Request'}
          </button>
        </div>
      </form>
    </div>
  );
}
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, MessageSquare, Send } from 'lucide-react';
import { AI_SERVICES } from '../constants/aiServices';

interface ServiceRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChat: () => void;
}

const ServiceRequestForm: React.FC<ServiceRequestFormProps> = ({ isOpen, onClose, onOpenChat }) => {
  const [formData, setFormData] = useState({
    username: '',
    subscribedService: '',
    apiKey: '',
    requestService: '',
    serviceMode: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Service request submitted:', formData);
    // TODO: Send to backend API
    alert('Service request submitted successfully! Our team will contact you shortly.');
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8 relative"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">AI Service Maintenance Request</h2>
              <p className="text-blue-100 text-sm">Submit a request for your subscribed AI services</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Chat Button Banner */}
        <div className="bg-blue-50 border-b border-blue-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-semibold text-gray-800">Need help filling this form?</p>
                <p className="text-xs text-gray-600">Chat with our AI assistant to describe your issue</p>
              </div>
            </div>
            <button
              onClick={onOpenChat}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat with AI</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
              Username / Account Email *
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              placeholder="your.email@company.com"
            />
          </div>

          {/* Subscribed AI Service */}
          <div>
            <label htmlFor="subscribedService" className="block text-sm font-semibold text-gray-700 mb-2">
              Subscribed AI Service *
            </label>
            <select
              id="subscribedService"
              name="subscribedService"
              value={formData.subscribedService}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            >
              <option value="">Select your subscribed service...</option>
              {AI_SERVICES.map((service, index) => (
                <option key={index} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </div>

          {/* API Key */}
          <div>
            <label htmlFor="apiKey" className="block text-sm font-semibold text-gray-700 mb-2">
              AI Service API Key *
            </label>
            <input
              type="password"
              id="apiKey"
              name="apiKey"
              value={formData.apiKey}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-mono text-sm"
              placeholder="sk-••••••••••••••••••••"
            />
            <p className="text-xs text-gray-500 mt-1">Your API key is kept secure and used only for verification</p>
          </div>

          {/* Request Service Type */}
          <div>
            <label htmlFor="requestService" className="block text-sm font-semibold text-gray-700 mb-2">
              Request Service Type *
            </label>
            <select
              id="requestService"
              name="requestService"
              value={formData.requestService}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            >
              <option value="">Select request type...</option>
              <option value="maintenance">Maintenance & Bug Fixes</option>
              <option value="feature-update">Feature Update</option>
              <option value="performance-optimization">Performance Optimization</option>
              <option value="security-patch">Security Patch</option>
              <option value="api-upgrade">API Upgrade</option>
              <option value="technical-support">Technical Support</option>
              <option value="service-configuration">Service Configuration</option>
              <option value="other">Other Request</option>
            </select>
          </div>

          {/* Service Mode */}
          <div>
            <label htmlFor="serviceMode" className="block text-sm font-semibold text-gray-700 mb-2">
              Service Mode *
            </label>
            <select
              id="serviceMode"
              name="serviceMode"
              value={formData.serviceMode}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            >
              <option value="">Select service mode...</option>
              <option value="urgent">Urgent (Response within 2 hours)</option>
              <option value="high-priority">High Priority (Response within 24 hours)</option>
              <option value="normal">Normal (Response within 3 business days)</option>
              <option value="scheduled">Scheduled Maintenance</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
              Issue Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
              placeholder="Please describe your issue or request in detail. Include error messages, expected behavior, and steps to reproduce if applicable..."
            ></textarea>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              <span>Submit Request</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ServiceRequestForm;

import { ZodError } from 'zod';
import toast from 'react-hot-toast';

export class ApiValidationError extends Error {
  public zodError: ZodError;
  
  constructor(message: string, zodError: ZodError) {
    super(message);
    this.name = 'ApiValidationError';
    this.zodError = zodError;
  }
}

export function handleApiError(error: unknown): never {
  if (error instanceof ZodError) {
    const validationError = new ApiValidationError(
      'API response validation failed',
      error
    );
    
    // Show user-friendly error message
    toast.error('Received invalid data from server. Please try again.');
    
    // Log detailed error for debugging
    console.error('API Validation Error:', {
      message: validationError.message,
      issues: error.issues,
      error: validationError
    });
    
    throw validationError;
  }
  
  // Re-throw other errors
  throw error;
}

export function createValidatedApiCall<T>(apiCall: () => Promise<T>) {
  return async (): Promise<T> => {
    try {
      return await apiCall();
    } catch (error) {
      return handleApiError(error);
    }
  };
}
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export function useApi() {
  const queryClient = useQueryClient();

  const createMutation = (mutationFn, options = {}) => {
    return useMutation({
      mutationFn,
      onSuccess: (data) => {
        if (options.successMessage) {
          toast.success(options.successMessage);
        }
        if (options.onSuccess) {
          options.onSuccess(data);
        }
        if (options.invalidateQueries) {
          queryClient.invalidateQueries(options.invalidateQueries);
        }
      },
      onError: (error) => {
        const message = error.response?.data?.detail || error.message || 'An error occurred';
        toast.error(message);
        if (options.onError) {
          options.onError(error);
        }
      },
      ...options,
    });
  };

  const createQuery = (queryKey, queryFn, options = {}) => {
    return useQuery({
      queryKey,
      queryFn,
      onError: (error) => {
        const message = error.response?.data?.detail || error.message || 'Failed to fetch data';
        toast.error(message);
      },
      ...options,
    });
  };

  return {
    createMutation,
    createQuery,
    queryClient,
  };
}
import React, { useState } from 'react';

export const useForm = (initialValues, onSubmit) => {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      setErrors(error.response?.data?.errors || {});
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setFormData(initialValues);
    setErrors({});
  };

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    isSubmitting,
    handleChange,
    handleSubmit,
    reset
  };
};

export const useFetch = (fetchFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetchFunction();
        setData(response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred');
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  return { data, isLoading, error, refetch: () => fetchFunction() };
};

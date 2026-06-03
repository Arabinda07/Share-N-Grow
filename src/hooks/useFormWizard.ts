import React, { useState } from 'react';

export function useFormWizard<T>(initialData: T, totalSteps: number) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<T>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nextStep = (validator?: (step: number, data: T) => string | null) => {
    if (validator) {
      const stepError = validator(currentStep, formData);
      if (stepError) {
        setError(stepError);
        return false;
      }
    }
    setError(null);
    if (currentStep < totalSteps) {
        setCurrentStep(prev => Math.min(prev + 1, totalSteps));
        return true;
    }
    return false;
  };

  const prevStep = () => {
    setError(null);
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const setFieldValue = (name: keyof T, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return {
    currentStep,
    formData,
    setFormData,
    isSubmitting,
    setIsSubmitting,
    isSuccess,
    setIsSuccess,
    error,
    setError,
    nextStep,
    prevStep,
    handleInputChange,
    setFieldValue,
    totalSteps
  };
}

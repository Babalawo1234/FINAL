import React from 'react';
import { cn } from '@/app/lib/utils';

interface InputProps {
  label?: string;
  error?: string;
  className?: string;
  containerClassName?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  name?: string;
}

export function Input({
  label,
  error,
  className,
  containerClassName,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  id,
  name,
  ...props
}: InputProps) {
  return (
    <div className={cn('space-y-2', containerClassName)}>
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={cn(
          'w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg',
          'focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500',
          'bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
          'placeholder-gray-500 dark:placeholder-gray-400',
          'transition-colors duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}

interface SelectProps {
  label?: string;
  error?: string;
  className?: string;
  containerClassName?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  name?: string;
  children?: React.ReactNode;
  options?: { value: string; label: string; }[];
}

export function Select({
  label,
  error,
  className,
  containerClassName,
  value,
  onChange,
  required = false,
  disabled = false,
  id,
  name,
  children,
  options,
  ...props
}: SelectProps) {
  return (
    <div className={cn('space-y-2', containerClassName)}>
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={cn(
          'w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg',
          'focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500',
          'bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
          'transition-colors duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
          className
        )}
        {...props}
      >
        {options ? options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        )) : children}
      </select>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}

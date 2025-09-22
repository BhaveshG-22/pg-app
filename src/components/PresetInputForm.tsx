'use client';

import { InputField } from '@/types/preset';
import { cn } from '@/lib/utils';

interface PresetInputFormProps {
  inputFields: InputField[];
  values: Record<string, string | number>;
  onChange: (fieldId: string, value: string | number) => void;
  className?: string;
}

export function PresetInputForm({
  inputFields,
  values,
  onChange,
  className,
}: PresetInputFormProps) {
  const renderField = (field: InputField) => {
    const value = values[field.id] ?? field.defaultValue ?? '';

    const fieldProps = {
      id: field.id,
      name: field.id,
      className: cn(
        'w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors',
        field.type === 'textarea' ? 'resize-none' : ''
      ),
      placeholder: field.placeholder,
      required: field.required,
    };

    switch (field.type) {
      case 'text':
        return (
          <input
            {...fieldProps}
            type="text"
            value={value as string}
            onChange={(e) => onChange(field.id, e.target.value)}
          />
        );

      case 'textarea':
        return (
          <textarea
            {...fieldProps}
            rows={3}
            value={value as string}
            onChange={(e) => onChange(field.id, e.target.value)}
          />
        );

      case 'number':
        return (
          <input
            {...fieldProps}
            type="number"
            min={field.min}
            max={field.max}
            step={field.step}
            value={value as number}
            onChange={(e) => onChange(field.id, Number(e.target.value))}
          />
        );

      case 'select':
        return (
          <select
            {...fieldProps}
            value={value as string}
            onChange={(e) => onChange(field.id, e.target.value)}
          >
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'slider':
        return (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">
                {field.min ?? 0}
              </span>
              <span className="text-sm text-gray-300 font-medium">
                {value}
              </span>
              <span className="text-sm text-gray-400">
                {field.max ?? 100}
              </span>
            </div>
            <input
              type="range"
              min={field.min ?? 0}
              max={field.max ?? 100}
              step={field.step ?? 1}
              value={value as number}
              onChange={(e) => onChange(field.id, Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-thumb"
            />
          </div>
        );

      default:
        return null;
    }
  };

  if (inputFields.length === 0) {
    return (
      <div className={cn('text-center py-6', className)}>
        <p className="text-gray-400">No additional settings for this preset</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      <div>
        <h3 className="text-lg font-medium text-gray-300 mb-4">
          Preset Settings
        </h3>
        <div className="space-y-4">
          {inputFields.map((field) => (
            <div key={field.id} className="space-y-2">
              <label
                htmlFor={field.id}
                className="block text-sm font-medium text-gray-400"
              >
                {field.label}
                {field.required && (
                  <span className="text-red-400 ml-1">*</span>
                )}
              </label>
              {renderField(field)}
              {field.description && (
                <p className="text-xs text-gray-500 mt-1">
                  {field.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
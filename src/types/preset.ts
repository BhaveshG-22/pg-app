export type InputFieldType = 'text' | 'textarea' | 'select' | 'number' | 'slider';

export interface InputField {
  id: string;
  label: string;
  type: InputFieldType;
  placeholder?: string;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
  defaultValue?: string | number;
  description?: string;
}

export interface Preset {
  id: string;
  name: string;
  description: string;
  creditCost: number;
  inputFields: InputField[];
  exampleImageURL: string;
  category: string;
  emoji: string;
}

export interface UserImage {
  id: string;
  url: string;
  thumbnailUrl: string;
  fileName: string;
  uploadedAt: string;
  width: number;
  height: number;
}

export type AspectRatio = '3:2' | '2:3' | '1:1' | '16:9' | '9:16';

export interface StudioFormData {
  selectedImageId: string | null;
  aspectRatio: AspectRatio;
  isPrivate: boolean;
  noWatermark: boolean;
  inputValues: Record<string, string | number>;
}

export interface GenerationRequest {
  presetId: string;
  imageId: string;
  aspectRatio: AspectRatio;
  isPrivate: boolean;
  noWatermark: boolean;
  inputValues: Record<string, string | number>;
}

export interface GenerationResult {
  id: string;
  originalImageUrl: string;
  transformedImageUrl: string;
  presetUsed: string;
  aspectRatio: AspectRatio;
  createdAt: string;
  isPrivate: boolean;
  hasWatermark: boolean;
}

export interface User {
  id: string;
  email: string;
  credits: number;
  images: UserImage[];
}
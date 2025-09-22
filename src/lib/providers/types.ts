export interface ProviderParams {
  prompt: string;
  outputSize: string;
  signal?: AbortSignal;
  uploadedImageUrl?: string; // URL of uploaded image for processing
}

export interface ProviderResult {
  outputUrl: string;
  engine: string;
  engineMeta: any;
}

export interface Provider {
  generate(params: ProviderParams): Promise<ProviderResult>;
}
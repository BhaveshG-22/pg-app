import { OpenAIProvider } from './openai';
import { ReplicateOpenAIProvider } from './replicate-openai';
import { SeedreamProvider } from './seedream';
import { StableDiffusionProvider } from './stable-diffusion';
import { FluxKontextProvider } from './flux-kontext';
import { NanoBananaProvider } from './nano-banana';
import { Provider } from './types';

const providers: Record<string, Provider> = {
  OPENAI: new OpenAIProvider(),
  REPLICATE_OPENAI: new ReplicateOpenAIProvider(),
  SEEDREAM: new SeedreamProvider(),
  STABLE_DIFFUSION: new StableDiffusionProvider(),
  FLUX_KONTEXT: new FluxKontextProvider(),
  NANO_BANANA: new NanoBananaProvider(),
};

export function getProvider(providerName: string): Provider {
  const provider = providers[providerName];
  if (!provider) {
    throw new Error(`Unknown provider: ${providerName}`);
  }
  return provider;
}

export * from './types';
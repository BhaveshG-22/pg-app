const { OpenAIProvider } = require('./openai');
const { ReplicateOpenAIProvider } = require('./replicate-openai');
const { SeedreamProvider } = require('./seedream');
const { StableDiffusionProvider } = require('./stable-diffusion');
const { FluxKontextProvider } = require('./flux-kontext');
const { NanoBananaProvider } = require('./nano-banana');

const providers = {
  OPENAI: new OpenAIProvider(),
  REPLICATE_OPENAI: new ReplicateOpenAIProvider(),
  SEEDREAM: new SeedreamProvider(),
  STABLE_DIFFUSION: new StableDiffusionProvider(),
  FLUX_KONTEXT: new FluxKontextProvider(),
  NANO_BANANA: new NanoBananaProvider(),
};

function getProvider(providerName) {
  const provider = providers[providerName];
  if (!provider) {
    throw new Error(`Unknown provider: ${providerName}`);
  }
  return provider;
}

module.exports = { getProvider };
const { NanoBananaProvider } = require('./nano-banana');

const providers = {
  NANO_BANANA: new NanoBananaProvider(),
};

function getProvider(providerName) {
  const provider = providers[providerName];
  if (!provider) {
    throw new Error(`Unknown provider: ${providerName}. Available providers: ${Object.keys(providers).join(', ')}`);
  }
  return provider;
}

module.exports = {
  getProvider,
  providers
};
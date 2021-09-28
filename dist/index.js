'use strict';

const path = require('path');
const defu = require('defu');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

const defu__default = /*#__PURE__*/_interopDefaultLegacy(defu);

const PROVIDERS = [
  {
    name: "log",
    runtime: require.resolve("./runtime/providers/log"),
    autoDetect: false,
    defaults: () => ({}),
    validate: () => {
    }
  },
  {
    name: "ga",
    runtime: require.resolve("./runtime/providers/ga"),
    defaults: (nuxtOptions) => ({
      eventCategory: "Web Vitals",
      id: process.env.GOOGLE_ANALYTICS_ID || nuxtOptions.googleAnalytics && nuxtOptions.googleAnalytics.id
    }),
    validate({ id }) {
      if (!id) {
        throw new Error("[@nuxtjs/web-vitals] googleAnalytics.id is required for Google Analytics integration");
      }
    }
  },
  {
    name: "vercel",
    runtime: require.resolve("./runtime/providers/vercel"),
    defaults: (_nuxtOptions) => ({
      dsn: process.env.VERCEL_ANALYTICS_ID
    }),
    validate({ dsn }) {
      if (!dsn) {
        throw new Error("[@nuxtjs/web-vitals] vercel.dsn or VERCEL_ANALYTICS_ID environment is required for Vercel integration");
      }
    }
  }
];

function webVitalsModule() {
  const { nuxt } = this;
  const options = defu__default['default'](nuxt.options.webVitals, {
    provider: "",
    debug: false,
    disabled: false
  });
  if (options.disabled) {
    return;
  }
  const resolveProvider = (providerName, userOptions = {}) => {
    const provider2 = PROVIDERS.find((p) => p.name === providerName);
    if (!provider2) {
      throw new Error("Provider not found: " + providerName);
    }
    provider2.options = defu__default['default'](userOptions, provider2.defaults(nuxt.options));
    provider2.validate(provider2.options);
    return provider2;
  };
  let provider;
  if (options.provider) {
    provider = resolveProvider(options.provider, options[options.provider]);
  } else {
    for (const _provider of PROVIDERS) {
      if (_provider.autoDetect === false) {
        continue;
      }
      try {
        provider = resolveProvider(_provider.name, options[_provider.name]);
        console.info("[@nuxtjs/web-vitals] Auto detected provider:", provider.name);
        break;
      } catch (err) {
      }
    }
  }
  if (!provider) {
    if (nuxt.options.dev && options.debug) {
      provider = resolveProvider("log");
    } else {
      console.warn("[@nuxtjs/web-vitals] Please define a provider to activate this module");
      return;
    }
  }
  const runtimeDir = path.resolve(__dirname, "runtime");
  nuxt.options.build.transpile.push(runtimeDir);
  nuxt.options.alias["~vitals"] = runtimeDir;
  nuxt.options.build.transpile.push(path.dirname(provider.runtime));
  nuxt.options.alias["~vitals-provider"] = provider.runtime;
  nuxt.options.alias.ufo = "ufo/dist/index.mjs";
  this.addPlugin({
    src: path.resolve(__dirname, "./runtime/vitals.client.mjs"),
    fileName: "vitals.client.js",
    options: {
      debug: options.debug,
      ...provider.options
    }
  });
}
webVitalsModule.meta = require("../package.json");

module.exports = webVitalsModule;

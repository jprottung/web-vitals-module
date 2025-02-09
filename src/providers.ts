export const PROVIDERS = [
  {
    name: 'log',
    runtime: require.resolve('./runtime/providers/log'),
    autoDetect: false,
    defaults: () => ({}),
    validate: () => {}
  },
  {
    name: 'ga',
    runtime: require.resolve('./runtime/providers/ga'),
    defaults: nuxtOptions => ({
      eventCategory: 'Web Vitals',
      id: process.env.GOOGLE_ANALYTICS_ID || (nuxtOptions.googleAnalytics && nuxtOptions.googleAnalytics.id)
    }),
    validate ({ id }) {
      if (!id) {
        throw new Error('[@nuxtjs/web-vitals] googleAnalytics.id is required for Google Analytics integration')
      }
    }
  },
  {
    name: 'ga_direct',
    runtime: require.resolve('./runtime/providers/ga_direct'),
    defaults: () => ({
      eventCategory: 'Web Vitals'
    }),
    validate () {
    }
  },
  {
    name: 'vercel',
    runtime: require.resolve('./runtime/providers/vercel'),
    defaults: _nuxtOptions => ({
      dsn: process.env.VERCEL_ANALYTICS_ID
    }),
    validate ({ dsn }) {
      if (!dsn) {
        throw new Error('[@nuxtjs/web-vitals] vercel.dsn or VERCEL_ANALYTICS_ID environment is required for Vercel integration')
      }
    }
  }
]

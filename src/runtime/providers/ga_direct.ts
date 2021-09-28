export interface Options {
  debug: boolean
  eventCategory: string
}

// https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#dl

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function sendToAnalytics (context, metric, options: Options) {
  const opts = {
    eventCategory: options.eventCategory,
    eventAction: metric.name as string,
    eventLabel: metric.id as string,
    // Google Analytics metrics must be integers, so the value is rounded.
    eventValue: parseInt(metric.delta) + '',
    transport: 'beacon',
    nonInteraction: true
  }

  // Calculate the request time by subtracting from TTFB
  // everything that happened prior to the request starting.
  if (metric.name === 'TTFB') {
    // @ts-ignore
    opts.eventValue = parseInt(metric.delta - metric.entries[0].requestStart)
  }

  // @ts-ignore
  if (!window.ga) {
    // @ts-ignore
    window.GoogleAnalyticsObject = 'ga'
    // @ts-ignore
    window.ga = window.ga || function () {
      // @ts-ignore
      (window.ga.q = window.ga.q || []).push(arguments)
    }
  }

  // @ts-ignore
  window.ga('send', 'event', opts)
}

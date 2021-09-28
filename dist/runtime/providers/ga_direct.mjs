export function sendToAnalytics(context, metric, options) {
  const opts = {
    eventCategory: options.eventCategory,
    eventAction: metric.name,
    eventLabel: metric.id,
    eventValue: parseInt(metric.delta) + "",
    transport: "beacon",
    nonInteraction: true
  };
  if (metric.name === "TTFB") {
    opts.eventValue = parseInt(metric.delta - metric.entries[0].requestStart);
  }
  if (!window.ga) {
    window.GoogleAnalyticsObject = "ga";
    window.ga = window.ga || function() {
      (window.ga.q = window.ga.q || []).push(arguments);
    };
  }
  window.ga("send", "event", opts);
}

import { logError } from "./utils.mjs";
export async function webVitals({ route, options, sendToAnalytics }) {
  const context = {
    fullPath: route.fullPath,
    href: location.href
  };
  try {
    const { getCLS, getFID, getLCP, getTTFB, getFCP } = await import("web-vitals").then((r) => r.default || r);
    getFID((metric) => sendToAnalytics(context, metric, options));
    getTTFB((metric) => sendToAnalytics(context, metric, options));
    getLCP((metric) => sendToAnalytics(context, metric, options));
    getCLS((metric) => sendToAnalytics(context, metric, options));
    getFCP((metric) => sendToAnalytics(context, metric, options));
  } catch (err) {
    logError(err);
  }
}

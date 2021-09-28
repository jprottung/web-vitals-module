export const KEY = "ga:user";
export const UID = localStorage[KEY] = localStorage[KEY] || Math.random() + "." + Math.random();
export function logError(err) {
  console.error("[nuxt vitals]", err);
}
export function logDebug(label, ...args) {
  console.log(label, ...args);
}
export function getConnectionSpeed() {
  return typeof navigator !== "undefined" && navigator.connection && navigator.connection.effectiveType || "";
}
export function send(url, body) {
  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, body);
    return;
  }
  fetch(url, {
    body,
    method: "POST",
    credentials: "omit",
    keepalive: true
  }).catch(logError);
}

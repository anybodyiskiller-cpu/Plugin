const ORIGINAL_SCRIPT_URL = "https://github.com/ChinaTelecomOperators/ChinaMobile/releases/download/Prerelease-Alpha/10086.js";

function argValue(name, fallback = "") {
  const raw = typeof $argument === "string" ? $argument : "";
  const params = raw.split("&").reduce((acc, part) => {
    const index = part.indexOf("=");
    if (index === -1) return acc;
    const key = decodeURIComponent(part.slice(0, index));
    const value = decodeURIComponent(part.slice(index + 1));
    acc[key] = value;
    return acc;
  }, {});
  return params[name] || fallback;
}

function finish() {
  $done({});
}

const phone = argValue("phonenumber", "default");
const cooldownHours = Number(argValue("cooldown_hours", "24"));
const cooldownMs = Number.isFinite(cooldownHours) && cooldownHours > 0
  ? cooldownHours * 60 * 60 * 1000
  : 24 * 60 * 60 * 1000;
const key = `china_mobile_capture_once_until_${phone}`;
const now = Date.now();
const until = Number($persistentStore.read(key) || "0");

if (until > now) {
  console.log(`[ChinaMobileCaptureOnce] skipped, cooldown until ${new Date(until).toLocaleString()}`);
  finish();
} else {
  $persistentStore.write(String(now + cooldownMs), key);
  console.log("[ChinaMobileCaptureOnce] first capture in cooldown window, running upstream script");

  $httpClient.get(ORIGINAL_SCRIPT_URL, (error, response, body) => {
    if (error || !body) {
      console.log(`[ChinaMobileCaptureOnce] upstream script load failed: ${error || "empty body"}`);
      $persistentStore.write(String(now + 60 * 1000), key);
      finish();
      return;
    }

    try {
      eval(body);
    } catch (e) {
      console.log(`[ChinaMobileCaptureOnce] upstream script error: ${e && e.message ? e.message : e}`);
      $persistentStore.write(String(now + 60 * 1000), key);
      finish();
    }
  });
}

// 🔒 Light-weight, Zero-Dependency Rate Limiter for Next.js APIs
// Works out-of-the-box locally. Can be connected to Redis for multi-instance production servers.

const ipCache = new Map<string, { count: number; lastRequest: number }>();

/**
 * Basic in-memory Rate Limiting check
 * @param ip The requester's IP address
 * @param limit Maximum allowed requests in the time window
 * @param windowMs Time window in milliseconds (default 1 minute)
 * @returns boolean True if request is allowed, False if throttled
 */
export function rateLimit(
  ip: string,
  limit = 5,
  windowMs = 60 * 1000,
): boolean {
  const now = Date.now();
  const ipData = ipCache.get(ip);

  // If IP is clean, register first request
  if (!ipData) {
    ipCache.set(ip, { count: 1, lastRequest: now });
    return true;
  }

  // If time window has expired, reset count
  if (now - ipData.lastRequest > windowMs) {
    ipCache.set(ip, { count: 1, lastRequest: now });
    return true;
  }

  // If they exceeded the limit, reject
  if (ipData.count >= limit) {
    return false;
  }

  // Otherwise, increment the request count
  ipData.count += 1;
  return true;
}

/**
 * Utility to extract client IP securely from Next.js request headers
 */
export function getClientIp(req: Request): string {
  // Check typical reverse proxy headers
  const xForwardedFor = req.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    return xForwardedFor.split(",")[0].trim();
  }

  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  return "127.0.0.1"; // Fallback for local testing
}

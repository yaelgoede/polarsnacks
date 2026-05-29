const BUNQ_API_URL =
  process.env.BUNQ_ENVIRONMENT === "PRODUCTION"
    ? "https://api.bunq.com"
    : "https://public-api.sandbox.bunq.com";

let cachedSessionToken: string | null = null;
let sessionExpiresAt = 0;

async function createSession(): Promise<string> {
  const installationRes = await fetch(`${BUNQ_API_URL}/v1/installation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_public_key: "" }),
  });
  const installationData = await installationRes.json();
  const installationToken = installationData.Response?.[1]?.Token?.token;

  const sessionRes = await fetch(`${BUNQ_API_URL}/v1/session-server`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Bunq-Client-Authentication": installationToken,
    },
    body: JSON.stringify({ secret: process.env.BUNQ_API_KEY }),
  });
  const sessionData = await sessionRes.json();
  const token = sessionData.Response?.[1]?.Token?.token;

  cachedSessionToken = token;
  sessionExpiresAt = Date.now() + 55 * 60 * 1000;
  return token;
}

export async function getSessionToken(): Promise<string> {
  if (cachedSessionToken && Date.now() < sessionExpiresAt) {
    return cachedSessionToken;
  }
  return createSession();
}

export { BUNQ_API_URL };

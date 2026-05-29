import { getSessionToken, BUNQ_API_URL } from "./client";

type CreatePaymentRequestParams = {
  amount: string;
  currency: string;
  recipientEmail: string;
  description: string;
};

export async function createPaymentRequest({
  amount,
  currency,
  recipientEmail,
  description,
}: CreatePaymentRequestParams) {
  const token = await getSessionToken();
  const accountId = process.env.BUNQ_MONETARY_ACCOUNT_ID;

  const response = await fetch(
    `${BUNQ_API_URL}/v1/user/{userId}/monetary-account/${accountId}/request-inquiry`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Bunq-Client-Authentication": token,
      },
      body: JSON.stringify({
        amount_inquired: { value: amount, currency },
        counterparty_alias: { type: "EMAIL", value: recipientEmail },
        description,
        allow_bunqme: true,
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.Error?.[0]?.error_description ?? "Payment request failed");
  }

  return response.json();
}

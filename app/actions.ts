"use server";

export async function createNewConnectionSecret(
): Promise<string> {
  try {
    const newAppResponse = await fetch(`${process.env.ALBY_HUB_URL}/api/apps`, {
      method: "POST",
      body: JSON.stringify({"name":"NWC mint","pubkey":"","budgetRenewal":"monthly","maxAmount":0,"scopes":["pay_invoice","get_balance","make_invoice","lookup_invoice","list_transactions","notifications"],"returnTo":"","isolated":true}),
      headers: {
        "Cookie": process.env.SESSION_COOKIE as string,
        "X-Csrf-Token": process.env.CSRF_TOKEN as string,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    })
    if (!newAppResponse.ok) {
      throw new Error("Failed to create app: " + await newAppResponse.text());
    }
    const newApp: {pairingUri: string} = await newAppResponse.json();
    if (!newApp.pairingUri) {
      throw new Error("No pairing URI in create app response");
    }
    return newApp.pairingUri;
  }
  catch(error) {
    console.error(error);
    // don't expose the original error
    throw new Error("Failed to create app")
  }
}

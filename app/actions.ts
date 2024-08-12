"use server";

import { saveConnectionSecret } from "./db";

export type Reserves = {
  numChannels: number;
  totalOutgoingCapacity: number;
  totalChannelCapacity: number;
  numApps: number;
  totalAppBalance: number;
};

const APP_NAME_PREFIX = "Alby Jim ";

export async function hasPassword() {
  return !!process.env.PASSWORD;
}

export async function createWallet(
  password: string | undefined
): Promise<{ connectionSecret: string; lightningAddress: string } | undefined> {
  try {
    if (!process.env.BASE_URL) {
      throw new Error("No BASE_URL set");
    }
    if (process.env.PASSWORD) {
      if (password !== process.env.PASSWORD) {
        return undefined;
      }
    }

    const newAppResponse = await fetch(`${process.env.ALBYHUB_URL}/api/apps`, {
      method: "POST",
      body: JSON.stringify({
        name: APP_NAME_PREFIX + Math.floor(Date.now() / 1000),
        pubkey: "",
        budgetRenewal: "monthly",
        maxAmount: 0,
        scopes: [
          "pay_invoice",
          "get_balance",
          "make_invoice",
          "lookup_invoice",
          "list_transactions",
          "notifications",
        ],
        returnTo: "",
        isolated: true,
      }),
      headers: getHeaders(),
    });
    if (!newAppResponse.ok) {
      throw new Error("Failed to create app: " + (await newAppResponse.text()));
    }
    const newApp: { pairingUri: string } = await newAppResponse.json();
    if (!newApp.pairingUri) {
      throw new Error("No pairing URI in create app response");
    }

    const { lightningAddress } = await saveConnectionSecret(newApp.pairingUri);

    const domain = process.env.BASE_URL.split("//")[1];

    return {
      connectionSecret:
        newApp.pairingUri + `&lud16=${lightningAddress}@${domain}`,
      lightningAddress: lightningAddress + "@" + domain,
    };
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

export async function getReserves(): Promise<Reserves | undefined> {
  try {
    const apps = (await fetch(`${process.env.ALBYHUB_URL}/api/apps`, {
      headers: getHeaders(),
    }).then((res) => res.json())) as { name: string; balance: number }[];

    const channels = (await fetch(`${process.env.ALBYHUB_URL}/api/channels`, {
      headers: getHeaders(),
    }).then((res) => res.json())) as {
      localSpendableBalance: number;
      localBalance: number;
      remoteBalance: number;
    }[];

    const relevantApps = apps.filter(
      (app) => app.name.startsWith(APP_NAME_PREFIX) && app.balance > 0
    );
    const totalAppBalance = relevantApps
      .map((app) => app.balance)
      .reduce((a, b) => a + b, 0);

    const totalOutgoingCapacity = channels
      .map((channel) => channel.localSpendableBalance)
      .reduce((a, b) => a + b, 0);
    const totalChannelCapacity = channels
      .map((channel) => channel.localBalance + channel.remoteBalance)
      .reduce((a, b) => a + b, 0);

    return {
      numApps: relevantApps.length,
      totalAppBalance,
      numChannels: channels.length,
      totalOutgoingCapacity,
      totalChannelCapacity,
    };
  } catch (error) {
    console.error(error);
    return undefined;
  }
}
function getHeaders() {
  return {
    Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

import { PrismaClient } from "@prisma/client";
import { nwc } from "@getalby/sdk";
import { getPublicKey } from "nostr-tools";

const prisma = new PrismaClient();

export async function saveConnectionSecret(
  connectionSecret: string
): Promise<{ lightningAddress: string }> {
  const parsed = nwc.NWCClient.parseWalletConnectUrl(connectionSecret);
  if (!parsed.secret) {
    throw new Error("no secret found in connection secret");
  }
  const pubkey = getPublicKey(parsed.secret);
  const lightningAddress = pubkey.substring(0, 6);

  const result = await prisma.connectionSecret.create({
    data: {
      id: connectionSecret,
      lightningAddress,
      pubkey,
    },
  });
  return { lightningAddress: result.lightningAddress };
}

export async function findWalletConnection(query: {
  lightningAddress: string;
}) {
  return prisma.connectionSecret.findUniqueOrThrow({
    where: {
      lightningAddress: query.lightningAddress,
    },
  });
}

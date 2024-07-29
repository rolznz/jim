import { NextRequest } from "next/server";
import { findWalletConnection } from "@/app/db";
import { nwc } from "@getalby/sdk";

export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  if (!params.address) {
    throw new Error("No address provided");
  }

  const searchParams = request.nextUrl.searchParams;
  const amount = searchParams.get("amount");
  const comment = searchParams.get("comment") || "";

  if (!amount) {
    throw new Error("No amount provided");
  }

  const connection = await findWalletConnection({
    lightningAddress: params.address,
  });

  const nwcClient = new nwc.NWCClient({ nostrWalletConnectUrl: connection.id });

  const transaction = await nwcClient.makeInvoice({
    amount: +amount,
    description: comment,
  });

  return Response.json({
    pr: transaction.invoice,
  });
}

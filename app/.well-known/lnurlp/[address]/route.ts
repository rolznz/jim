export async function GET(
  request: Request,
  { params }: { params: { address: string } }
) {
  if (!params.address) {
    throw new Error("No address provided");
  }

  return Response.json({
    status: "OK",
    tag: "payRequest",
    commentAllowed: 255,
    callback: request.url + "/callback",
    minSendable: 1000,
    maxSendable: 10000000000,
  });
}

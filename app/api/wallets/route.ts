import { createNewConnectionSecret } from "@/app/actions";

export async function POST(request: Request) {
  const credentials = request.headers.get("Authorization")?.split(" ")?.[1];

  const password = credentials
    ? Buffer.from(credentials, "base64").toString().split(":")?.[1]
    : undefined;

  const connectionSecret = await createNewConnectionSecret(password);

  return Response.json({ connectionSecret });
}

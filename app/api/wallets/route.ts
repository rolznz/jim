import { createNewConnectionSecret } from "@/app/actions";

export async function POST() {
  const connectionSecret = await createNewConnectionSecret();

  return Response.json({ connectionSecret });
}

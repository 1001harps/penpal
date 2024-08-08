import { randomUUID } from "crypto";
import { kv } from "@vercel/kv";

const ROOM_QUEUE_KEY = "ROOM_WAITING";

export async function GET(request: Request) {
  let id = await kv.lpop<string>(ROOM_QUEUE_KEY);
  if (id === null) {
    id = randomUUID();
    await kv.lpush(ROOM_QUEUE_KEY, id);
  }

  return new Response(JSON.stringify({ id }), {
    status: 200,
    headers: {
      "content-type": "application/json",
    },
  });
}

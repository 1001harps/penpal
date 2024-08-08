import { randomUUID } from "crypto";

export function GET(request: Request) {
  const body = { id: randomUUID() };

  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      "content-type": "application/json",
    },
  });
}

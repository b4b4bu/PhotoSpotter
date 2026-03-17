export async function POST(_request: Request): Promise<Response> {
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': 'session=; HttpOnly; Path=/; SameSite=Strict; Max-Age=0',
    },
  })
}

// functions/auth/logout.js
export async function onRequest(context) {
    // 清除 Cookie
    return new Response('Logged out', {
      status: 200,
      headers: {
        'Set-Cookie': 'session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0'
      }
    });
  }
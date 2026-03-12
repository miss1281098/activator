// functions/auth/login.js
export async function onRequest(context) {
  const { request, env } = context;

  // 只处理 POST 请求
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { username, password } = await request.json();

    // 方案B：从 D1 数据库验证（推荐）
    const user = await env.DB.prepare(
      'SELECT * FROM user WHERE username = ? AND password = ?'
    ).bind(username, password).first();

    if (user) {
      const sessionToken = generateSessionToken();
      // await env.DB.prepare(
      //   'INSERT INTO sessions (token, username) VALUES (?, ?)'
      // ).bind(sessionToken, username).run();

      return new Response('Login successful', {
        status: 200,
        headers: {
          'Set-Cookie': `session=${sessionToken}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`,
        }
      });
    }

    // 验证失败
    return new Response('用户名或密码错误', { status: 401 });

  } catch (error) {
    return new Response('登录失败', { status: 500 });
  }
}

function generateSessionToken() {
  return Math.random().toString(36).substring(2) +
    Math.random().toString(36).substring(2);
}
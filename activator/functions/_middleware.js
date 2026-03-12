// functions/_middleware.js
export async function onRequest(context) {
    const { request, next } = context;
    const url = new URL(request.url);
    
    // 公开路由列表（不需要登录）
    const publicPaths = [
      '/',              // 登录页
      '/api/login',    // 登录API
      '/api/calculate',
      '/css/',          // 样式文件
      '/js/',           // 脚本文件
      '/images/',       // 图片文件
    ];
    
    // 检查当前路径是否是公开的
    const isPublicPath = publicPaths.some(path => 
      url.pathname === path || url.pathname.startsWith(path + '/')
    );
    
    // 如果是公开路径，直接放行
    if (isPublicPath) {
      return await next();
    }
    
    // 检查登录状态（从 Cookie 中读取）
    const cookies = request.headers.get('Cookie') || '';
    const sessionCookie = cookies.split(';')
      .find(c => c.trim().startsWith('session='));
    
    if (!sessionCookie) {
      // 未登录，重定向到登录页
      return new Response(null, {
        status: 302,
        headers: { 'Location': '/' }
      });
    }
    
    // 已登录，继续访问
    return await next();
  }
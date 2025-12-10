export const config = {
  runtime: 'edge', // 强制使用边缘节点，速度更快
};

export default async function handler(req) {
  const url = new URL(req.url);

  // 1. 定义目标 Google API 的地址
  // 也就是说，把收到的请求路径，拼接到 Google 的域名后面
  const targetUrl = new URL(url.pathname + url.search, "https://generativelanguage.googleapis.com");

  // 2. 构造新的请求
  const newRequest = new Request(targetUrl, {
    method: req.method,
    headers: req.headers,
    body: req.body,
  });

  try {
    // 3. 发送请求给 Google (Vercel 服务器在美国，所以可以通过)
    const response = await fetch(newRequest);

    // 4. 处理响应头 (保留 CORS，允许你的网页跨域调用)
    const newHeaders = new Headers(response.headers);
    newHeaders.set('Access-Control-Allow-Origin', '*');
    newHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    newHeaders.set('Access-Control-Allow-Headers', '*');

    // 5. 返回结果给你
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

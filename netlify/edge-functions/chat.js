export default async (request, context) => {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }
 
  const apiKey = request.headers.get('x-api-key');
  if (!apiKey) {
    return new Response(JSON.stringify({ error: { message: 'No API key provided' } }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
 
  try {
    const body = await request.json();
 
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(body)
    });
 
    const data = await response.json();
 
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: { message: 'Proxy error: ' + err.message } }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
 
export const config = { path: '/api/chat' };
 

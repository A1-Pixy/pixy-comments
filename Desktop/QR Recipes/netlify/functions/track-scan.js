exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const data = JSON.parse(event.body || '{}');

    const VALID_SLUGS = [
      'smoke-house', 'chop-house', 'deep-blue', 'universal-all-purpose',
      'sugar-free-all-purpose', 'garlic-pepper', 'southwest', 'jerk-bbq', 'asian-stir-fry'
    ];

    const slug = data.blend || 'unknown';
    if (!VALID_SLUGS.includes(slug)) {
      return { statusCode: 400, body: JSON.stringify({ ok: false, reason: 'invalid blend' }) };
    }

    console.log('[QR Scan]', JSON.stringify({
      blend: slug,
      pageUrl: data.pageUrl || '',
      referrer: data.referrer || 'direct',
      timestamp: data.timestamp || new Date().toISOString()
    }));

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true })
    };
  } catch (e) {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true })
    };
  }
};

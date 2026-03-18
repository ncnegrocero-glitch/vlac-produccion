const https = require('https');

exports.handler = async (event) => {
  console.log('Event path:', event.path);
  console.log('Event rawPath:', event.rawPath);
  
  let path = event.path || event.rawPath || '';
  path = path.replace('/notion', '');
  if (!path.startsWith('/')) path = '/' + path;
  
  const query = event.rawQuery ? '?' + event.rawQuery : '';
  const url = `https://api.notion.com/v1${path}${query}`;
  
  console.log('Final URL:', url);
  
  return new Promise((resolve) => {
    const options = {
      method: event.httpMethod,
      headers: {
        'Authorization': 'Bearer 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',
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      }
    };
    
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({
        statusCode: res.statusCode,
        headers: { 
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: data
      }));
    });
    
    req.on('error', (e) => resolve({
      statusCode: 500,
      body: JSON.stringify({ error: e.message })
    }));
    
    if (event.body) req.write(event.body);
    req.end();
  });
};

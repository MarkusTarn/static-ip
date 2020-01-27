const http = require('http'),
const config = require('./configuration')
const dnsMap = {}

http.createServer((req, resp) => {
    console.log('method', req.method)
    console.log('dnsMap', dnsMap)
    console.log('client', req.url)
    switch (req.method) {
        case 'GET':
            const client = req.url
            if (client in dnsMap) {
                resp.writeHead(200, { 'Content-Type': 'application/json' })
                resp.write(JSON.stringify({ client: dnsMap.client }));
                resp.end();
            } else {
                resp.writeHead(404, 'Resource not found', { 'Content-Type': 'application/json' })
                resp.write(JSON.stringify({ client: 'Resource not found' }));
                resp.end();
            }
            break;
        case 'PUT':
            let reqBody = '';
            req.on('data', data => reqBody += data)
            req.on('end', () => updateDNS(req))
            break;
    }
}).listen(config.service.port, () => console.log(`Api server started on port ${config.service.port}`))

function updateDNS(req) {
    dnsMap[req.url] = req.header('x-forwarded-for') || req.connection.remoteAddress
    resp.writeHead(200, { 'Content-Type': 'application/json' })
    resp.end();
}
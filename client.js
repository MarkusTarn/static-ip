const { request } = require('https');

const conf = {
	host: 'www.example.com',     // Server that is hosting ip addresses and forwarding requests
	port: 443,                   // 80 or 443 depending whether server is running on http or https
	path: '/myhome',             // Client resource name, your ip and port will be mapped to that key
	applicationPort: 1337,       // Port to forward domain to
	updateInterval: 1800000,     // Interval to update ip (30 min)
};

const payload = JSON.stringify({ port: conf.applicationPort })

const options = {
	hostname: conf.host,
	port: conf.port,
	path: conf.path,
	method: 'PUT',
	headers: { 
        'Content-Type': 'application/json',
        'Content-Length': payload.length,
    },
};

function pingIP() {
	const req = request(options, res => console.log(`statusCode: ${res.statusCode}`));
	req.on('error', error => console.error(error));
	req.write(payload);
	req.end();
	setTimeout(() => pingIP(), conf.updateInterval);
}

pingIP();

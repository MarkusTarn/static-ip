const { port: servicePort } = require('./configuration').service;
const { writeFile } = require('fs');
const { exec } = require('child_process');
const express = require('express');
const bodyParser = require('body-parser');

/* Map ip addresses in memory */
const ipMap = {};

/* Initialize service */
const app = express();

/* Configure service */
app.use(bodyParser.json());

/* Middleware to reload nginx conf after successfull change */
const reloadNginx = () => {
    exec('sudo nginx -t && sudo systemctl reload nginx', (err) => {
        if (err) console.error('Could not reload nginx', error);
        console.log('Nginx reloaded successfully');
    })
}

/* Set routes */
app.get('/:client', (req, res) => {
    const { client } = req.params;
    console.log('Client queried: ', client);
    if (client in ipMap) res.status(200).json({ client: ipMap[client] });
    else res.status(404).json({ client: 'Resource not found' });
});

app.put('/:client', (req, res, next) => {
    const { client } = req.params;
    const { port } = req.body;
    const ip = req.header('x-forwarded-for') || req.connection.remoteAddress;

    /* If client ip already in memory, then send it back, else save new conf for client */
    if (client in ipMap && ipMap[client].ip === ip && ipMap[client].port === port) {
        res.status(200).json({ client: ipMap[client] });
    } else {
        const proxyConf = `
            location /proxy/${client} {
                proxy_pass http://${ip}:${port}/;
            }
        `;

        /* Write proxy_pass location module for client (remember to include in domain conf!) */
        writeFile(`/etc/nginx/proxy/${client}.conf`, proxyConf, (error) => {
            if (error) {
                console.error('Could not save configuration', error);
                res.status(500).json({ status: 'failed', error });
            }
            console.log('Proxy configuration was updated for: ', client);

            /* Save conf also to memory */
            ipMap[client] = { ip, port };
            res.status(201).json({ client: ipMap[client] });

            /* Reload nginx conf */
            next()
        });
    }
}, reloadNginx);

app.listen(servicePort, () => console.log(`Service listening on port ${servicePort}!`));
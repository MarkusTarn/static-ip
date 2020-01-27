const { port } = require('./configuration').service
const express = require('express')
const app = express()

const dnsMap = {}

const getDNS = (req, res) => {
    const { client } = req.params
    if (client in dnsMap) {
        res.status(200).json({ client: dnsMap[client] })
    } else {
        res.status(404).json({ client: 'Resource not found' })
    }
}
const updateDNS = (req, res) => {
    const { client } = req.params
    dnsMap[client] = req.header('x-forwarded-for') || req.connection.remoteAddress
    res.status(200).json({ client: dnsMap[client] })
}

app.get('/:client', getDNS)
app.put('/:client', updateDNS)

app.listen(port, () => console.log(`Service listening on port ${port}!`))
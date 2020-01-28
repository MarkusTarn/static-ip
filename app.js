const { port } = require('./configuration').service
const express = require('express')
const app = express()

const dnsMap = {}

app.get('/:client', function (req, res) {
    const { client } = req.params
    console.log('Client queried: ', client)
    if (client in dnsMap) res.status(200).json({ client: dnsMap[client] })
    else res.status(404).json({ client: 'Resource not found' })
})

app.put('/:client', function (req, res) {
    const { client } = req.params
    dnsMap[client] = req.header('x-forwarded-for') || req.connection.remoteAddress
    res.status(200).json({ client: dnsMap[client] })
})

app.listen(port, () => console.log(`Service listening on port ${port}!`))
const express = require('express')
const path = require('path')
const app = express()
const rimraf = require('rimraf')
const fs = require('fs')
const {downloadImageSource, zipFiles} = require('./utils/puppeteer')

const publicDirectory = path.join(__dirname, '../public')
app.use(express.static(publicDirectory))

app.get('/generate', async (req, res) => {
    try {
        await downloadImageSource(req.query.uri)
        await zipFiles()
        rimraf(path.join(__dirname, '../img-container'), {maxBusyTries: 3}, () => {});
        res.status(200).send()
    } catch(e) {
        res.status(404).send({error: e.message})
    }
})

app.get('/download', async (req, res) => {
    res.download(path.join(__dirname, '../out.zip'))
})

const PORT = process.env.PORT || 3000
app.listen(PORT)
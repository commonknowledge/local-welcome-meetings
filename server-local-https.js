const https = require('https')
const fs = require('fs')
const { parse } = require('url')

const next = require('next')
const port = parseInt(process.env.PORT) || 4002
const dev = true
const app = next({ dev, dir: __dirname })
const handle = app.getRequestHandler()

const options = {
  key: fs.readFileSync('./dev/session.adhdtogether.dev-key.pem'),
  cert: fs.readFileSync('./dev/session.adhdtogether.dev.pem'),
}

app.prepare().then(() => {
  https
    .createServer(options, (req, res) => {
      const parsedUrl = parse(req.url, true)
      handle(req, res, parsedUrl)
    })
    .listen(port, (err) => {
      if (err) throw err
      console.info(`> Ready on localhost:${port}`)
    })
})

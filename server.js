const http = require ('http')
const WebSocket = require('ws')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const port = 3000


app.prepare().then(() => {
  const server = http.createServer((request, response) => handle(
    request,
    response,
    parse(request.url, true)
  ))

  const wsServer = new WebSocket.Server({server}).on('connection', ws => {
    ws.on('message', message => {
      wsServer.clients.forEach(client => {
        if (client !== ws) {
          client.send(message)
        }
      })
    })
  })

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})

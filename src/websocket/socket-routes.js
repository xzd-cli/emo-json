const chalk = require('chalk');
const WebSocketServer = require('ws').WebSocketServer
const url = require('url');
const { nanoid } = require('nanoid')

const newNotificationObj = () => ({
  uuid: nanoid(),
  datetime: Date.now(),
  readStatus: "UNREAD",
  message: `A new text message or inner JSON.`,
})

const responseNotificationObj = () => ({
  uuid: nanoid(),
  datetime: Date.now(),
  readStatus: "READ",
  message: "Changes accepted.",
})

const mockNotifications = [
  {
    uuid: nanoid(),
    datetime: Date.now(),
    "readStatus": "READ",
    "message": "Some text message or inner JSON."
  },
  {
    uuid: nanoid(),
    datetime: Date.now(),
    "readStatus": "UNREAD",
    "message": "Another text message or inner JSON."
  }
]

module.exports = (httpServer, wsPathName='/io', feedIntervalStep=30_000, db) => {
  const notificationWS = new WebSocketServer({ noServer: true});
  let responseTimeout, feedInterval;

  notificationWS.on('connection', (ws, connectionRequest) => {
    console.log(chalk.green('WebSocket 连接建立'))
    ws.send(JSON.stringify({ notifications: mockNotifications }));
    
    feedInterval = setInterval(() => {
      ws.send(JSON.stringify({ notifications: [newNotificationObj()]}))
      console.debug(chalk.green('持续发送消息'))
    }, feedIntervalStep)

    ws.on('message', data => {
      try {
        let dataObj = JSON.parse(data);
        console.log(chalk.green(`从客户端接收到数据: ${data}.`));

        if(dataObj?.userResponse === 'FEEDBACK') {
          ws.send(JSON.stringify({ notifications: [responseNotificationObj()]}))
        }
      } catch (error) {
      }
    })

    ws.on('close', () => {
      clearInterval(feedInterval);
      clearTimeout(responseTimeout);
      console.log(chalk.red('WebSocket 连接中断'))
    });
  })


  httpServer.on('upgrade', (request, socket, head) => {
    const { pathname } = url.parse(request.url);
    if(pathname === wsPathName) {
      notificationWS.handleUpgrade(request, socket, head, ws => {
        notificationWS.emit('connection', ws, request);
      })
    } else {
      console.log(chalk.red('关闭socket'))
      socket.destroy();
    }
  })
}

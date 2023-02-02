const { WebSocket, WebSocketServer} = require('ws')
const http = require('http')
const uuidv4 = require('uuid').v4


//create websocket server
const port = 8080;
const server = http.createServer();
const wsServer = new WebSocketServer({server})
server.listen(port, () => {
    console.log(`WebSocket server is running on port ${port}`);
});

//create clients and users object
const clients = {}
const users = {}


function getCoinbaseData() {
    //subscribe to all crypto from list from coinbase websocket
    const coinbaseWebsocket = new WebSocket('wss://ws-feed.exchange.coinbase.com')
    coinbaseWebsocket.on('open', () => {
        coinbaseWebsocket.send(`{
            "type": "subscribe",
            "product_ids": [
                "ETH-USD",
                "BTC-USD",
                "DOGE-USD",
                "LTC-USD"
            ],
            "channels": ["level2", "matches"]
        }`)
    })
    coinbaseWebsocket.on('message', (message) => {
        const dataFromCoinbase = JSON.parse(message.toString())
        for(let userId in clients) {
            if(users[userId].product_ids.includes(dataFromCoinbase.product_id)){
                clients[userId].send(JSON.stringify(dataFromCoinbase))
            }
        }
    })
}

//handle subscriptions from clients
function handleMessage(message, userId) {
    const dataFromClient = JSON.parse(message.toString())
    switch (dataFromClient.type) {
        case 'subscribe':
            if(!users[userId].product_ids.includes(dataFromClient.product_id)){
                users[userId].product_ids.push(dataFromClient.product_id)
            }
            break;
        case 'unsubscribe':
            if(users[userId].product_ids.includes(dataFromClient.product_id)){
                users[userId].product_ids.splice(users[userId].product_ids.indexOf(dataFromClient.product_id))
            }
            break;
        default:
            break;
    }
}

function handleDisconnect(userId) {
    console.log(`removed ${userId} from connection`)
    delete clients[userId]
    delete users[userId]
}

//new client connection
wsServer.on('connection', function(connection) {
    // Create unique id for user
    const userId = uuidv4();
    console.log('new connection')

    // Store new connection
    clients[userId] = connection;
    users[userId] = {
        product_ids: []
    }
    console.log(`${userId} connected.`)

    // Handle message for new user
    connection.on('message', (message) => handleMessage(message, userId));

    // User disconnects
    connection.on('close', () => handleDisconnect(userId))

    //call function to send data to users
    getCoinbaseData()
})

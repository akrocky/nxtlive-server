const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const socketServer=require('./socketServer');
const app = express();
const server   = require('http').Server(app);
app.use(express.json())
app.use(cors())


// Enable CORS for all routes (adjust the options as needed)

app.get('/test', function (req, res, next) {
  res.json({msg: 'This is CORS-enabled for all origins!'})
})
socketServer.registerSocketServer(server)




var port = process.env.PORT || 8000;
server.listen(port, function () {
   console.log('listening on '+port);
});
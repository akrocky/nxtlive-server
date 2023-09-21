const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const socketServer=require('./socketServer');
const app = express();
const server   = require('http').Server(app);
app.use(express.json())
app.use(cors())

// Enable CORS for all routes
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
 
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});



// Enable CORS for all routes (adjust the options as needed)

app.get('/test', function (req, res, next) {
  res.json({msg: 'This is CORS-enabled for all origins!'})
})
socketServer.registerSocketServer(server)




var port = process.env.PORT || 8000;
server.listen(port, function () {
   console.log('listening on '+port);
});
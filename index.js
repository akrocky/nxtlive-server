const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');


const app = express();
app.use(express.json());
app.use(cors());
const server = http.createServer(app);

const io = socketIo(server, {
  cors:{
    origin:'*',
    methods:['GET','POST']
}
 });



app.get('/test', function (req, res, next) {
  res.json({msg: 'This is CORS-enabled for all origins!'})
})

app.use(express.static(__dirname + '/public'));
console.log(__dirname);
console.log(__filename)

io.sockets.on('error', e => console.log(e));
var broadcaster;
io.on('connection', function (socket) {
  console.log("socket connection",socket.id);
   socket.on('broadcaster', function () {
      //id of the broadcaster
      broadcaster = socket.id;
      console.log("send broadcaster"+broadcaster)
      socket.broadcast.emit('broadcaster');
   });
   //Default room
   // Each Socket in Socket.IO is identified by a random, unguessable, unique identifier Socket#id. 
   //For your convenience, each socket automatically joins a room identified by this id.
   socket.on('watcher', function () {
      //tell to broadcast there is a watcher
     console.log("conected",socket.id);
	  if(!(broadcaster=== undefined))
	  {
     
         broadcaster && socket.to(broadcaster).emit('watcher', socket.id);
		  console.log("send watcher");
      }
   });

   //send sdp to the client
   socket.on('offer', function (id /* of the watcher */, message) {
      console.log("send offer")
      socket.to(id).emit('offer', socket.id /* of the broadcaster */, message);
   });
   //send sdp of the client to broad caster
   socket.on('answer', function (id /* of the broadcaster */, message) {
      console.log("send answer")
      socket.to(id).emit('answer', socket.id /* of the watcher */, message);
   });

   //exchange ice candidate
   socket.on('candidate', function (id, message) {
      console.log("candidate")
      socket.to(id).emit('candidate', socket.id, message);
   });

   socket.on('disconnect', function () {
      console.log("disconnect")
      broadcaster && socket.to(broadcaster).emit('bye', socket.id);
   });

});

var port = process.env.PORT || 8000;
server.listen(port, function () {
   console.log('listening on '+port);
});
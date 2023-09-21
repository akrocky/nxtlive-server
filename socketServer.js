const registerSocketServer=(server)=>{
    const io=require=require('socket.io')(server,{
        cors:{
            origin:'*',
            methods:['GET','POST']
        }
    });
    io.sockets.on('error', e => console.log(e));
let broadcaster;
io.on('connection', function (socket) {

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
  

 }

 module.exports={
    registerSocketServer
 }
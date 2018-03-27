const User = require('../../models/user.js');
const Room = require('../room');
const clientList = require('./clientList');

const lobby = (io) => {

  // const client = (user, socket)=>{
  //   return {user, socket};
  // };

  let roomId = 0;
  let clients = new clientList();

  io.on('connection', function (socket) {

    let added = clients.addClient(socket.decoded_token, socket);
    socket.emit('USER_LIST', clients.getUserList());
    if (added === true){
      socket.broadcast.emit('ADD_USER', new User(socket.decoded_token).safeUser());
    }

    Room(socket);
    socket.on('INVITE', function (data){
      // don't invite yourself
      if (socket.decoded_token._id === data.to){
        return;
      }
      const client = clients.findClient(data.to);
      if (!client){
        return;
      }
      const roomName = 'room-' + (++roomId);
      socket.join(roomName);
      socket.emit('ROOM_JOINED', { room:roomName, opponent: client.user} );
      // socket.broadcast.to(data.room).emit('ROOM_JOINED', { room:roomName, opponent:client.user} );
      const targets = client.sockets;

      const source = new User(socket.decoded_token).safeUser();
      targets.forEach((id) => {
        socket.broadcast.to(id).emit('INVITE_RECEIVED', {from: source, room: roomName});
      });
    });

    socket.on('JOIN_ROOM', function(data){
      const res = clients.addRoom(socket.decoded_token, data.room);
      if (res){
        socket.join(data.room);
        socket.emit('ROOM_JOINED', { room:data.room, opponent: new User(socket.decoded_token).safeUser()} );
      }
      else{

        socket.emit('ERROR', {message:'you are already in this room'});
      }
      //socket.broadcast.to(data.room).emit('READY', {socket.decoded_token._id} );
    });

    socket.on('disconnect', function(){
      let deleted = clients.deleteClient(socket.decoded_token, socket);
      if (deleted === true){
        socket.broadcast.emit('DEL_USER', new User(socket.decoded_token).safeUser());
      }
    });
  });


};

module.exports = lobby;

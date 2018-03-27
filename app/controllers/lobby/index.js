const User = require('../../models/user.js');
const clientList = require('./clientList');

const lobby = (io) => {

  // const client = (user, socket)=>{
  //   return {user, socket};
  // };

  let clients = new clientList();

  io.on('connection', function (socket) {

    let added = clients.addClient(socket.decoded_token, socket);
    socket.emit('USER_LIST', clients.getUserList());
    if (added === true){
      socket.broadcast.emit('ADD_USER', new User(socket.decoded_token).safeUser());
    }

    socket.on('disconnect', function(){
      let deleted = clients.deleteClient(socket.decoded_token, socket);
      if (deleted === true){
        socket.broadcast.emit('DEL_USER', new User(socket.decoded_token).safeUser());
      }
    });
  });


};

module.exports = lobby;

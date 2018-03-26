const User = require('../../models/user.js');

const lobby = (io) => {

  io.on('connection', function (socket) {
    const clients = io.of('/').clients().connected;
    socket.emit('USER_LIST',
      Object.keys(clients).map(
        e => new User(clients[e].decoded_token).safeUser()
      )
    );
    socket.broadcast.emit('ADD_USER', new User(socket.decoded_token).safeUser());
    socket.on('disconnect', function(){
      socket.broadcast.emit('DEL_USER', new User(socket.decoded_token).safeUser());
    });
  });


};

module.exports = lobby;

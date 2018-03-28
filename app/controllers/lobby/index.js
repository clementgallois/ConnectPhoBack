const User = require('../../models/user.js');

const room = require('../room');


const lobby = async (io) => {


  io.on('connection', async function (socket) {
    const user = await User.findOneAndUpdate({_id: socket.decoded_token._id}, {$addToSet:{sockets:socket.id}});
    socket.emit('USER_LIST', await User().findConnectedUser());
    if (!user.sockets || user.sockets.length < 1){
      socket.broadcast.emit('ADD_USER', user.safeUser());
    }

    room(socket);

    socket.on('disconnect', async function(){
      const user = await User.findOneAndUpdate({_id: socket.decoded_token._id}, {$pull:{sockets:socket.id}}, {new: true});
      if (user.sockets.length < 1){
        socket.broadcast.emit('DEL_USER', user.safeUser());
      }
    });
  });


};

module.exports = lobby;

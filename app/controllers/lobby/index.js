const User = require('../../models/user.js');
const Room = require('../../models/room.js');
const room = require('../room');

const lobby = async (io) => {

  await User.update({}, {$unset:{sockets:[]}}, {multi:true});
  await Room.remove({});

  io.on('connection', async function (socket) {
    const user = await User.findOneAndUpdate({_id: socket.decoded_token._id}, {$addToSet:{sockets:socket.id}});
    if (!user.sockets || user.sockets.length < 1){
      socket.broadcast.emit('ADD_USER', user.safeUser());
    }
    socket.emit('USER_LIST', await User().findConnectedUser());
    const userRooms = await Room().getUserRooms(socket.decoded_token._id);
    socket.emit('ROOM_LIST', userRooms);

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

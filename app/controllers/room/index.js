const User = require('../../models/user.js');

const Room = (socket, rooms) => {
  socket.on('CREATE_GAME', function(data){
    const roomId = ++rooms.currentId;
    socket.join('room-' + roomId);
    socket.emit('newGame', {name: data.name, room: 'room-' + roomId});
  });


};

module.exports = Room;

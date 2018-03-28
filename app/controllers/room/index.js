const User = require('../../models/user.js');
const Room = require('../../models/room.js');

const room = (socket) => {
  socket.on('INVITE', async function (data){
    // don't invite yourself
    if (socket.decoded_token._id === data.to){
      return;
    }
    const client = await User.findOne({_id:data.to});
    if (!client){
      return;
    }
    const checkRoom = await Room.findOne({$or:[{'opponent.id': socket.decoded_token._id}, {'owner.id': socket.decoded_token._id}]});
    if (checkRoom){
      socket.emit('ERROR', {message:'A room with this user already exist'});
      return;
    }
    const room = new Room({
      owner:{
        id:socket.decoded_token._id,
        ready: true
      },
      opponent:{
        id: data.to,
        ready: false
      }
    });
    await room.save();
    socket.join(room._id);
    const opponentInfo = await User.findOne(room.opponent.info);
    socket.emit('ROOM_JOINED', { room:room._id, opponent: opponentInfo.safeUser()} );
    const source = await User.findOne({_id: socket.decoded_token._id});
    if (!source){return;}
    client.sockets.forEach((id) => {
      socket.broadcast.to(id).emit('INVITE_RECEIVED', {from: source.safeUser(), room: room._id});
    });
  });

  socket.on('JOIN_ROOM', async function(data){
    const room = await Room.findOne({_id:data.room});
    if (room.opponent.id.toString() !== socket.decoded_token._id){
      socket.emit('ERROR', {message:'This room isn\'t for you'});
      return;
    }
    if (room.opponent.ready === true){
      socket.emit('ERROR', {message:'You are already in this room'});
      return;
    }
    // Room.findOneAndUpdate({_id:data.room}, {$set:{ready:true}})
    room.opponent.ready=true;
    await room.save();
    socket.join(room._id);
    const source = await User.findOne({_id: room.owner.id});
    socket.emit('ROOM_JOINED', { room:room._id, opponent: source.safeUser()} );
    const owner = await User.findOne({_id: socket.decoded_token._id});
    socket.broadcast.to(room._id).emit('READY', {room: room.id, opponent: owner.safeUser()} );
  });
};

module.exports = room;

const User = require('../../models/user.js');

class client{
  constructor(user, socket){
    this.user = new User(user).safeUser();
    this.sockets = [socket];
    this.rooms = [];
  }

  addRoom(room){
    this.rooms.push(room);
  }

  deleteRoom(room){
    this.rooms.splice(this.rooms.indexOf(room), 1);
  }

  addSocket(socket){
    this.sockets.push(socket);
  }
  deleteSocket(socketId){
    for (let i = 0; i < this.sockets.length; i++){
      if (this.sockets[i] === socketId){
        this.sockets.splice(i,1);
        return;
      }
    }
  }
}

module.exports = client;

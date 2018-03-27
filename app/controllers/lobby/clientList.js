const client = require('./client.js');

class clientList {
  constructor(){
    this.list = [];
  }

  addClient(decoded_token, socket){
    for (let i = 0; i < this.list.length; i++){
      if (this.list[i].user._id.toString() === decoded_token._id){
        this.list[i].addSocket(socket.client.id);
        return false;
      }
    }
    this.list.push(new client(decoded_token, socket.client.id));
    return true;
  }

  deleteClient(decoded_token, socket){
    for (let i = 0; i < this.list.length; i++){
      if (this.list[i].user._id.toString() === decoded_token._id){
        this.list[i].deleteSocket(socket.client.id);
        if (this.list[i].sockets.length < 1){
          this.list.splice(i,1);
          return true;
        }
        return false;
      }
    }
  }

  addRoom(decoded_token, room){
    for (let i = 0; i < this.list.length; i++){
      if (this.list[i].user._id.toString() === decoded_token._id){
        if (!this.list[i].rooms.includes(room)){
          this.list[i].addRoom(room);
          return true;
        }
        return false;
      }
    }
    return false;
  }

  getUserList(){
    return this.list.map(e => e.user);
  }

  findClient(id){
    return this.list.find((client) => client.user._id.toString() === id);
  }

  getClients(){
    return this.list;
  }
}

module.exports = clientList;

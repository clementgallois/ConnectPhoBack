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
          return true;
        }
        return false;
      }
    }
  }

  getUserList(){
    return this.list.map(e => e.user);
  }

  getClients(){
    return this.list;
  }
}

module.exports = clientList;

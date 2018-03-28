var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  owner: {
    id :{type: mongoose.Schema.ObjectId, ref: 'User', required:true},
    ready:{type:Boolean}
  },
  opponent: {
    id :{type: mongoose.Schema.ObjectId, ref: 'User'},
    ready:{type:Boolean}
  }
});

module.exports = mongoose.model('Room', userSchema);

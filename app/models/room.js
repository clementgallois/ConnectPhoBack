var mongoose = require('mongoose');

var roomSchema = mongoose.Schema({
  owner: {
    id :{type: mongoose.Schema.ObjectId, ref: 'User', required:true},
    ready:{type:Boolean}
  },
  opponent: {
    id :{type: mongoose.Schema.ObjectId, ref: 'User'},
    ready:{type:Boolean}
  }
});

roomSchema.methods.getUserRooms = async function(id){
  const res = await this.model('Room').aggregate([
    {
      $match:{
        $or: [
          {'owner.id': mongoose.Types.ObjectId(id)},
          {'opponent.id': mongoose.Types.ObjectId(id), 'opponent.ready': true}
        ]
      }
    },
    {
      $addFields:{
        isOwner:{
          $cond: [
            {$eq:['$owner.id', mongoose.Types.ObjectId(id)]},true,false
          ]
        }
      }
    }
  ]);
  return this.model('User').populate(res, [
    {path:'owner.id', select:'username pictureUrl'},
    {path:'opponent.id', select:'username pictureUrl'},
  ]);
};
roomSchema.methods.populateRoom = function(){
  return this.model('User').populate(this, [
    {path:'owner.id', select:'username pictureUrl'},
    {path:'opponent.id', select:'username pictureUrl'},
  ]);
};


module.exports = mongoose.model('Room', roomSchema);

var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
const validator = require('validator');

// define the schema for our user model
var userSchema = mongoose.Schema({
  email : { type: String, required: true, unique: true },
  password : { type: String, required: true },
  username : { type: String, required: true, unique: true },
  sockets: [{ type:String }],
  pictureUrl : {type: String, default: '/imageDefault.png'},
  verified : { type: Boolean }
});

// methods
// generating a hash
userSchema.methods.generateHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.safeUser = function () {
  return {
    _id: this._id,
    //email : this.email,
    username : this.username,
    pictureUrl : this.pictureUrl,
  };
};

userSchema.methods.findConnectedUser = function() {
  return this.db.model('User').find({
    sockets: {
      $exists: true,
      $not: { $size: 0 }
    }
  },
  {
    email:0,
    password:0,
    sockets:0,
  });
};

userSchema.methods.isValid = function() {
  if (!validator.isEmail(this.email)){
    return 'Invalid email address';
  } else if (!validator.isAlphanumeric(this.username) || !this.username.length > 0){
    return 'Username may only contain alphanumeric characters';
  }
  else if (!this.password.length > 0){
    return 'Password can\'t be empty';
  }
  return null;
};

// checking if password match
userSchema.methods.checkPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);

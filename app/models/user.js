var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

      email : { type: String, required: true, unique: true },
      password : { type: String, required: false },
      username : { type: String, required: true, unique: true },
      pictureUrl : String,
      verified : { type: Boolean }
});

// methods
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.safeUser = (user) => {
  return {
    _id: user._id,
    email : user.local.email
    username : user.profile.username,
    pictureUrl : user.profile.pictureUrl || "../../public/images/imagedefault.png",
  };
}

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);

var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
const validator = require('validator');

// define the schema for our user model
var userSchema = mongoose.Schema({
	email : { type: String, required: true, unique: true },
	password : { type: String, required: true },
	username : { type: String, required: true, unique: true },
	pictureUrl : String,
	verified : { type: Boolean }
});

// methods
// generating a hash
userSchema.methods.generateHash = (password) => {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.safeUser = (user) => {
	return {
		_id: user._id,
		email : user.local.email,
		username : user.profile.username,
		pictureUrl : user.profile.pictureUrl || '../../public/images/imagedefault.png',
	};
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
	return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);

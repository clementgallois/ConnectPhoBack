const jwt = require('jsonwebtoken');

const User = require('../../models/user.js');

const auth = (app) => {
	app.post('/authenticate', async (req, res) => {
		// find the user
		try {
			const user = await User.findOne({username: req.body.username});
			console.log(user);
		} catch (err){
			return res.sendStatus(500);
		}
	});

	app.post('/register', async (req, res) => {
		let user = new User({
			username: req.body.username || '',
			email: req.body.email || '',
			password: req.body.password || '',
		});

		const valid = user.isValid();
		if (valid){
			return res.status(400).json({success:false, message:valid});
		}
		try{
			const saved = await user.save();
			return res.json({success:true, message: 'Registration successful'});
		}
		catch (e){
			console.log(e);
			return res.sendStatus(500);
		}

	});

};

module.exports = auth;

const jwt = require('jsonwebtoken');

const User = require('../../models/user.js');

const auth = (app) => {
	app.post('/login', async (req, res) => {
		// find the user
		try {
			const user = await User.findOne({username: req.body.username});
			console.log(user);
		} catch (err){
			return res.sendStatus(500);
		}
	});

	app.post('/register', async (req, res) => {
		const user = await User.findOne({
			$or: [
				{email: req.body.email},
				{username: req.body.username}
			]
		});
		if (user){
			return res.status(400).json({
				success:false,
				message: `Another account is using this ${
					user.email === req.body.email ? 'email address' : 'username'
				}`});
		}
		let newUser = new User({
			username: req.body.username || '',
			email: req.body.email || '',
			password: req.body.password ?
				User().generateHash(req.body.password) : '',
		});

		const valid = newUser.isValid();
		if (valid){
			return res.status(400).json({success:false, message:valid});
		}
		try{
			const saved = await newUser.save();
			const token = jwt.sign(saved.toJSON(), app.get('secret'), {expiresIn: '7d'});
			return res.json({
				success:true,
				message: 'Registration successful',
				user: saved.safeUser(),
				token,
			});
		}
		catch (e){
			return res.sendStatus(500);
		}

	});

};

module.exports = auth;

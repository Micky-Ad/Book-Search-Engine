const { request } = require("express");
const jwt = require("jsonwebtoken");

// set token secret and expiration date
const secret = "mysecretsshhhhh";
const expiration = "2h";

module.exports = {
	// function for our authenticated routes
	authMiddleware: function ({ req, res }) {


		let token = req.query.token || req.headers.authorization;

		// ["Bearer", "<tokenvalue>"]
		if (req.headers.authorization) {
			token = token.split(" ").pop().trim();
		}
		else if (req.query.token) {
			token = req.query.token;
		}


		if (!token) {

			// return res.status(400).json({ message: "You have no token!" });
		}
		else {

			// verify token and get user data out of it
			try {
				const { data } = jwt.verify(token, secret, { maxAge: expiration });
				let user = req.user = data;
				return { user: user }

			} catch {
				console.log("Invalid token");
				return res.status(400).json({ message: "invalid token!" });
			}

			// send to next endpoint
			req.next();
		}


	},
	signToken: function ({ username, email, _id }) {
		const payload = { username, email, _id };

		return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
	},
};

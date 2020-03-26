const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const Users = require('../models/user-models');

// Login with google
router.get(
	'/google',
	passport.authenticate('google', {
		scope: ['profile', 'email'],
		prompt: 'select_account'
	})
);

// google login redirect
router.get(
	'/google/redirect',
	passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL}` }),
	(req, res) => {
		console.log('THIS IS THE RES.req:', res.req.authInfo)
		res
			.status(200)
			.cookie('token', res.req.authInfo)
			.cookie('user_id', req.user.id)
			.redirect(`${process.env.FRONTEND_URL}/profile/${req.user.id}`);
	}
);

// Login with facebook
router.get(
	'/facebook',
	passport.authenticate('facebook', {
		authType: 'reauthenticate',
		scope: ['public_profile', 'email']
	})
);

// facebook login redirect
router.get(
	'/facebook/redirect',
	passport.authenticate('facebook'),
	(req, res) => {
		res.status(200).redirect(`${process.env.FRONTEND_URL}/workflows`);
	}
);

module.exports = router;

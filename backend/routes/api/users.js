const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSignup = [
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Please provide a valid email.'),
    check('username')
      .exists({ checkFalsy: true })
      .withMessage("Username is required"),
    // check('username')
      // .exists({ checkFalsy: true })
      // .isLength({ min: 4 })
      // .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
    check('firstName')
      .exists({ checkFalsy: true })
      .withMessage("First Name is required"),
    check('lastName')
      .exists({ checkFalsy: true })
      .withMessage("Last Name is required"),
    check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
];

router.post(
    '/',
    validateSignup,
    async (req, res) => {
      const { email, password, username, firstName, lastName } = req.body;

      const checkEmail = await User.findOne({
        where: { email: email }
      })
      if (checkEmail) {
        return res.json({
          statusCode: 403,
          message: 'User already exist',
          error: {
            email: "User with that email already exists"
          }
        })
      }
      const checkUsername = await User.findOne({
        where: { username: username }
      })
      if (checkUsername) {
        return res.json({
          statusCode: 403,
          message: 'User already exist',
          error: {
            email: "User with that username already exists"
          }
        })
      }


      const user = await User.signup({ email, username, password, firstName, lastName });

      await setTokenCookie(res, user);

      return res.json({
        user: user
      });
    }
);




module.exports = router;

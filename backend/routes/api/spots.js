const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, SpotImage, Review, ReviewImage, Booking } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// // Get all spots
// router.get('/', async (req, res) => {
//     const spots = await Spot.findAll()
//     console.log(spots)
//     return res.json({
//         spots
//     })
// })





module.exports = router;

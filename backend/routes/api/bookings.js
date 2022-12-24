const express = require('express');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Spot, SpotImage, Review, ReviewImage, Booking, sequelize } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// Get all of the Current User's Bookings

router.get('/current', requireAuth, async (req, res) => {

    const userId = req.user.id;
    const bookings = await Booking.findAll({
        where: {
            userId: userId
        },
        include: {
                model: Spot,
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            }
    })
    // console.log('bookings----->', bookings)
    let bookingList = [];
    for (let booking of bookings) {
        bookingList.push(booking.toJSON())
    }
    // console.log('bookingList---------->', bookingList)
    for (let booking of bookingList) {
        // console.log('spot.id --------------->', booking.Spot.id) // 2
        const spotId = booking.Spot.id
        const spotImages = await SpotImage.findAll({
            where: {
                spotId: spotId
            }
        })
        // console.log('spotImages --------->', spotImages)
        let imageList = []
        spotImages.forEach(img => {
            imageList.push(img.toJSON())
        })
        // console.log('imageList ==========>', imageList)
        imageList.forEach(img => {
            if (img.preview === true) {
                booking.Spot.previewImage = img.url
            } else {
                booking.Spot.previewImage = 'Preview unavailable'
            }
        })
    }
    // Error handling
    if (!bookings) {
        res.statusCode = 404
        return res.json({
            message: 'No bookings found',
            statusCode: 404
        })
    }
    return res.json({
        Bookings: bookingList
    })
})





















module.exports = router;

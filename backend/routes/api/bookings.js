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

// Edit (PUT) a Booking
router.put('/:bookingId', requireAuth, async (req, res) => {
    const bookingId = req.params.bookingId;
    const { startDate, endDate } = req.body;
    const booking = await Booking.findByPk(bookingId);

    //No booking
    if (!booking) {
        res.statusCode = 404;
        return res.json({
            message: "Booking couldn't be found",
            statusCode: 404
        })
    }
    if (Date.parse(startDate) >= Date.parse(endDate)) {
        res.statusCode = 400;
        return res.json({
            message: "Validation error",
            statusCode: 400,
            errors: {
                endDate: "endDate cannot come before startDate"
            }
        })
    }
    const currentDate = Date.now()
    if (Date.parse(endDate) <= currentDate) {
        res.statusCode = 403;
        return res.json({
            message: "Past bookings can't be modified",
            statusCode: 403
        })
    }
    // DOUBLE CHECK FOR THE CONDITION!!!
    if (Date.parse(startDate) >= Date.parse(booking.startDate) &&
        Date.parse(startDate) <= Date.parse(booking.endDate)) {
            res.statusCode = 403;
            return res.json({
                message: "Sorry, this spot is already booked for the specified dates",
                statusCode: 403,
                startDate: "Start date conflicts with an existing booking"
            })
        }
        // End Date between existing booking
        if (Date.parse(endDate) >= Date.parse(booking.startDate) &&
        Date.parse(endDate) <= Date.parse(booking.endDate)) {
            res.statusCode = 403;
            return res.json({
                message: "Sorry, this spot is already booked for the specified dates",
                statusCode: 403,
                endDate: "End date conflicts with an existing booking"
            })
        }
        // Existing Booking between the new booking
        if (Date.parse(booking.startDate) >= Date.parse(startDate) &&
        Date.parse(booking.endDate) <= Date.parse(endDate)) {
            res.statusCode = 403;
            return res.json({
                message: "Sorry, this spot is already booked for the specified dates",
                statusCode: 403,
                startDate: "Start date conflicts with an existing booking",
                endDate: "End date conflicts with an existing booking"
            })
        }
    // Edit (Update) booking
    await booking.update({
        startDate,
        endDate
    })

    return res.json({ booking })
})



















module.exports = router;

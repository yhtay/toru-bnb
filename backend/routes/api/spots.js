const express = require('express');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Spot, SpotImage, Review, ReviewImage, Booking, sequelize } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
// const spot = require('../../db/models/spot');

const router = express.Router();

const validateSpots = [
    check('address')
        .exists({ checkFalsy: true })
        .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage('State is required'),
    check('country')
        .exists({ checkFalsy: true })
        .withMessage('Country is required'),
    check('lat')
        .exists({ checkFalsy: true })
        .withMessage('Latitude is not valid'),
    check('lng')
        .exists({ checkFalsy: true })
        .withMessage('Latitude is not valid'),
    check('name')
        .exists({ checkFalsy: true })
        .isLength({ max: 50 })
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage('Description is required'),
    check('price')
        .exists({ checkFalsy: true })
        .withMessage('Price per day is required'),
    handleValidationErrors
]

const validateReviews = [
    check('review')
        .exists({ checkFalsy: true })
        .withMessage("Review text is required"),
    check('stars')
        .exists({ checkFalsy: true })
        .isInt({min: 1, max: 5})
        .withMessage("Stars must be an integer from 1 to 5"),
    handleValidationErrors
]

const queryValidation = [
    check('page')
        .optional({ nullable: true })
        .isInt({min: 1})
        .withMessage("Page must be greater than or equal to 1"),
    check('size')
        .optional({ nullable: true })
        .isInt({min: 1})
        .withMessage("Size must be greater than or equal to 1"),
    check('minLat')
        .optional({ nullable: true })
        .isDecimal()
        .withMessage("Minimum latitude is invalid"),
    check('maxLat')
        .optional({ nullable: true })
        .isDecimal()
        .withMessage("Maximm latitude is invalid"),
    check('minLng')
        .optional({ nullable: true })
        .isDecimal()
        .withMessage("Minimum longitude is invalid"),
    check('maxLng')
        .optional({ nullable: true })
        .isDecimal()
        .withMessage("Maximum longitude is invalid"),
    check('minPrice')
        .optional()
        .isDecimal({ min: 0 })
        .withMessage("Minimum price must be greater than or equal to 0"),
    check('maxPrice')
        .optional()
        .isDecimal({ min: 0 })
        .withMessage("Maximum price must be greater than or equal to 0"),
    handleValidationErrors
]

// Get all spots
router.get('/', queryValidation, async (req, res, next) => {

    // Pagination
    let { page, size } = req.query
    // console.log('page -----> ', page)

    if (!page || page > 10) page = 1;
    if (!size || size > 20) size = 200;

    page = parseInt(page);
    size = parseInt(size);

    const pagination = {};
    if (page >= 1 && size >= 1) {
        pagination.limit = size;
        pagination.offset = size * (page - 1);
    }

    const spots = await Spot.findAll({
        include: [
            {model: Review},
            {model: SpotImage}
        ],
        ...pagination
    })
    let spotList = []

    for (let spot of spots) {
        spot = spot.toJSON()

        const avgRating = await Review.findAll({
            where: {
                spotId: spot.id
            },
            attributes: [
                [sequelize.fn("ROUND", sequelize.fn("AVG", sequelize.col("stars")), 2), "avgRating"]
            ]
        })
        let avgList = [];
        avgRating.forEach(rating => {
            avgList.push(rating.toJSON())
        })
        // console.log('avgRating ----->', avgList)
        for (let avgRating of avgList) {
            // console.log(avgRating)
            spot.avgRating = avgRating.avgRating
            if (!spot.avgRating) {
                spot.avgRating = 'No reviews for this spot'
            }
        }
        // console.log('spot---->', spot)
        if (spot.SpotImages.length > 0) {
            spot.SpotImages.forEach(image => {
                if (image.preview === true) {
                    spot.previewImage = image.url
                }
            })
        } else {
            spot.previewImage = 'No preview available'
        }

        delete spot.Reviews
        delete spot.SpotImages
        spotList.push(spot)
    }

    return res.json({
        Spots: spotList,
        page: page,
        size: size
    })
})


// Get all Spots by Current User
router.get('/current', requireAuth, async (req, res) => {

    const ownerId = req.user.id;
    const spots = await Spot.findAll({
        where: {
            ownerId: ownerId
        },
        include: [
            {model: Review},
            {model: SpotImage}
        ]
    })
    const spotList = [];

    for (let spot of spots) {
        // Turn into JSON objects for data manipulation
        spot = spot.toJSON()
        // console.log('spot.id ------>', spot.id)

        // Through reviews, get avgRating
        const reviews = await Review.findAll({
            where: {
                spotId: spot.id
            },
            attributes: [
                [sequelize.fn("ROUND", sequelize.fn("AVG", sequelize.col("stars")), 2), "avgRating"]
            ]
        })
        let reviewList = [];
        reviews.forEach(review => {
            reviewList.push(review.toJSON())
        })
        // console.log('reviewList ---->', reviewList)
        for (let avgRating of reviewList) {
            spot.avgRating = avgRating.avgRating
            if (!spot.avgRating) {
                spot.avgRating = 'No reviews for this spot'
            }
        }

        if (spot.SpotImages.length > 0) {
            spot.SpotImages.forEach(image => {
                if (image.preview === true) {
                    spot.previewImage = image.url
                }
            })
        } else {
            spot.previewImage = 'No preview available'
        }

        delete spot.Reviews
        delete spot.SpotImages
        spotList.push(spot)
    }
    return res.json({
        Spots: spotList
    })
})

// Get Spot by Id
router.get('/:spotId', async (req, res) => {
    const spotId = req.params.spotId;

    let spot = await Spot.findOne({
        where: {
            id: spotId
        },
        include: [
            {
                model: Review,
                attributes: []
            },
            {
                model: SpotImage,
                attributes: ['id', 'url', 'preview']
            },
            {
                model: User, as: 'Owner',
                attributes: ['id', 'firstName', 'lastName']
            }
        ]
    })
    // Error Handling
    if (!spot) {
        res.statusCode = 404
        return res.json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }

    spot = spot.toJSON()
    // console.log('spot ---->', spot)
    let reviews = await Review.findAll({
        where: {
            spotId: spot.id
        },
        attributes: [
            [sequelize.fn("COUNT", sequelize.col("id")), "numReviews"],
            [sequelize.fn("ROUND", sequelize.fn("AVG", sequelize.col("stars")), 2), "avgRating"]
        ]
    })
    // console.log('reviews ----->', reviews)
    let reviewList = []
    reviews.forEach(review => {
        reviewList.push(review.toJSON())
    })
    // console.log('reviewList ------>', reviewList)

    for (let review of reviewList) {
        // console.log('numReviews ----->', review.numReviews)
        spot.numReviews = +review.numReviews
        spot.avgRating = +review.avgRating
    }

    return res.json(spot)
})


// // Create a Spot

router.post('/', [requireAuth, validateSpots], async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const ownerId = req.user.id;
    const user = await User.findByPk(ownerId);

    if (user) {
        const newSpot =  await user.createSpot({
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        })
        return res.json(newSpot)
    }
})

// Add an Image to a Spot based on the Spot's id

router.post('/:spotId/images', requireAuth, async (req, res) => {

    const spotId = req.params.spotId;
    const { url, preview } = req.body
    const currentUser = req.user;
    // console.log('currentUser ID -------->', currentUser.id)

    const spot = await Spot.findByPk(spotId)
    // console.log('spot ----->', spot)

    if (spot) {
        if (currentUser.id === spot.ownerId) {
            const newImage = await spot.createSpotImage({
                url,
                preview
            })
            return res.json({
                id: newImage.id,
                url: newImage.url,
                preview: newImage.preview
            })
        } else {
            res.statusCode = 403;
            return res.json({
                message: "Forbidden",
                statusCode: 403
            })
        }
    } else {
        res.statusCode = 404
        return res.json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }
})

// Edit a Spot
router.put('/:spotId', [requireAuth, validateSpots], async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const spotId = req.params.spotId;
    const currentUser = req.user;

    const spot = await Spot.findByPk(spotId);
    // console.log('spot ----->', spot)
    if (spot) {
        if (currentUser.id === spot.ownerId) {

            const editedImage = await spot.update({
                address,
                city,
                state,
                country,
                lat,
                lng,
                name,
                description,
                price
            })
            res.statusCode = 200;
            return res.json(editedImage)
        } else {
            res.statusCode = 403;
            return res.json({
                message: "Forbidden",
                statusCode: 403
            })
        }
    } else {
        res.statusCode = 404
        return res.json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }
})


// DELETE a Spot
router.delete('/:spotId', requireAuth, async (req, res) => {

    const spot = await Spot.findByPk(req.params.spotId);
    const currentUser = req.user;

    if (spot) {
        if (currentUser.id === spot.ownerId) {
            await spot.destroy()
            res.statusCode = 200;
            return res.json({
                message: 'Successfully deleted',
                statusCode: 200
            })
        } else {
            res.statusCode = 403;
            return res.json({
                message: "Forbidden",
                statusCode: 403
            })
        }

    } else {
        res.statusCode = 404;
        return res.json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }
})

// GET all Bookings for a Spot based on the Spot's id
router.get('/:spotId/bookings', requireAuth, async (req, res) => {

    const user = req.user;
    // console.log('user.id ====>', user.id)
    const spotId = req.params.spotId;

    const spot = await Spot.findByPk(spotId);
    // console.log('spot -------->', spot)

    if (!spot) {
        res.statusCode = 404;
        return res.json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }
    // Owner of the spot
    if (user.id === spot.ownerId) {
        const spotsBookings = await Booking.findAll({
            where: {
                spotId: spot.id
            },
            include:{
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            }
        })
        // console.log('spotsBookings ---------->', spotsBookings)
        return res.json({
            Bookings: spotsBookings
        })
    } else {
    // NOT owner of the spot
        const nonOwnerBooking = await Booking.findAll({
            where: {
                spotId: spot.id
            },
            attributes: ['spotId', 'startDate', 'endDate']
        })
        console.log('nonOwnerBooking ---------->', nonOwnerBooking)
        return res.json({
            Bookings: nonOwnerBooking
        })
    }
})

// Create (POST) a Booking from a Spot based on the Spot's id
router.post('/:spotId/bookings', requireAuth, async (req, res) => {

    const spotId = req.params.spotId;
    // console.log('spotId==========>', typeof(spotId)) // string
    const userId = req.user.id;
    const { startDate, endDate } = req.body;

    if (Date.parse(endDate) <= Date.parse(startDate)) {
        res.statusCode = 400;
        return res.json({
            message: "Validation error",
            statusCode: 400,
            errors: {
                endDate: "endDate cannot come before startDate"
            }
        })
    }
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
        res.statusCode = 404;
        return res.json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }
    // Authorization Check
    // console.log('current User Id =======>', userId)
    // console.log('spot user id ------>', spot.ownerId)
    if (userId === spot.ownerId) {
        res.statusCode = 403;
        return res.json({
            message: "Forbidden",
            statusCode: 403
        })
    }
    // Booking conflict
    const bookings = await Booking.findAll({
        where: {
            spotId
        }
    })
    // console.log('bookings --------->', bookings)
    for (let booking of bookings) {
        // Start Date between existing booking
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
    }
    const newBooking = await Booking.create({
        spotId: parseInt(spotId),
        userId: userId,
        startDate: startDate,
        endDate: endDate
    })
    res.statusCode = 200;
    return res.json(newBooking)
})

// GET all Reviews by a Spot's id
router.get('/:spotId/reviews', async (req, res) => {
    const spotId = req.params.spotId;
    const spot = await Spot.findByPk(spotId);

    if (spot) {
        const reviews = await Review.findAll({
            where: {
                spotId: spotId
            },
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName']
                },
                {
                    model: ReviewImage,
                    attributes: ['id', 'url']
                }
            ]
        })
        // console.log('reviews ========> ', reviews)
        res.statusCode = 200
        return res.json({
            Reviews: reviews
        })
    } else {
        res.statusCode = 404;
        return res.json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }
})

// Create (POST) a review for a spot based on the Spot's id
router.post('/:spotId/reviews', [requireAuth, validateReviews], async (req, res) => {
    const spotId = req.params.spotId;
    const { review, stars } = req.body;
    const userId = req.user.id;
    let spot = await Spot.findByPk(spotId);
    // console.log('spot-------------> ', spot)

    if (!spot) {
        res.statusCode = 404;
        return res.json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }
    // spot = spot.toJSON()
    const userReview = await Review.findOne({
        where: {
            userId,
            spotId
        }
    })
    // console.log('userReview ----------> ', userReview)
    if (userReview) {
        res.statusCode = 403;
        return res.json({
            message: "User already has a review for this spot",
            statusCode: 403
        })
    }
    const newReview = await Review.create({
        userId,
        spotId,
        review,
        stars,
    })
    res.statusCode = 201;
    return res.json(newReview)
})









module.exports = router;

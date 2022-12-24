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


// Get all spots
router.get('/', async (req, res, next) => {
    const spots = await Spot.findAll({
        include: [
            {model: Review},
            {model: SpotImage}
        ]
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
        Spots: spotList
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
        spot.numReviews = review.numReviews
        spot.avgRating = review.avgRating
    }

    return res.json({
        spot
    })
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

router.post('/:spotId/images', async (req, res) => {

    const spotId = req.params.spotId;
    const { url, preview } = req.body

    const spot = await Spot.findByPk(spotId)
    // console.log('spot ----->', spot)

    if (spot) {
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

    const spot = await Spot.findByPk(spotId);
    // console.log('spot ----->', spot)
    if (spot) {
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
        return res.json(editedImage)
    } else {
        res.statusCode = 404
        return res.json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }
})


// Delete a Spot
router.delete('/:spotId', requireAuth, async (req, res) => {

    const spot = await Spot.findByPk(req.params.spotId);

    if (spot) {
        await spot.Destroy
        res.statusCode = 200;
        return res.json({
            message: 'Successfully deleted',
            statusCode: 200
        })
    } else {
        res.statusCode = 404;
        return res.json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }
})

// Get all Bookings for a Spot based on the Spot's id
router.get('/:spotId/bookings', requireAuth, async (req, res) => {

    const user = req.user;
    console.log('user.id ====>', user.id)
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










module.exports = router;

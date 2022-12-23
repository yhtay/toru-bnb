const express = require('express');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Spot, SpotImage, Review, ReviewImage, Booking, sequelize } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const spot = require('../../db/models/spot');

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


router.get('/', async (req, res) => {
    const spots = await Spot.findAll()
    // console.log('spots ------------->', spots)
    let spotList = [];

    for (let spot of spots) {
        spot = spot.toJSON()
        // console.log('spot----->', spot)
        const reviews = await Review.findAll({
            where: {
                spotId: spot.id
            },
            attributes: [
                [
                    sequelize.fn("AVG", sequelize.col("stars")), "avgRating"
                ]
            ]
        })
        // console.log('reviews------>', reviews[0].dataValues.avgRating)
        spot.avgRating = reviews[0].dataValues.avgRating

        const spotImages = await SpotImage.findAll({
            where: {
                spotId: spot.id,
                preview: true
            }
        })
        console.log('spotImages ------>', spotImages[0].dataValues.url)
        spot.previewImage = spotImages[0].dataValues.url

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
        }
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
                [
                    sequelize.fn("AVG", sequelize.col("stars")), "avgRating"
                ]
            ]
        })
        // console.log('avgRating ------->', reviews[0].dataValues.avgRating)
        spot.avgRating = reviews[0].dataValues.avgRating

        // Get url from spotimages if preview is true.
        const spotImages = await SpotImage.findAll({
            where: {
                spotId: spot.id,
                preview: true
            }
        })
        // console.log('spotImages ------>', spotImages[0].dataValues.url)
        spot.previewImage = spotImages[0].dataValues.url

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
            statusCode: res.statusCode
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
            [sequelize.fn("AVG", sequelize.col("stars")), "avgRating"]
        ]
    })
    // console.log('review ----->', reviews)
    reviews.forEach(review => {
        review.toJSON()
        console.log('reviews ----->', reviews)
        console.log('numReviews ------>', reviews[0].dataValues.numReviews)
        console.log('avgRating ------>', reviews[0].dataValues.avgRating)
    })

    spot.numReviews = reviews[0].dataValues.numReviews
    spot.avgRating = reviews[0].dataValues.avgRating

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




module.exports = router;

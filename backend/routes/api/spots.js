const express = require('express');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Spot, SpotImage, Review, ReviewImage, Booking, sequelize } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();
// comment
// Get all spots
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

// router.get('/:spotId', async (req, res) => {
//     const spotId = req.params.spotId;
//     const spot = await Spot.findOne({
//         where: {
//             id: spotId
//         },
//         include: [
//             {
//                 model: Review,
//                 attributes: []
//             },
//             {
//                 model: SpotImage,
//                 attributes: ['id', 'url', 'preview']
//             },
//             {
//                 model: User, as: 'Owner',
//                 attributes: ['id', 'firstName', 'lastName']
//             }
//         ],
//         attributes: [
//             "id",
//             "ownerId",
//             "address",
//             "city",
//             "state",
//             "country",
//             "lat",
//             "lng",
//             "name",
//             "description",

//             "price",
//             "createdAt",
//             "updatedAt",
//             [ Review, '']
//             [sequelize.fn("AVG", sequelize.col("Reviews.stars")), "avgRating"]
//         ]
//     })
//     return res.json({
//         spot
//     })
// })

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

// router.post('/', requireAuth, async (req, res) => {
//     const { address, city, state, country, lat, lng, name, description, price } = req.body;
//     const ownerId = req.user.id;
//     const user = await User.findByPk(ownerId);

//     console.log('user ------>', user)

// })


module.exports = router;

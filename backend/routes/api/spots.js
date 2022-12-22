const express = require('express');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Spot, SpotImage, Review, ReviewImage, Booking, sequelize } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();
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
        let avgRating = reviews[0].dataValues.avgRating
        spot.avgRating = avgRating.toFixed(1)

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
        let avgRating = reviews[0].dataValues.avgRating
        spot.avgRating = avgRating.toFixed(1)

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
    res.json({
        Spots: spotList
    })
})



// Create a Spot

// router.post('/', async (req, res) => {
//     const { address, city, state, country, lat, lng, name, description, price } = req.body;
//     const ownerId = req.user.id;
//     const user = await User.findByPk(ownerId);

//     if (user) {
//         const newSpot = await
//     }
// })


module.exports = router;

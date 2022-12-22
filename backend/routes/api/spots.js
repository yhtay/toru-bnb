const express = require('express');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Spot, SpotImage, Review, ReviewImage, Booking, sequelize } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// Get all spots

// 1
router.get('/', async (req, res) => {

    const spots = await Spot.findAll()
    // console.log('spots ------>', spots)
    let spotList = [];
    for (let spot of spots) {
        spot = spot.toJSON()
        // console.log('spot -------->', spot)
        const reviews = await Review.findAll({
            where: {
                spotId: spot.id
            },
            attributes: {
                include: [
                    [
                        sequelize.fn("AVG", sequelize.col("stars")), "avgRating"
                    ]
                ]
            }
        })
        // console.log('reviews ------>', reviews)
        let reviewList = [];
        reviews.forEach(review => {
            reviewList.push(review.toJSON())
        })
        // console.log('reviewList ------>', reviewList)
        reviewList.forEach(review => {
            if (review.spotId === spot.id) {
                spot.avgRating = review.avgRating
            }
        })
        const spotImages = await SpotImage.findAll({
            where: {
                spotId: spot.id,
                preview: true
            },
            attributes: ['id', 'url']
        })
        // console.log('spotImages ------------>', spotImages)
        let spotImageList = [];
        spotImages.forEach(img => {
            spotImageList.push(img.toJSON())
        })
        // console.log('spotImageList ------------>', spotImageList)
        spotImageList.forEach(img => {
            if (img.id === spot.id) {
                spot.previewImage = img.url;
            }
        })
        spotList.push(spot)
    }
    return res.json({
        spots: spotList
    })
})

// //2
// router.get('/', async (req, res) => {
//     const spots = await Spot.findAll(
//         {
//         include: [
//             {
//                 model: Review,
//                 attributes: {
//                     include: [
//                         [
//                             sequelize.fn("AVG", sequelize.col("stars")), "avgRating"
//                         ]
//                     ]
//                 }
//             },
//             { model: SpotImage }
//         ]
//     }
//     )
//     // console.log('spots ------------->', spots)
//     let spotList = [];

//     spots.forEach(spot => {
//         spotList.push(spot.toJSON())
//     })

//     spotList.forEach(spot => {
//         // console.log(spot.Reviews)
//         spot.Reviews.forEach(review => {
//             // console.log('avgRating --------->', review.avgRating)
//             spot.avgRating = review.avgRating
//         })
//         // console.log('spotImages ----->', spot.SpotImages)
//         spot.SpotImages.forEach(spotImg => {
//             // console.log('spotImg.preview ----->', spotImg.preview)
//             // console.log('spotImg.url ----->', spotImg.url)
//             if (spotImg.preview === true) {
//                 spot.previewImage = spotImg.url
//             }
//         })
//         if (!spot.previewImage) {
//             spot.previewImage = 'No preview available'
//         }
//     })

//     return res.json({
//         spots: spotList
//     })
// })



// Get all Spots owned by the Current User
router.get('/current', requireAuth, async (req, res) => {
    const ownerId = req.user.id
    console.log('ownerId--------->', ownerId)
    const spots = await Spot.findAll({
        where: {
            ownerId: ownerId
        }
    })
    console.log(spots)

    const spotList = [];
    spots.forEach(spot => {
        spot = spot.toJSON();
        console.log('spot --------->', spot)

        spotList.push(spot)
    })
    return res.json({
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

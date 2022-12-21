const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, SpotImage, Review, ReviewImage, Booking, sequelize } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// Get all spots
router.get('/', async (req, res) => {
    const spots = await Spot.findAll()
    // console.log('spots ------>', spots)
    const reviews = await Review.findAll({
        attributes: {
            include: [
                [
                    sequelize.fn("AVG", sequelize.col("stars")), "avgRating"
                ]
            ]
        },
    })
    const spotImages = await SpotImage.findAll()
    const imgList = [];
    spotImages.forEach(img => {
        imgList.push(img.toJSON())
    })
    // console.log('imgList ===', imgList)
    const reviewList = [];
    reviews.forEach(review => {
        reviewList.push(review.toJSON())
    })
    let avgRating = reviewList[0].avgRating
    // console.log('avgRating is =====', avgRating)

    let spotList = [];
    spots.forEach(spot => {
        spotList.push(spot.toJSON())
    })
    // console.log('spotList --------------', spotList)
    spotList.forEach(spot => {
        // console.log(spot)
        spot.avgRating = avgRating
        for (let img of imgList) {
            if (img.spotId === spot.id) {
                spot.previewImage = img.url
            }
        }
    })

    return res.json({
        spots: spotList
    })
})





module.exports = router;

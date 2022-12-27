const express = require('express');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Spot, SpotImage, Review, ReviewImage, Booking, sequelize } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// GET all reviews of the current user
router.get('/current', requireAuth, async (req, res) => {
    const userId = req.user.id
    // console.log('userId -----> ', userId)
    const reviews = await Review.findAll({
        where: {
            userId
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
    });
    // console.log('Reviews ---------> ', reviews)
    const reviewList = [];
    for (let review of reviews) {
        reviewList.push(review.toJSON())
    }
    // console.log('reviewList ---------> ', reviewList)
    for (let review of reviewList) {
        let spot = await Spot.findOne({
            where: {
                id: review.spotId
            },
            include: [
                {
                    model: SpotImage,
                    attributes: []
                }
            ],
            attributes: {
                include: [[sequelize.col("SpotImages.url"), "previewImage"]],
                exclude: ['description', 'createdAt', 'updatedAt']
            }
        })
        spot = spot.toJSON()
        // console.log('spot ---------> ', spot)
        review.Spot = spot
    }

    return res.json({
        Reviews: reviewList
    })
})







module.exports = router;

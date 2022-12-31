const express = require('express');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Spot, SpotImage, Review, ReviewImage, Booking, sequelize } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { route } = require('./spots');

const router = express.Router();

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
    res.statusCode = 200;
    return res.json({
        Reviews: reviewList
    })
})

// Add an Image to a Review based on the Review's id
router.post('/:reviewId/images', requireAuth, async (req, res) => {
    const reviewId = req.params.reviewId;
    const { url } = req.body;
    const currentUser = req.user;

    const review = await Review.findByPk(reviewId)
    console.log('review --------> ', review)
    // console.log('currentUser ID ------>', currentUser.id) //5

    // Check if review exist
    if (!review) {
        res.statusCode = 404;
        return res.json({
            message: "Review couldn't be found",
            statusCode: 404
        })
    }
    // Authorization Check
    if (currentUser.id !== review.userId) {
        res.statusCode = 403;
        return res.json({
            message: "Forbidden",
            statusCode: 403
        })
    }
    // Max 10 images per resource
    const reviewImages = await ReviewImage.findAll({
        where: {
            reviewId: reviewId
        }
    })
    // console.log('reviewImages Length ------->', reviewImages.length)
    if (reviewImages.length > 10) {
        res.statusCode = 403;
        return res.json({
            message: "Maximum number of images for this resource was reached",
            statusCode: 403
        })
    }
    // Success!!
    let newImage = await ReviewImage.create({
        reviewId,
        url
    })
    newImage = newImage.toJSON()
    delete newImage.reviewId;
    delete newImage.updatedAt;
    delete newImage.createdAt;
    // console.log('newImage =======>', newImage)
    res.statusCode = 200;
    return res.json(newImage)
})

// Edit a review
router.put('/:reviewId', [requireAuth, validateReviews], async (req, res) => {
    const reviewId = req.params.reviewId;
    const { review, stars } = req.body;
    const currentUser = req.user;
    const reviewtoEdit = await Review.findByPk(reviewId)
    // console.log('review to edit ------->', reviewtoEdit)

    // Check if review exist
    if (!reviewtoEdit) {
        res.status = 404;
        return res.json({
            message:  "Review couldn't be found",
            statusCode: 404
        })
    }
    // Authorization check:
    if (currentUser.id !== reviewtoEdit.userId) {
        res.statusCode = 403;
            return res.json({
                message: "Forbidden",
                statusCode: 403
            })
    }

    // Success
    await reviewtoEdit.update({
        review,
        stars
    })

    return res.json(reviewtoEdit)
})

// DELETE a review
router.delete('/:reviewId', requireAuth, async (req, res) => {
    const reviewId = req.params.reviewId;
    const currentUser = req.user;
    const reviewtoDelete = await Review.findByPk(reviewId);

    if (!reviewtoDelete) {
        res.statusCode = 404;
        return res.json({
            message: "Review couldn't be found",
            statusCode: 404
        })
    }
    // Authorization check
    if (currentUser.id !== reviewtoDelete.userId) {
        res.statusCode = 403;
            return res.json({
                message: "Forbidden",
                statusCode: 403
            })
    }
    // Success
    await reviewtoDelete.destroy();
    res.statusCode = 200;
    return res.json({
        message: "Successfully deleted",
        statusCode: 200
    })
})


module.exports = router;

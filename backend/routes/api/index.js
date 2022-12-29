const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotsRouter = require('./spots.js');
const bookingsRouter = require('./bookings.js');
const reviewsRouter = require('./reviews.js');
const { restoreUser } = require("../../utils/auth.js");

const { User, Spot, SpotImage, Review, ReviewImage, Booking, sequelize } = require('../../db/models');
const { setTokenCookie, requireAuth } = require('../../utils/auth');

router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.use('/spots', spotsRouter);

router.use('/bookings', bookingsRouter);

router.use('/reviews', reviewsRouter);

router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

// DELETE a Spot Image:
router.delete('/spot-images/:imageId', requireAuth, async (req, res) => {
    const imageId = req.params.imageId;
    let imageToDelete = await SpotImage.findByPk(imageId);
    const currentUser = req.user;
    // console.log('image to delete ----->', imageToDelete)
    // console.log('current User------------>', currentUser)

    // Check if image exist
    if (imageToDelete) {
        // console.log('image to Delete spotId------>', imageToDelete.spotId)

        const spot = await Spot.findOne({
            where: {
                id: imageToDelete.spotId
            }
        })
        // console.log('spot.ownerId -------->', spot.ownerId)
        // console.log('current User Id --------->', currentUser.id)

        // Authorization check!
        if (spot.ownerId === currentUser.id) {
            await imageToDelete.destroy()
            res.statusCode = 200;
            return res.json({
                message: "Successfully deleted",
                statusCode: 200
            })
        } else {
            res.statusCode = 404;
            return res.json({
                message: "Image doesn't belong to the current user"
            })
        }
    } else {
        res.statusCode = 404;
        return res.json({
            message: "Spot Image couldn't be found",
            statusCode: 404
        })
    }

})

// DELETE a Review Image
router.delete('/review-images/:imageId', requireAuth, async (req, res) => {
    const imageId = req.params.imageId;
    const imageToDelete = await ReviewImage.findByPk(imageId);
    const currentUser = req.user;
    console.log('currenUser Id -------> ', currentUser.id)
    console.log('image to delete ------>', imageToDelete)

    if (imageToDelete) {
        const review = await Review.findOne({
            where: {
                id: imageToDelete.reviewId
            }
        })
        console.log('review userId =======>', review.userId) // 4
        // Authorization check
        if (review.userId === currentUser.id) {
            await imageToDelete.destroy();
            res.statusCode = 200;
            return res.json({
                message: "Successfully deleted",
                statusCode: 200
            })
        } else {
            res.statusCode = 404;
            return res.json({
                message: "Image doesn't belong to the current user"
            })
        }
    } else {
        res.statusCode = 404;
        return res.json({
            message: "Review Image couldn't be found",
            statusCode: 404
        })
    }
})





module.exports = router;

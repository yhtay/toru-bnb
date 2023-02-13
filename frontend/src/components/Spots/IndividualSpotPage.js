import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { useEffect } from "react";
import './IndividualSpotPage.css';
import noPreview from './images/noPreview.jpeg'
import EditSpotForm from "./EditSpot/EditSpotForm";
import { thunkGetSingleSpot, thunkGetSpots } from "../../store/spots";
import LoginFormModal from "../LoginFormModal";
import { thunkDeleteSpot } from "../../store/spots";


import OpenModalButton from "../OpenModalButton"
import { thunkDeleteReview, thunkGetReviewsBySpotId } from "../../store/reviews";
import AddSpotImageModal from "./AddSpotImage/AddSpotImage";
import CreateReviewModal from "../Reviews/CreateReviewModal";



export default function IndividualSpotPage () {

    const { spotId } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();

    const sessionUser = useSelector(state => state.session.user)


    const spot = useSelector(state => state.spots.singleSpot[spotId])


    const reviews = useSelector(state => state.reviews.spotReviews);

    const reviewsArray = Object.values(reviews)



    // To have the update on the page without having to refresh
    useEffect(() => {
        dispatch(thunkGetSingleSpot(spotId))
        dispatch(thunkGetReviewsBySpotId(spotId))
    }, [dispatch, spotId])

    if (!spot) return null;
    if (spot === {}) return null;
    if (!reviews) return null;
    console.log('spot.SpotImages: ', spot.SpotImages)



    const reviewsBySpotId = reviewsArray.filter(review => {
        return Number(review.spotId) === Number(spotId)
    })
    // console.log("reviewsBySpotId: ========>", reviewsBySpotId)
    // const avgRating = reviewsBySpotId.reduce(review)
    // const reviewCount = reviewsBySpotId.length

    const reviewToDeleteArr = reviewsBySpotId.filter(review => {
        return Number(sessionUser?.id) === Number(review.User?.id)
    })
    // console.log(" Review to DELETEARRRRRR =======>", reviewToDeleteArr)

    const [ reviewToDelete ] = reviewToDeleteArr
    // console.log("Review to delete ------>", reviewToDelete)

    // Delete Spot
    const onDeleteSpot = async (e) => {
        e.preventDefault()
        const spotToDelete = await dispatch(thunkDeleteSpot(spotId))
        .catch(async (res) => {
            const data = await res.json();
        })
        history.push('/')
    }

    // Delete Review
    const onDeleteReview = async (e) => {
        e.preventDefault()
        dispatch(thunkDeleteReview(reviewToDelete.id, sessionUser))
        dispatch(thunkGetSingleSpot(spotId))
    }

    return (
        <div className="individual-spot-page-container">
            <h3>{spot.name}</h3>
            <div className="individual-page-header-div">
                <div className='star-icon-and-reviews'>
                    <div className='start-icon-div'>
                        <i className="fa-solid fa-star"></i>
                    </div>
                    <div className="avgRating-div">
                    {spot.avgRating === null ? "No Reviews" : spot.avgRating}

                    </div>

                    <div className='city-state-country-div'>{spot.address}, {spot.city}, {spot.state}, {spot.country}</div>

                </div>
                <div className="edit-delete-button-div">
                    {/* <div>
                        {sessionUser && Number(sessionUser.id) === Number(spot.ownerId) &&
                            <OpenModalButton
                                className="button"
                                buttonText="Add Image"
                            // disabled={sessionUser.id == spot.ownerId ? false : true}
                            modalComponent={<AddSpotImageModal spot={spot} />}
                        />
                        }
                    </div> */}
                    <div>
                        {sessionUser && Number(sessionUser.id) === Number(spot.ownerId) &&
                            <OpenModalButton
                                className="button"
                                buttonText="Edit Spot"
                            // disabled={sessionUser.id == spot.ownerId ? false : true}
                            modalComponent={<EditSpotForm spot={spot} />}
                        />
                        }
                    </div>

                    <div>
                        {sessionUser && Number(sessionUser.id) === Number(spot.ownerId) &&
                            <button
                                id='button'
                                // disabled={Number(sessionUser.id) === Number(spot.ownerId) ? false : true}
                                onClick={onDeleteSpot}
                            >Delete</button>
                        }
                    </div>
                </div>
            </div>

            <div className="image-container">
                <div className="main-image-div">
                    <img
                        className="main-image"
                        src={`${spot.SpotImages[0].url}`}
                    />
                </div>
                <div className="no-image-placeholder">
                    <img
                        className="secondary-image-div"
                        src={noPreview}
                    />
                    <img
                        className="secondary-image-div"
                        src={noPreview}
                    />
                    <img
                        className="secondary-image-div"
                        src={noPreview}
                    />
                    <img
                        className="secondary-image-div"
                        src={noPreview}
                    />
                </div>
            </div>

            <div className='spot-information-container'>
                <div className="name-description-bed-div">
                    <h3 className='host-div'>Toru Hosted by {spot.Owner.firstName}</h3>
                    <div className="spotpage-description-div">{spot.description}</div>
                    <div>
                        <div className="bedroom-bed-bath">bedrooms · beds · baths</div>
                    </div>
                </div>
                <div>
                    <div className="price-div">{`$${spot.price} per night`}</div>
                </div>

            </div>

            <div className="reviews-container">

                <div className="comment-container-div">
                    <div className="avgRating-numReviews-write-review-div">
                        <div className='icon-avgReviews-reviewCount-div'>
                            <span><i className="fa-solid fa-star"></i></span>
                            <div className="avgRating-div">
                                {spot && spot.avgRating === null ? "No Reviews " : spot.avgRating}
                            </div>
                            <div>
                                {
                                    spot.numReviews
                                    ? (+spot.numReviews === 1
                                        ? ` · ${spot.numReviews} Review`
                                        : ` · ${spot.numReviews} Reviews`)
                                    :
                                    " · Be the first to leave a Review"
                                }
                            </div>
                        </div>
                        <div>
                            <div className="write-review-div">
                                {sessionUser && Number(sessionUser.id) !== Number(spot.ownerId) &&
                                    <OpenModalButton
                                        buttonText="Write Review"
                                        modalComponent={<CreateReviewModal spotId={spotId} />}
                                    />
                                }
                            </div>
                        </div>
                    </div>
                    <div className="review-box-container">
                        {
                            reviewsBySpotId.map(review => {
                                return (
                                    <div key={review.id} className="comment-box">
                                        <div className="comment-user-delete-button">
                                            <div className="comment-user-name">
                                                By {review.User.firstName}
                                            </div>
                                            <div>
                                                {sessionUser && Number(sessionUser.id) === Number(review.User.id) &&
                                                    <button
                                                        className="delete-review"
                                                        onClick={onDeleteReview}
                                                    > <i className="fa-solid fa-xmark fa-s"></i></button>
                                                }
                                            </div>
                                        </div>
                                        <div className="review-and-delete-button">
                                            <div>
                                                {review.review}
                                            </div>

                                        </div>
                                </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

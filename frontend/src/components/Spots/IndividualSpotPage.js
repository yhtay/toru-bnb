import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { useEffect } from "react";
import './IndividualSpotPage.css';
import noPreview from './images/noPreview.jpeg'
import EditSpotForm from "./EditSpot/EditSpotForm";
import { thunkGetSingleSpot, thunkGetSpots } from "../../store/spots";
import LoginFormModal from "../LoginFormModal";
import { thunkDeleteSpot } from "../../store/spots";


import OpenModalMenuItem from "../OpenModalButton"
import { thunkDeleteReview, thunkGetReviewsBySpotId } from "../../store/reviews";
import OpenModalButton from "../OpenModalButton";
import CreateReviewModal from "../Reviews/CreateReviewModal";



export default function IndividualSpotPage () {

    const { spotId } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    // const allSpotsObj = useSelector(state => state.spots);
    // console.log('SpotPage spotsObj: ', spotsObj)
    // const spotById = allSpotsObj[spotId]
    // console.log('SpotPage spotById: ', spotById)

    const sessionUser = useSelector(state => state.session.user)
    // console.log('sessionUser id: -------->', sessionUser.id)

    const spot = useSelector(state => state.spots.Spot)
    console.log('spot in Individual page: ---->', spot)

    const reviewsObj = useSelector(state => state.reviews);
    // console.log('spotpage reviewsobj ------>', reviewsObj)
    const reviews = Object.values(reviewsObj)
    // console.log('SpotPage reviews: ', reviews)


    // To have the update on the page without having to refresh
    useEffect(() => {
        // dispatch(thunkGetSpots())
        // // using thunkGetSingleSpot
        dispatch(thunkGetSingleSpot(spotId))
        // Dispatching Reviews
        dispatch(thunkGetReviewsBySpotId(spotId))
    }, [dispatch, spotId])

    const reviewsBySpotId = reviews.filter(review => {
        return Number(review.spotId) === Number(spotId)
    })
    console.log("reviewsBySpotId: ========>", reviewsBySpotId)

    // const avgRating = reviewsBySpotId.reduce(review)

    const reviewCount = reviewsBySpotId.length

    const reviewToDeleteArr = reviewsBySpotId.filter(review => {
        return Number(sessionUser?.id) === Number(review.User?.id)
    })
    // console.log(" Review to DELETEARRRRRR =======>", reviewToDeleteArr)

    const [ reviewToDelete ] = reviewToDeleteArr
    // console.log("Review to delete ------>", reviewToDelete)

    // Delete Spot
    const onDeleteSpot = (e) => {
        e.preventDefault()
        dispatch(thunkDeleteSpot(spotId))
        history.push('/')
    }

    // Delete Review
    const onDeleteReview = (e) => {
        e.preventDefault()
        dispatch(thunkDeleteReview(reviewToDelete.id, sessionUser))
        dispatch(thunkGetSingleSpot(spotId))
    }



    if (!spot) return null;
    return (
        <div className="individual-spot-page-container">
            <h3>{spot.description}</h3>
            <div className="individual-page-header-div">
                <div className='star-icon-and-reviews'>
                    <div className='start-icon-div'>
                        <i className="fa-solid fa-star"></i>
                    </div>
                    <div className="avgRating-div">
                    {spot.avgRating === null ? "No Reviews" : (spot.avgRating).toFixed(1)}

                    </div>

                    <div className='city-state-country-div'>{spot.city}, {spot.state}, {spot.country}</div>

                </div>
                <div className="edit-delete-button-div">
                    <div>
                    {sessionUser && Number(sessionUser.id) === Number(spot.ownerId) &&
                            <OpenModalMenuItem
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
                <div>
                    <h3 className='host-div'>Toru Hosted by {spot.Owner.firstName}</h3>
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
                                {spot && spot.avgRating === null ? "No Reviews " : (spot.avgRating).toFixed(1)}
                            </div>
                            <div>
                                {reviewCount ? ` · ${reviewCount} Reviews` : " · Be the first to leave a Review"}
                            </div>
                        </div>
                        <div>
                            <div className="write-review-div">
                                {sessionUser && Number(sessionUser.id) !== Number(spot.ownerId) &&
                                    <OpenModalMenuItem
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
                                                    > <i class="fa-solid fa-xmark fa-s"></i></button>
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

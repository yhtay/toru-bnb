import { useParams, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import './IndividualSpotPage.css';
import noPreview from './images/noPreview.jpeg'
import EditSpotForm from "./EditSpot/EditSpotForm";
import { thunkGetSpots } from "../../store/spots";
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
    const spotsObj = useSelector(state => state.spots);
    // console.log('SpotPage spotsObj: ', spotsObj)
    const spot = spotsObj[spotId]
    // console.log('SpotPage spot: ', spot)

    const reviewsObj = useSelector(state => state.reviews);
    // console.log('spotpage reviewsobj ------>', reviewsObj)
    const reviews = Object.values(reviewsObj)
    // console.log('SpotPage reviews: ', reviews)

    const reviewsBySpotId = reviews.filter(review => {
        return Number(review.spotId) === Number(spotId)
    })

    // console.log("reviewsBySpotId: ========>", reviewsBySpotId)

    // Check if user logged in
    const sessionUser = useSelector(state => state.session.user)
    // console.log('sessionUser id: -------->', sessionUser.id)

    // To have the update on the page without having to refresh
    useEffect(() => {
        dispatch(thunkGetSpots())
        // Dispatching Reviews
        dispatch(thunkGetReviewsBySpotId(spotId))

    }, [dispatch, spotId])

    const reviewToDeleteArr = reviewsBySpotId.filter(review => {
        return Number(sessionUser.id) === Number(review.User.id)
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
    }



    if (!spot) return null;
    return (
        <div className="individual-spot-page-container">
            <h3>{spot.description}</h3>
            <div className="individual-page-header-div">
                <div className='star-icon-and-reviews'>
                    <div className='start-icon-div'>
                        <i class="fa-solid fa-star"></i>
                    </div>
                    <div>
                    {spot.avgRating === "No reviews for this spot" ? "No Reviews" : spot.avgRating}
                    </div>

                    <div className={'city-state-country-div'}>{spot.city}, {spot.state}, {spot.country}</div>

                </div>
                <div className="edit-delete-button-div">
                    <div>
                    {sessionUser && Number(sessionUser.id) === Number(spot.ownerId) &&
                            <OpenModalMenuItem
                            buttonText="Edit Spot"
                            // disabled={sessionUser.id == spot.ownerId ? false : true}
                            modalComponent={<EditSpotForm spot={spot} />}
                        />
                        }
                    </div>

                    <div>
                        {sessionUser && Number(sessionUser.id) === Number(spot.ownerId) &&
                            <button
                                className='delete-button'
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
                        src={`${spot.previewImage}`}
                    />
                </div>
                <div>
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
            <div>
                <span>Comments</span>
                <div>
                    <div>
                        {sessionUser && Number(sessionUser.id) !== Number(spot.ownerId) &&
                            <OpenModalButton
                            buttonText="Write Review"
                            modalComponent={<CreateReviewModal spotId={spotId} />}
                        />
                        }
                    </div>

                </div>

                {
                    reviewsBySpotId.map(review => {
                        return (
                            <div key={review.id}>
                                <div>
                                    By {review.User.firstName}
                                </div>
                                <div>
                                    <div>
                                        {review.review}
                                    </div>
                                    <div>

                                    {sessionUser && Number(sessionUser.id) === Number(review.User.id) &&
                                        <button
                                        onClick={onDeleteReview}
                                        >Delete</button>
                                    }
                                    </div>
                                </div>
                        </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

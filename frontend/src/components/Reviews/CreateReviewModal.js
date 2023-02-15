import { useParams, useHistory } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { useState, useEffect } from "react"
import { useModal } from "../../context/Modal"
import { thunkCreateReview } from "../../store/reviews"
import { thunkGetSingleSpot, thunkGetSpots } from "../../store/spots"
import { thunkGetReviewsBySpotId } from "../../store/reviews"




export default function CreateReviewModal ({ spotId, reviewsArray, sessionUserId }) {

    const dispatch = useDispatch();
    const history = useHistory();

    // console.log('Create Review spotId: ------> ', spotId) // 1
    const sessionUser = useSelector(state => state.session.user)
    // console.log('sessionUser id: -------->', sessionUser.id) // 4
    const [review, setReview] = useState('');
    const [stars, setStars] = useState(0);
    const [errors, setErrors] = useState([]);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const { closeModal } = useModal();

    // console.log('reviewsArray in ReviewModal: ', reviewsArray)
    // console.log('sessionUserId in ReviewModa: ', sessionUserId)

    useEffect(() => {
        const newErrors = [];

        if (review.length > 100) newErrors.push("Please keep review under 100 characters");
        if (Number(stars) <= 0 || Number(stars) > 5) newErrors.push("Ratings must be between 1 & 5");
        reviewsArray.forEach(review => {
            if (review.userId === sessionUserId) newErrors.push("User already has a review for this spot")
        })

        setErrors(newErrors)

    }, [review, stars])

    const onSubmit = async (e) => {
        e.preventDefault();
        console.log('review Errors: ', errors)

        setHasSubmitted(true);

        if (errors.length > 0) return

        const payload = {
            review,
            stars
        }
        console.log('payload in Review Modal: ', payload)


        await dispatch(thunkCreateReview(+spotId, payload, sessionUser))
            .then(()=>dispatch(thunkGetSingleSpot(+spotId)))
            // .then(dispatch(thunkGetReviewsBySpotId(spotId)))
            .then(()=>closeModal())
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors);
            })

        setHasSubmitted(false)

        }

    return (
        <form onSubmit={onSubmit} className="form">
            <h2>Leave A Review</h2>
            <ul>
                {hasSubmitted && errors.length > 0 && errors.map(error => (
                    <li key={error}>
                        {error}
                    </li>
                ))}
            </ul>
            <div>
                    <input
                        placeholder="Your Review"
                        type='text'
                        value={review}
                        onChange={e => setReview(e.target.value)}
                        required
                    />

            </div>
            <div>
                <span>Rating: </span>
                <input
                    type='number'
                    max={5}
                    min={1}
                    value={stars}
                    onChange={e => setStars(e.target.value)}
                    required
                />
            </div>
            <button
                className="form-button"
                type="submit"
            >Submit Review</button>
        </form>
    )
}

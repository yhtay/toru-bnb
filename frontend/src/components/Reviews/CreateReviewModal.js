import { useParams, useHistory } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { useState, useEffect } from "react"
import { useModal } from "../../context/Modal"
import { thunkCreateReview } from "../../store/reviews"
import { thunkGetSingleSpot, thunkGetSpots } from "../../store/spots"
import { thunkGetReviewsBySpotId } from "../../store/reviews"




export default function CreateReviewModal ({ spotId }) {

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

    // useEffect(() => {
    //     const newErrors = [];

    //     if (review.length > 200) newErrors.push("Please keep review under 20 characters")
    //     if (Number(stars) <= 0 || Number(stars) > 5) newErrors.push("Ratings must be between 1 & 5")

    //     setErrors(newErrors)

    // }, [review, stars])

    const onSubmit = async (e) => {
        e.preventDefault();
        setHasSubmitted(true);

        const payload = {
            review,
            stars
        }
        console.log('payload in Review Modal: ', payload)
        setHasSubmitted(false)

        await dispatch(thunkCreateReview(+spotId, payload, sessionUser))
            .then(()=>dispatch(thunkGetSingleSpot(+spotId)))
            // .then(dispatch(thunkGetReviewsBySpotId(spotId)))
            .then(()=>closeModal())
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors);
            })
        }

    return (
        <form onSubmit={onSubmit} className="form">
            <h2>Hit Leave A Review</h2>
            <ul>
                {errors.map(error => {
                    <li key={error}>
                        {error}
                    </li>
                })}
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

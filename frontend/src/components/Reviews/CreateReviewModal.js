import { useParams, useHistory } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { useState, useEffect } from "react"
import { useModal } from "../../context/Modal"
import { thunkCreateReview } from "../../store/reviews"




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

    useEffect(() => {
        const newErrors = [];

        if (review.length === 0) newErrors.push("Please leave a review!")
        if (review.length >= 150) newErrors.push("Please keep reviews under 150 characters")
        if (Number(stars) <= 0 || Number(stars) > 5) newErrors.push("Ratings must be between 1 & 5")

        setErrors(newErrors)



    }, [review, stars])

    const onSubmit = (e) => {
        e.preventDefault();
        setHasSubmitted(true);

        const payload = {
            review,
            stars
        }
        console.log('payload in Review Modal: ', payload)
        setHasSubmitted(false)

        // dispatch = (thunkCreateReview(spotId, payload))

        const newReview = dispatch(thunkCreateReview(spotId, payload, sessionUser))
            .then( () => {history.push(`/spots/${spotId}`)},closeModal())
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors);
            })
        }


    return (
        <form onSubmit={onSubmit}>
            <h2>Hit Leave A Review</h2>
            <ul>
                {errors.map(error => {
                    <li key={error}>
                        {error}
                    </li>
                })}
            </ul>
            <div>
                <span>Write Your Review: </span>
                    <input
                        type='text'
                        value={review}
                        onChange={e => setReview(e.target.value)}
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
                />
            </div>
            <button
                type="submit"
            >Submit Review</button>
        </form>
    )
}

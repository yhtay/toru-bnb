import { useParams } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { useState, useEffect } from "react"
import { useModal } from "../../context/Modal"



export default function CreateReviewModal ({ spotId }) {

    // console.log('Create Review spotId: ------> ', spotId) // 1
    const sessionUser = useSelector(state => state.session.user)
    // console.log('sessionUser id: -------->', sessionUser.id) // 4
    const [review, setReview] = useState('');
    const [errors, setErrors] = useState([]);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const { closeModal } = useModal();

    useEffect(() => {
        const newErrors = [];

        if (review.length === 0) newErrors.push("Please leave a review!")
        if (review.length >= 150) newErrors.push("Please keep reviews under 150 characters")

        setErrors(newErrors)

    }, [review])

    // const onSubmit = (e) => {
    //     e.preventDefault();


    // }


    return (
        <form>
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
            <button>Submit Review</button>
        </form>
    )
}

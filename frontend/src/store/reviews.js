import { csrfFetch } from "./csrf";

// Constants
const GET_REVIEWS = 'reviews/GET_REVIEWS'

const CREATE_REVIEWS = 'reviews/CREATE_REVIEWS'

const DELETE_REVIEWS = 'reviews/DELETE'


// Action Reducers
export const getReviewsbySpotId = (reviews) => {
    return {
        type: GET_REVIEWS,
        reviews
    }
}

export const CREATE_REVIEW = (review) => {
    return {
        type: CREATE_REVIEWS,
        review
    }
}

export const deleteReviews = (review) => {
    return {
        type: DELETE_REVIEWS,
        review
    }
}

// Thunk Actions
export const thunkGetReviewsBySpotId = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`)

    if (response.ok) {
        const spotReviews = await response.json();
        // console.log('spotReviews: ---> ', spotReviews)
        dispatch(getReviewsbySpotId(spotReviews))
        return spotReviews
    }
}

// Initial State
const initialState = {}

// Reducer
export default function reviewsReducer(state = initialState, action) {
    const newState = { ...state }

    switch (action.type) {
        case GET_REVIEWS:
            // console.log('reviewReducer NEWSTATE: -------->', newState)
            // console.log('reviewsReducer action.reviews', action.reviews.Reviews)
            action.reviews.Reviews.forEach(review => {
                newState[review.id] = review
            })
            return newState
        default:
            return state
    }
}

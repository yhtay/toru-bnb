import { csrfFetch } from "./csrf";
import spotsReducer from "./spots";

// Constants:
const GET_CURRENT_USER_BOOKINGS = 'bookings/GET_CURRENT_USER_BOOKINGS'
const GET_BOOKINS_BY_SPOTID = 'bookings/GET_BOOKINS_BY_SPOTID'


// Action
export const getCurrentUserBookings = (bookings) => {
    return {
        type: GET_CURRENT_USER_BOOKINGS,
        bookings
    }
}

export const getBookingsBySpotId = (bookings) => {
    return {
        type: GET_BOOKINS_BY_SPOTID,
        bookings
    }
}


// Thunks
export const thunkGetCurrentUserBookings = () => async (dispatch) => {
    const response =  await csrfFetch('/api/bookings/current')

    if (response.ok) {
        const currentUserBookings = await response.json();
        dispatch(getCurrentUserBookings(currentUserBookings));
        return currentUserBookings
    }
}

export const thunkGetBookingsBySpotId = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/bookings`)

    if (response.ok) {
        const bookingsBySpotId = await response.json();
        console.log('bookingsBySpotId in thunk: ', bookingsBySpotId)
        dispatch(getBookingsBySpotId(bookingsBySpotId));
        return bookingsBySpotId
    }
}


const initialState = {
    userBookings: {},
    spotBookings: {}
}

const normalize = (bookings) => {
    const data = {};
    if (bookings) {

        bookings.Bookings.forEach(booking => data[booking.spotId] = booking)
        // console.log("data: ", data)
        return data
    }
}

export default function bookingsReducer(state = initialState, action) {
    switch(action.type) {
        case GET_CURRENT_USER_BOOKINGS: {
            const newState = { ...state }
            newState.userBookings = normalize(action.bookings)
            return newState;
        }
        case GET_BOOKINS_BY_SPOTID: {
            const newState = { ...state }
            console.log("action.bookings: ", action.bookings) //2 bookings
            newState.spotBookings = normalize(action.bookings)
            return newState;
        }
        default:
            return state;
    }
}

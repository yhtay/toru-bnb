import { csrfFetch } from "./csrf";
//Spots Reducer

// Constants
const GET_SPOTS = 'spots/GET_SPOTS';

const GET_SINGLE_SPOT = 'spots/GET_SINGLE_SPOT'
const GET_USER_SPOTS = 'spots/GET_USER_SPOTS'

const CREATE = 'spots/CREATE';


const EDIT_SPOT = 'spots/EDIT_SPOT';
const DELETE = 'spots/DELETE';



// Action Reducers
export const getSpots = (spots) => {
    return {
        type: GET_SPOTS,
        spots
    }
}
export const getSingleSpot = (spot) => {
    return {
        type: GET_SINGLE_SPOT,
        spot
    }
}

export const getUserSpots = (spots) => {
    return {
        type: GET_USER_SPOTS,
        spots
    }
}

const createSpot = (spot) => {
    return {
        type: CREATE,
        spot
    }
}



const editSpot = (spot) => {
    return {
        type: EDIT_SPOT,
        spot
    }
}

const deleteSpot = (spot) => {
    return {
        type: DELETE,
        spot
    }
}

// Thunk actions
export const thunkGetSpots = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots');

    if (response.ok) {
        const spots = await response.json()
        // console.log('thunkGetSpots ---> ', spots)
        dispatch(getSpots(spots))
        return spots
    }
}

export const thunkGetSingleSpot = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`)

    if (response.ok) {
        const spot = await response.json();
        dispatch(getSingleSpot(spot))
        return spot
    }
}

export const thunkGetUserSpots = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots/current');

    if (response.ok) {
        const userSpots = await response.json();
        // console.log('userSpots from thunkGetUserSpots: ', userSpots)
        dispatch(getUserSpots(userSpots))
        return userSpots;
    }
}

export const thunkCreateSpots = (payload, previewImage) => async (dispatch) => {

    const response = await csrfFetch('/api/spots', {
        method: "POST",
        headers: {"Content-Type": 'application/json'},
        body: JSON.stringify(payload)
    });
    if (response.ok) {
        const newSpot = await response.json()
        console.log("thunk newSpot: ", newSpot)

        const newSpotImage = {
            url: previewImage,
            preview: true
        }

        const response2 = await csrfFetch(`/api/spots/${newSpot.id}/images`, {
            method: "POST",
            headers: {"Content-Type": 'application/json'},
            body: JSON.stringify(newSpotImage)
        })

        if (response2.ok) {
            const newImage = await response2.json()
            console.log("thunk newImage: ", newImage)

            newSpot.previewImage = newImage.url

            dispatch(createSpot(newSpot))

            return newSpot
        }
    }
}

export const thunkEditSpot = (payload, spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: "PUT",
        headers: {"Content-Type": 'application/json'},
        body: JSON.stringify(payload)
    })

    if (response.ok) {
        const spot = await response.json()
        dispatch(editSpot(spot))
        return spot
    }
}

export const thunkDeleteSpot = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: "DELETE",
    })
    if (response.ok) {
        let spot = await response.json()
        dispatch(deleteSpot(parseInt(spotId)))
        return spot
    }
}

// Initial State
const initialState = {};

// Reducer
export default function spotsReducer(state = initialState, action) {

    switch (action.type) {
        case GET_SPOTS:
            const allSpotsState = { ...state }
            // console.log('action.spot.Spots: ----->', action.spots.Spots)
            action.spots.Spots.forEach(spot => {
                allSpotsState[spot.id] = spot
            })
            return allSpotsState;
        case GET_SINGLE_SPOT:
            const singleSpotState = { ...state }
            singleSpotState.Spot = action.spot
            return singleSpotState;
        case GET_USER_SPOTS:
            const userSpotsState = { ...state }
            // console.log('action.spot ---->', action.spots.Spots)
            action.spots.Spots.forEach(spot => {
                userSpotsState[spot.id] = spot
            })
            // console.log('Reducer newState: ', newState)
            return userSpotsState
        case CREATE:
            // console.log('CREATE in Reducer action.spot: ', action.spot)
            const createSpotState = { ...state }
            createSpotState[action.spot.id] = action.spot
            return createSpotState;
        case EDIT_SPOT:
            // console.log("EDIT_SPOT action.spot reducer: ", action.spot)
            const editSpotState = { ...state }
            const previewImage = state[action.spot.id].previewImage
            action.spot.previewImage = previewImage
            editSpotState[action.spot.id] = action.spot
            return editSpotState;
        case DELETE:
            const deleteSpotState = { ...state }
            delete deleteSpotState[action.spot]
            return deleteSpotState;

        default:
            return state;
    }
}

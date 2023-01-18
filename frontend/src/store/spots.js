import { csrfFetch } from "./csrf";
//Spots Reducer

// Constants
const GET_SPOTS = 'spots/GET_SPOTS';

const GET_USER_SPOTS = 'spots/GET_USER_SPOTS'

const CREATE = 'spots/CREATE';
const CREATE_SPOT_IMAGE = 'spots/CREAT_SPOT_IMAGE'

const EDIT_SPOT = 'spots/EDIT_SPOT';
const DELETE = 'spots/DELETE';



// Action Reducers
export const getSpots = (spots) => {
    return {
        type: GET_SPOTS,
        spots
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

const createSpotImage = (image) => {
    return {
        type: CREATE_SPOT_IMAGE,
        image
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

export const thunkGetUserSpots = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots/current');

    if (response.ok) {
        const userSpots = await response.json();
        // console.log('userSpots from thunkGetUserSpots: ', userSpots)
        dispatch(getUserSpots(userSpots))
        return userSpots;
    }
}


export const thunkCreateSpots = (payload) => async (dispatch) => {
    const response = await csrfFetch('/api/spots', {
        method: "POST",
        headers: {"Content-Type": 'application/json'},
        body: JSON.stringify(payload)
    });

    if (response.ok) {
        const newSpot = await response.json()
        // console.log("thunk newSpot: ", newSpot)
        dispatch(createSpot(newSpot))
        return newSpot
    }
}

export const thunkCreateSpotImage = (newSpotId, imageURL, preview) => async(dispatch) => {
    const response = await csrfFetch(`/api/spots/${newSpotId}}/images`, {
        method: "POST",
        headers: {"Content-Type": 'application/json'},
        body: JSON.stringify(imageURL, preview)
    })
    if (response.ok) {

        const newSpotImage = await response.json();
        // console.log('thunk CreateNewSpotImage: ', newSpotImage)
        dispatch(createSpotImage(newSpotImage))
        return newSpotImage
    }
}

// export const thunkCreateSpots = (payload) => async (dispatch) => {
//     const response = await csrfFetch('/api/spots', {
//         method: "POST",
//         headers: {"Content-Type": 'application/json'},
//         body: JSON.stringify(payload)
//     });

//     if (response.ok) {
//         const newSpot = await response.json()
//         // console.log("thunk newSpot: ", newSpot)
//         const newSpotId = newSpot.id
//         const response2 = await csrfFetch(`/api/spot-images/${newSpotId}`)

//         if (response2.ok) {
//             const newImage = await response2.json()
//             dispatch(createSpot(newSpot, newImage))

//             return (newSpot, newImage)
//         }
//     }
// }

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
        dispatch(deleteSpot(parseInt(spot.id)))
        return spot
    }
}

// Initial State
const initialState = {};

// Reducers
export default function spotsReducer(state = initialState, action) {
    let newState = { ...state }
    switch (action.type) {
        case GET_SPOTS:
            // console.log('action.spot.Spots: ----->', action.spots.Spots)
            action.spots.Spots.forEach(spot => {
                newState[spot.id] = spot
            })
            return newState;
        case GET_USER_SPOTS:
            // console.log('action.spot ---->', action.spots.Spots)
            action.spots.Spots.forEach(spot => {
                newState[spot.id] = spot
            })
            // console.log('Reducer newState: ', newState)
            return newState
        case CREATE:
            newState[action.spot.id] = action.spot
            return newState;
        case CREATE_SPOT_IMAGE:
            console.log('action.', action.image)
            return newState
        case EDIT_SPOT:
            // console.log("EDIT_SPOT action.spot reducer: ", action.spot)
            const previewImage = state[action.spot.id].previewImage
            action.spot.previewImage = previewImage
            newState[action.spot.id] = action.spot
            return newState;
        case DELETE:
            delete newState[action.spot.id]
            return newState;

        default:
            return state;
    }
}

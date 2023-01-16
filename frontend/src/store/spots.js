import { csrfFetch } from "./csrf";
//Spots Reducer

// Constants
const READ = 'spots/READ';
const CREATE = 'spots/CREATE';
const UPDATE = 'spots/UPDATE';
const DELETE = 'spots/DELETE';

// Action Reducers
export const readSpots = (spots) => {
    return {
        type: READ,
        spots
    }
}

const createSpot = (spot) => {
    return {
        type: CREATE,
        spot
    }
}

const updateSpot = (spot) => {
    return {
        type: UPDATE,
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
export const thunkReadSpots = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots');

    if (response.ok) {
        const spots = await response.json()
        // console.log('thunkReadSpots ---> ', spots)
        dispatch(readSpots(spots))
        return spots
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
        console.log("thunk newSpot: ", newSpot)
        dispatch(createSpot(newSpot))
        return newSpot
    }

}

// Initial State
const initialState = {};

// Reducers
export default function spotsReducer(state = initialState, action) {
    let newState = { ...state }
    switch (action.type) {
        case READ:
            // console.log('action.spot.Spots: ----->', action.spots.Spots)
            action.spots.Spots.forEach(spot => {
                newState[spot.id] = spot
            })
            return newState;
        case CREATE:
            newState[action.spot.id] = action.spot
            return newState;
        default:
            return state;
    }
}

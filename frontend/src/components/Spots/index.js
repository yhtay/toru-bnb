import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { thunkGetSpots } from '../../store/spots'
import SpotDetails from "./SpotDetails";
import './SpotDetails.css'


export default function Spot() {

    const dispatch = useDispatch();
    const spotsObj = useSelector(state => state.spots)
    const spots = Object.values(spotsObj)

    // console.log('spots from SpotsComponent: ', spots)

    useEffect(() => {
        dispatch(thunkGetSpots())
    }, [dispatch])

    // console.log('spotsObj: ', spotsObj)
    return (
        <div>
            <h1>HIT Spots!</h1>
            <div className="sportcard-container">
                    {
                        spots.map(spot => (
                            <SpotDetails key={spot.id} spot={spot} />
                        ))
                    }
            </div>
        </div>
    )
}

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { thunkGetSpots } from '../../store/spots'
import SpotDetails from "./SpotDetails";
import './SpotDetails.css'
import { Link } from "react-router-dom";


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
            <div className="sportcard-container">
                    {
                        spots.map(spot => (
                            <Link to={`/${spot.id}`} key={`${spot.id}`}>
                                <SpotDetails key={`${spot.id}`} spot={spot} />
                            </Link>
                        ))
                    }
            </div>
        </div>
    )
}

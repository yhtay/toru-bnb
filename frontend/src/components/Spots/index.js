import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { thunkGetSpots } from '../../store/spots'
import SpotDetails from "./SpotDetails";
import './SpotDetails.css'
import { Link } from "react-router-dom";


export default function Spot() {

    const dispatch = useDispatch();
    const spotsObj = useSelector(state => state.spots.allSpots)
    // console.log("spotsObj: ", spotsObj)
    const spots = Object.values(spotsObj)

    // const reviewsObj = useSelector(state => state.reviews)
    // console.log("Reviews in spot: ", reviewsObj)

    // console.log('spots from SpotsComponent: ', spots)

    useEffect(() => {
        dispatch(thunkGetSpots())
    }, [dispatch])


    return (
        <div>
            <div className="sportcard-container">
                    {
                        spots.map(spot => (
                            <Link to={`/spots/${spot.id}`} key={`${spot.id}`}>
                                <SpotDetails key={`${spot.id}`} spot={spot} />
                            </Link>
                        ))
                    }
            </div>
        </div>
    )
}

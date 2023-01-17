import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom";
import { thunkGetUserSpots } from "../../../store/spots";
import  "../SpotDetails.css";
import SpotDetails from "../SpotDetails";
import Spot from "..";

export default function UsersSpots() {

    const dispatch = useDispatch();
    const spotsObj = useSelector(state => state.spots);
    // console.log('UserSpots: ', spotsObj);
    const usersSpots = Object.values(spotsObj)
    console.log('UsersSpots: ', usersSpots)

    useEffect(() => {
        dispatch(thunkGetUserSpots())
    }, [dispatch])



    return (
        <div>
            <h2>Hit User's Spots</h2>
            <div className="sportcard-container">
                {
                    usersSpots.map(spot => (
                        <Link to={`/${spot.id}`} key={`${spot.id}`}>
                            <SpotDetails key={`${spot.id}`} spot={spot} />
                        </Link>
                    ))
                }
            </div>

        </div>
    )
}

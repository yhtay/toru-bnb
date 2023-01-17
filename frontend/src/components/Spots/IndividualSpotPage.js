import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import './IndividualSpotPage.css';
import noPreview from './images/noPreview.jpeg'
import EditSpotForm from "./EditSpot/EditSpotForm";
import { thunkGetSpots } from "../../store/spots";

import OpenModalMenuItem from "../OpenModalButton"



export default function IndividualSpotPage () {

    const { spotId } = useParams();
    const dispatch = useDispatch();
    const spotsObj = useSelector(state => state.spots);
    // console.log('SpotPage spotsObj: ', spotsObj)

    // To have the update on the page without having to refresh
    useEffect(() => {
        dispatch(thunkGetSpots())
    }, [dispatch])

    const spot = spotsObj[spotId]
    // console.log('SpotPage spot: ', spot)



    if (!spot) return null;
    return (
        <div className="individual-spot-page-container">
            <div>
                <div>{spot.description}</div>
                {/* <div>{spot.reviews}</div> */}
                <div>{spot.city}, {spot.state}, {spot.country}</div>

            </div>
            {/* <div>
                <Link to={`/${spot.id}/edit`} key={`${spot.id}`}>Edit Spot</Link>
            </div> */}
                <OpenModalMenuItem
                    // itemText="Edit Spot"
                    buttonText='Edit Spot'
                    modalComponent={<EditSpotForm spot={spot} />}
                />
            <div>

            </div>
            <div className="image-container">
                <div className="main-image-div">
                    <img
                        className="main-image"
                        src={`${spot.previewImage}`}
                    />
                </div>
                <div>
                    <img
                        className="secondary-image-div"
                        src={noPreview}
                    />
                    <img
                        className="secondary-image-div"
                        src={noPreview}
                    />
                    <img
                        className="secondary-image-div"
                        src={noPreview}
                    />
                    <img
                        className="secondary-image-div"
                        src={noPreview}
                    />
                </div>
            </div>
        </div>
    )
}

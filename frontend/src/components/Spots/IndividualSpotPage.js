import { useParams, Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import './IndividualSpotPage.css';
import noPreview from './images/noPreview.jpeg'
import EditSpotForm from "./EditSpot/EditSpotForm";
import { thunkGetSpots } from "../../store/spots";
import LoginFormModal from "../LoginFormModal";
import { thunkDeleteSpot } from "../../store/spots";


import OpenModalMenuItem from "../OpenModalButton"



export default function IndividualSpotPage () {

    const { spotId } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const spotsObj = useSelector(state => state.spots);
    // console.log('SpotPage spotsObj: ', spotsObj)

    // Check if user logged in
    const sessionUser = useSelector(state => state.session.user)

    // To have the update on the page without having to refresh
    useEffect(() => {
        dispatch(thunkGetSpots())
    }, [dispatch])

    const spot = spotsObj[spotId]
    // console.log('SpotPage spot: ', spot)

    // Delete
    const onDeleteSpot = (e) => {
        e.preventDefault()
        dispatch(thunkDeleteSpot(spot.id))

        history.push('/')

    }

    if (!spot) return null;
    return (
        <div className="individual-spot-page-container">
            <div>
                <div>{spot.description}</div>
                {/* <div>{spot.reviews}</div> */}
                <div>{spot.city}, {spot.state}, {spot.country}</div>
            </div>
            <div>
                {sessionUser ? (
                    <OpenModalMenuItem
                        buttonText="Edit Spot"
                        modalComponent={<EditSpotForm spot={spot} />}
                    />
                ) : (
                    <OpenModalMenuItem

                        buttonText="Edit Spot"
                        modalComponent={<LoginFormModal />}
                    />
                )}
            </div>
            <div>
                <button onClick={onDeleteSpot} >Delete</button>
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

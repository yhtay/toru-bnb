import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import './IndividualSpotPage.css';
import noPreview from './images/noPreview.jpeg'


export default function IndividualSpotPage () {

    const { spotId } = useParams();
    const spotsObj = useSelector(state => state.spots);
    // console.log('SpotPage spotsObj: ', spotsObj)

    const spot = spotsObj[spotId]
    console.log('SpotPage spot: ', spot)

    return (
        <div className="individual-spot-page-container">
            <div>
                <div>{spot.description}</div>
                {/* <div>{spot.reviews}</div> */}
                <div>{spot.city}, {spot.state}, {spot.country}</div>
    
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

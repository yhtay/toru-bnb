import { useDispatch } from "react-redux";
import './SpotDetails.css'


export default function SpotDetails({ spot }) {
    const dispatch = useDispatch();

    // console.log('spot from SpotDetails', spot)

    return (
        <div>
            {
            <div className="spotcard-div">
                <img
                    className="image-class"
                    src={`${spot.previewImage}`}
                />
                <div className="city-state">{spot.city}, {spot.state}</div>
                <div className="description-div">{spot.description}</div>
                <div className="price-div">${spot.price} night</div>
            </div>
            }
        </div>
    )

}

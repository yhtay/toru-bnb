import { useDispatch } from "react-redux";
import './SpotDetails.css'


export default function SpotDetails({ spot }) {
    const dispatch = useDispatch();

    // console.log('spot from SpotDetails', spot)

    if (!spot.previewImage) return null

    return (
        <div>
            {
            <div className="spotcard-div">
                <img
                    className="image-class"
                    src={`${spot.previewImage}`}
                />
                <div className="city-state-rating-div">
                    <div className="city-state">{spot.city}, {spot.state}</div>
                    <div className="star-icon-avg-rating">
                        <div><i class="fa-solid fa-star"></i></div>
                        <div>Avg</div>
                    </div>
                </div>
                <div className="description-div">{spot.description}</div>
                <div className="price-div">${spot.price} night</div>
            </div>
            }
        </div>
    )

}

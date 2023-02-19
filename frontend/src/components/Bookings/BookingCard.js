

export default function BookingCard({  booking, userId }) {

    console.log('booking in Card: ', booking)
    if (!booking.Spot.previewImage) return null;

    return(
        <>
            <h2>Hit BoookingCard</h2>
            {
            <div className="spotcard-div">
                <img
                    className="image-class"
                    src={`${booking.Spot.previewImage}`}
                />
                <div className="city-state-rating-div">
                    <div className="city-state">{booking.Spot.city}, {booking.Spot.state}</div>
                    {/* <div className="star-icon-avg-rating">
                        <div><i className="fa-solid fa-star"></i></div>
                        <div>{spot.avgRating === "No reviews for this spot" ? "No reviews" : spot.avgRating}</div>
                    </div> */}
                </div>
                <div className="description-div">{booking.Spot.description}</div>
                <div className="card-price-div">${booking.Spot.price} night</div>
                <div>
                    <button>Edit</button>
                    <button>Delete</button>
                </div>
            </div>
            }
        </>
    )
}

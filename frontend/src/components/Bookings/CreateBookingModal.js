import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetBookingsBySpotId } from "../../store/bookings";


export default function CreateBookingModal({ spotId }) {

    const dispatch = useDispatch();
    const bookings = useSelector(state => state.bookings.spotBookings);
    console.log('spot bookings: ', bookings)
    const currentDate = new Date()
    console.log("current Date: ", currentDate)

    const [startDate, setStartDate] = useState(currentDate);
    const [endDate, setEndDate] = useState(currentDate);

    useEffect(() => {
        dispatch(thunkGetBookingsBySpotId(spotId))
    }, [dispatch])

    if (!bookings) return null;


    return (
        <div className="form">
            <h1>Bookings in Progress! Don't JUDGE or GRADE!!!</h1>
            <div className="current-reservation-div">
                {bookings[spotId]
                    ? <div>
                        <span>Current Reservations: </span>
                            <div>Start Date: {bookings[spotId]?.startDate}</div>
                            <div>End Date: {bookings[spotId]?.endDate}</div>
                    </div>
                    : 'No Current Reservations'
                }

            </div>
            <div>
            <label for="start">Start date: </label>
                <input
                    type="date"
                    id="start"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                />
            </div>
            <div>
            <label for="end">End date: </label>
                <input
                    type="date"
                    id="end"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                />
            </div>
            <button>Make Reservation</button>
        </div>
    )
}

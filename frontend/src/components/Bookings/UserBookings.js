import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Link } from "react-router-dom";
import { thunkGetCurrentUserBookings } from "../../store/bookings"
import { thunkGetSpots } from "../../store/spots";
import BookingCard from "./BookingCard";



export default function UserBookings () {

    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user)

    const bookings = useSelector(state => state.bookings.userBookings)

    useEffect(() => {
        dispatch(thunkGetCurrentUserBookings())
    }, [dispatch])

    if (!bookings) return null;

    if (!user) return null;

    const bookingsArray = Object.values(bookings)
    if (bookingsArray.length === 0) return null;

    console.log('bookings in UserBookings: ', bookingsArray)


    return (
        <div>
            <h2>User Bookings Page</h2>
            <div>
                {
                    bookingsArray.map(booking => (
                        <>
                        <Link to={`/spots/${booking.Spot.id}`} key={`${booking.Spot.id}`}>
                            <BookingCard booking={booking} userId={user.id} />
                        </Link>
                        <button>Edit</button>
                        <button>Delete</button>
                        </>
                    ))
                }
            </div>
        </div>
    )
}

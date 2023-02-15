import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useModal } from "../../../context/Modal"
import { thunkEditSpot } from "../../../store/spots";
import { thunkGetSingleSpot } from "../../../store/spots";
import { useHistory, useParams } from "react-router-dom"



export default function EditSpotForm({ spot }) {
    // console.log('spot in EditSpotForm', spot)
    const dispatch = useDispatch();
    // const { spotId } = useParams();
    // const spotId = spot.id
    // const history = useHistory();

    const [address, setAddress] = useState(spot.address);
    const [city, setCity] = useState(spot.city);
    const [state, setState] = useState(spot.state);
    const [country, setCountry] = useState(spot.country);
    // const [lat, setLat] = useState(spot.lat);
    // const [lng, setLng] = useState(spot.lng);
    const [name, setName] = useState(spot.name);
    const [description, setDescription] = useState(spot.description);
    const [price, setPrice] = useState(spot.price);
    const [errors, setErrors] = useState([]);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const { closeModal } = useModal()

    useEffect(() => {
        const newErrors = [];
        if (address.length === 0) newErrors.push("Please Provide a valid address")
        if (!city) newErrors.push("Please enter a valid City")
        if (state.length < 2) newErrors.push("Please enter a valid State")
        if (!country) newErrors.push("Please enter a valid Country")
        // if (!lat) newErrors.push("Please enter valid lat")
        // if (!lng) newErrors.push("Please enter valid lng")
        if (!name) newErrors.push("Please enter your name")
        if (!description) newErrors.push("Please provie a description")
        if (price === 0) newErrors.push("Please provide a price")

        setErrors(newErrors)

    }, [address, city, state, country, name, description, price])



    const onSubmit = async (e) => {
        e.preventDefault()
        // console.log('newErrors onSubmit', errors)

        setHasSubmitted(true)
        if (errors.length > 0) return

        let lat;
        let lng;

        const payload = {
            address,
            city,
            state,
            country,
            lat: 50,
            lng: 50,
            name,
            description,
            price
        }

        const editedSpot = await dispatch(thunkEditSpot(payload, spot.id))
            .then(() => dispatch(thunkGetSingleSpot(spot.id)))
            .then(closeModal)
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors);
            })

        setHasSubmitted(false);
        // history.push(`/spots/${spot.id}`)
    }

    return (
        <form onSubmit={onSubmit} className="form">
            <h2>Edit Spot</h2>
            <ul>
                {hasSubmitted && errors.length > 0 && errors.map(error => (
                    <li key={error}>
                        {error}
                    </li>
                ))}
            </ul>
            <div className="form-input-divs">

                    <input
                        type='text'
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        required
                    />

            </div>
            <div className="form-input-divs">

                    <input
                        type='text'
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        required
                    />

            </div>
            <div className="form-input-divs">

                    <input
                        type='text'
                        value={state}
                        onChange={e => setState(e.target.value)}
                        required
                    />

            </div>
            <div className="form-input-divs">

                    <input
                        type='text'
                        value={country}
                        onChange={e => setCountry(e.target.value)}
                        required
                    />

            </div>
            {/* <div>

                    <input
                        type='number'
                        value={lat}
                        onChange={e => setLat(e.target.value)}
                        required
                    />

            </div>
            <div>

                    <input
                        type='number'
                        value={lng}
                        onChange={e => setLng(e.target.value)}
                        required
                    />

            </div> */}
            <div>

                    <input
                        type='text'
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                    />

            </div>
            <div>

                    <input
                        type='text'
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        required
                    />

            </div>
            <div>
                <div>Price: </div>
                    <input
                        type='number'
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        required
                    />

            </div>
            <button
                className="form-button"
                type="submit"
                // disabled={errors.length > 0 ? true : false}
            >Edit Spot</button>
        </form>
    )
}

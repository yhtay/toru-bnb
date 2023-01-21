import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
import { thunkCreateSpots } from "../../store/spots";
import { useModal } from "../../context/Modal";
// import { thunkCreateSpotImage } from "../../store/spots";


export default function CreateSpotModal () {

    const dispatch = useDispatch();
    const history = useHistory();
    const spotsObj = useSelector(state => state.spots)
    const spots = Object.values(spotsObj)
    // console.log('spotsObj from form: ', spotsObj)


    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    // const [lat, setLat] = useState(0);
    // const [lng, setLng] = useState(0);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(1);
    const [previewImage, setPreviewImage] = useState('');
    const [errors, setErrors] = useState([]);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const { closeModal } = useModal()

    useEffect(() => {
        const newErrors = [];
        if (address && address.length < 5) newErrors.push("Address should be more than 5 characters")
        if (city && city.length < 3) newErrors.push("City should be at least 3 characters")
        if (state && state.length < 2) newErrors.push("State should be at least 2 characters")
        if (country && country.length < 3) newErrors.push("Country should be at least 3 characters")
        // if (!lat) newErrors.push("Please enter valid lat")
        // if (!lng) newErrors.push("Please enter valid lng")
        if (name && name.length < 3) newErrors.push("Please enter your name, at least 3 characters")
        if (description && description.length >= 20) newErrors.push("Please keep the discription under 20 characters")
        if (price && price <= 0) newErrors.push("Price minimum $1!")

        setErrors(newErrors)
    }, [address, city, state, country, name, description, price])

    // To have the update on the page without having to refresh


    const onSubmit = async (e) => {
        e.preventDefault();

        let lat;
        let lng;

        setHasSubmitted(true)
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
        console.log("payload in Form: ", payload)

        setHasSubmitted(false)

        const newSpot = await dispatch(thunkCreateSpots(payload, previewImage))
            .then((newSpot) => {history.push(`/spots/${newSpot.id}`)}, closeModal())
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors);
            })
        // console.log('newSPOT in create SPOT MOdAL', newSpot)
    }

    return (
        <form onSubmit={onSubmit} className="form">
            <h2>Create A New Toru</h2>
            <ul>
                {errors.map((error, idx) => (
                    <li key={idx}>{error}</li>
                ))}
            </ul>
            <div className="form-input-divs">
                <input
                    placeholder="Address"
                    type='text'
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    required
                />
            </div>
            <div className="form-input-divs">
                <input
                    placeholder="City"
                    type='text'
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    required
                />
            </div>
            <div className="form-input-divs">
                <input
                    placeholder="State"
                    type='text'
                    value={state}
                    onChange={e => setState(e.target.value)}
                    required
                />
            </div>
            <div className="form-input-divs">
                <input
                    placeholder="Country"
                    type='text'
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    required
                />

            </div>
            {/* <div>
                <label>
                    Lat:
                    <input
                        type='number'
                        value={lat}
                        onChange={e => setLat(e.target.value)}
                        required
                    />
                </label>
            </div>
            <div>
                <label>
                    Lng:
                    <input
                        type='number'
                        value={lng}
                        onChange={e => setLng(e.target.value)}
                        required
                    />
                </label>
            </div> */}
            <div>
                <input
                    placeholder="Name"
                    type='text'
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                />
            </div>
            <div className="form-input-divs">
                <input
                    placeholder="Description"
                    type='text'
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    required
                />
            </div>
            <div className="form-input-divs">
                <div>Price: </div>
                    <input
                        placeholder="Price"
                        type='number'
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        required
                    />
            </div>
            <div className="form-input-divs">
                <input
                    placeholder="Image URL"
                    type='url'
                    value={previewImage}
                    onChange={e => setPreviewImage(e.target.value)}
                    required
                />
            </div>
            <button type="submit"
                className="form-button"
                // disabled={errors.length > 0 ? true : false}
            >Create new Spot</button>
        </form>
    )
}

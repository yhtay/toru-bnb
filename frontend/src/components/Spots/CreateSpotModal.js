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
        if (address.length === 0) newErrors.push("Street address is required")
        if (city.length === 0) newErrors.push("City is required")
        if (state.length < 2) newErrors.push("State should be at least 2 characters")
        if (country.length === 0) newErrors.push("Country is required")
        // if (!lat) newErrors.push("Please enter valid lat")
        // if (!lng) newErrors.push("Please enter valid lng")
        if (name.length === 0 || name.length > 50) newErrors.push("Valid Name must be less than 50 characters")
        if (description && description.length > 20) newErrors.push("Please keep the discription under 20 characters")
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

        await dispatch(thunkCreateSpots(payload, previewImage))
            .then((newSpot) => {history.push(`/spots/${newSpot.id}`)})
            .then(closeModal)
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors);
            })
        setHasSubmitted(false)
        // console.log('newSPOT in create SPOT MOdAL', newSpot)
    }

    return (
        <form onSubmit={onSubmit} className="form">
            <h2>Create A New Toru</h2>
            <div>
                <ul>
                    {hasSubmitted && errors.length > 0 &&
                        errors.map((error, idx) => (
                            <li key={idx}>{error}</li>
                    ))}
                </ul>

            </div>
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
                        min={1}
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
                disabled={errors.length > 0 ? true : false}
            >Create new Spot</button>
        </form>
    )
}

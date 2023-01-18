import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
import { thunkCreateSpots } from "../../store/spots";
import { useModal } from "../../context/Modal";
// import { thunkCreateSpotImage } from "../../store/spots";
import { thunkGetSpots } from "../../store/spots";

export default function CreateSpotModal() {

    const dispatch = useDispatch();
    const history = useHistory();
    const spotsObj = useSelector(state => state.spots)
    const spots = Object.values(spotsObj)
    // console.log('spotsObj from form: ', spotsObj)

    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [lat, setLat] = useState(0);
    const [lng, setLng] = useState(0);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [previewImage, setPreviewImage] = useState('');
    const [errors, setErrors] = useState([]);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const { closeModal } = useModal()

    useEffect(() => {
        const newErrors = [];
        if (address.length < 3) newErrors.push("Please Provide a valid address")
        if (city.length < 3) newErrors.push("Please enter a valid City")
        if (state.length < 3) newErrors.push("Please enter a valid State")
        if (country.length < 3) newErrors.push("Please enter a valid Country")
        if (!lat) newErrors.push("Please enter valid lat")
        if (!lng) newErrors.push("Please enter valid lng")
        if (name.length < 3) newErrors.push("Please enter your name")
        if (description.length < 3) newErrors.push("Please provie a description")
        if (price === 0) newErrors.push("Please provide a price")

        setErrors(newErrors)
    }, [address, city, state, country, lat, lng, name, description, price])

    // To have the update on the page without having to refresh


    const onSubmit = (e) => {
        e.preventDefault();

        setHasSubmitted(true)
        const payload = {
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        }
        console.log("payload in Form: ", payload)

        setHasSubmitted(false)

        return dispatch(thunkCreateSpots(payload, previewImage))
            .then(closeModal)
            .catch(async (res) => {
                console.log('response: ', res)
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors);
            })
            history.push('/${spot')
    }

    return (
        <form onSubmit={onSubmit}>
            <h2>Create A New Toru</h2>
            <ul>
                {hasSubmitted && errors.map(error => (
                    <li key={error}>
                        {error}
                    </li>
                ))}
            </ul>
            <div>
                <label>
                    Address:
                    <input
                        type='text'
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                    />
                </label>
            </div>
            <div>
                <label>
                    City:
                    <input
                        type='text'
                        value={city}
                        onChange={e => setCity(e.target.value)}
                    />
                </label>
            </div>
            <div>
                <label>
                    State:
                    <input
                        type='text'
                        value={state}
                        onChange={e => setState(e.target.value)}
                    />
                </label>
            </div>
            <div>
                <label>
                    Country:
                    <input
                        type='text'
                        value={country}
                        onChange={e => setCountry(e.target.value)}
                    />
                </label>
            </div>
            <div>
                <label>
                    Lat:
                    <input
                        type='number'
                        value={lat}
                        onChange={e => setLat(e.target.value)}
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
                    />
                </label>
            </div>
            <div>
                <label>
                    Name:
                    <input
                        type='text'
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                </label>
            </div>
            <div>
                <label>
                    Description:
                    <input
                        type='text'
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                </label>
            </div>
            <div>
                <label>
                    Price:
                    <input
                        type='number'
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                    />
                </label>
            </div>
            <div>
                <label>
                    Image URL:
                    <input
                        type='text'
                        value={previewImage}
                        onChange={e => setPreviewImage(e.target.value)}
                    />
                </label>
            </div>
            <button type="submit"
                disabled={errors.length > 0 ? true : false}
            >Create new Spot</button>
        </form>
    )
}

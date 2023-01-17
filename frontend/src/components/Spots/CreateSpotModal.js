import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
import { thunkCreateSpots } from "../../store/spots";
import { useModal } from "../../context/Modal";

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
    const [errors, setErrors] = useState([]);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const { closeModal } = useModal()

    useEffect(() => {
        const newErrors = [];
        if (address.length < 5) newErrors.push("Please Provide a valid address")
        if (!city) newErrors.push("Please enter a valid City")
        if (!state) newErrors.push("Please enter a valid State")
        if (!country) newErrors.push("Please enter a valid Country")
        if (!lat) newErrors.push("Please enter valid lat")
        if (!lng) newErrors.push("Please enter valid lng")
        if (!name) newErrors.push("Please enter your name")
        if (!description) newErrors.push("Please provie a description")
        if (price === 0) newErrors.push("Please provide a price")

        setErrors(newErrors)
    }, [address, city, state, country, lat, lng, name, description, price, spots])

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

        return dispatch(thunkCreateSpots(payload))
            .then(closeModal)
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors);
            })
    }

    return (
        <form onSubmit={onSubmit}>
            <h2>Hit Spot Form!</h2>
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
            <button type="submit"
                disabled={errors.length > 0 ? true : false}
            >Create new Spot</button>
        </form>
    )
}
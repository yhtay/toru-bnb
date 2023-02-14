import { useState } from "react";
import { useDispatch } from "react-redux";
import { thunkAddSpotImage, thunkGetSingleSpot } from "../../../store/spots";
import { useModal } from "../../../context/Modal";


export default function AddSpotImageModal ({ spot }) {

    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const [imageUrl, setImageUrl] = useState('');
    const [errors, setErrors] = useState([])

    console.log("spotImage Modal spot: ", spot)

    const onSubmit = async (e) => {

        e.preventDefault()



        await dispatch(thunkAddSpotImage(+spot.id, imageUrl, true))
            // .then(() => dispatch(thunkGetSingleSpot(+spot.id)))
            .then(closeModal)
            .catch(async (res) => {
                console.log('res: ', res)
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors);
            })

    }

    return (
        <>
        <form className="form" onSubmit={onSubmit}>
            <h1>Add Image</h1>
            <div>
                <input
                    placeholder="Image URL"
                    type='url'
                    value={imageUrl}
                    onChange={e => setImageUrl(e.target.value)}
                    required
                />
            </div>
            <button
                type="submit"
                className="form-button"
            >Submit Image</button>
        </form>
        </>
    );
}

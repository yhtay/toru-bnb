import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { thunkAddSpotImage, thunkGetSingleSpot } from "../../../store/spots";
import { useModal } from "../../../context/Modal";


export default function AddSpotImageModal ({ spotImages, spot }) {

    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const [imageUrl, setImageUrl] = useState('');
    const [errors, setErrors] = useState([]);
    const [hasSubmitted, setHasSubmitted] = useState(false);


    // console.log("spotImage Modal spot: ", spot)
    // console.log('spotImages: ', spotImages)
    useEffect(() => {
        const newErrors = [];

        const urlWithHttp = imageUrl.startsWith('http://')
        const urlWithHttps = imageUrl.startsWith('https://')

        const urlWithJpg = imageUrl.endsWith('.jpg')
        const urlWithGif = imageUrl.endsWith('.gif')
        const urlWithPng = imageUrl.endsWith('.png')

        if (!urlWithHttp && !urlWithHttps) newErrors.push('Invalid image URL')
        if (!urlWithJpg && !urlWithGif && !urlWithPng) newErrors.push('Invalid image URL')

        if (spotImages.length >= 5) newErrors.push("Max 5 images allowed")

        // if (splitByPng.length === 1) newErrors.push("Invalid image URL")
        // else if (splitByGif.length === 1) newErrors.push("Invalid image URL")
        // else if (splitByPng.length === 1) newErrors.push("Invalid image URL")

        // for (let i = 0; i < newArray.length; i++) {
        //     if (newArray[i] === 2) {
        //         newErrors.push("Invalid image URL")
        //         break
        //     }
        // }
        // const validateImgUrl = newArray.find(el => el === 2)
        // console.log('validateImgUrl: ', validateImgUrl)
        // if (validateImgUrl) newErrors.push('Invalid image URL')
        // // const validateImgUrl = newArray.every(el => el === 2 )
        // if (!validateImgUrl) newErrors.push('Invalid image URL')

        setErrors(newErrors)

    },[spotImages, imageUrl])


    const onSubmit = async (e) => {

        e.preventDefault()

        setHasSubmitted(true);
        if (errors.length > 0) return;

        await dispatch(thunkAddSpotImage(+spot.id, imageUrl, false))
            // .then(() => dispatch(thunkGetSingleSpot(+spot.id)))
            .then(closeModal)
            .catch(async (res) => {
                console.log('res: ', res)
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors);
            })
        setHasSubmitted(false);
    }

    return (
        <>
        <form className="form" onSubmit={onSubmit}>
            <h1>Add Image</h1>
            <div>
                <ul>
                    {hasSubmitted && errors.length > 0 &&
                        errors.map((error, idx) => (
                            <li key={idx}>{error}</li>
                    ))}
                </ul>
            </div>
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

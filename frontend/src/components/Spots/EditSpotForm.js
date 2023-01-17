import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"


export default function EditSpotForm() {
    // const { spotId } = useParams()
    const { spotId } = useParams;
    console.log('spotId in EditSpotForm', spotId)


    return (
        <h2>Hit Edit Spot Form!</h2>

    )
}

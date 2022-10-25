import React from "react"
import { nanoid } from 'nanoid'

function Days(props) {
    const nextDays = props.days.map(day => (
        <div className='Weather__Days' key={nanoid()}>
            <p className="Weather__Days__Day">{day.day}</p>
            <p className="Weather__Days__Comment">{day.comment}</p>
            <p className="Weather__Days__MaxTemp"><span className="SmallTxt">Max: </span><span className="Accent--Bold">{day.max_temp.c}°C</span></p>
            <p className="Weather__Days__MinTemp"><span className="SmallTxt">Min: </span><span className="Accent--Bold">{day.min_temp.c}°C</span></p>
            <div className="Icon__Container">
                <img src={day.iconURL} className="Weather__Icon"></img>
            </div>
        </div>
    ))

    return (
        <div className="Weather__Days__Container">
            <h3 className="Weather__Days__Region">{props.region}</h3>
            {nextDays}
            <button 
                className='Btn Btn__Mode'
                onClick={() => props.setWeatherMode("today")}
            >
                Today
            </button>
        </div>  
    )
}

export default Days
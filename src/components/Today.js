import React from "react"

function Today(props) {

    return (
        <div className='Weather__Today__Container'>
          <h3 className="Weather__Today__Region">{props.region}</h3>
          <p className="Weather__Today__Time">{props.time}</p>
          <h2 className="Weather__Today__Temp">{props.temp}°C</h2>
          <p className="Weather__Today__Humid">Humidity: {props.humidity}</p>
          <p className="Weather__Today__Precip">Precipitations: {props.precip}</p>
          <p className="Weather__Today__Wind">Wind: {props.wind}km/h</p>
          <div className="Icon__Container">
            <img src={props.icon} className="Weather__Icon"></img>
          </div>
          <div className="Btn__Container">
            <button 
              className='Btn Btn__Mode'
              onClick={() => props.setWeatherMode("days")}
            >
              Next days
            </button>
          </div>
        </div>
    )
}

export default Today
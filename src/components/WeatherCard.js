import React, {useState, useEffect} from "react"
import Today from "./Today"
import Days from "./Days"

function WeatherCard(props) {
    const weatherDataURL = `https://weatherdbi.herokuapp.com/data/weather/${props.location}`
    const [weatherData, setWeatherData] = useState()
    const [weatherMode, setWeatherMode] = useState("today")

    useEffect(getWeatherData, [])

    function getWeatherData() {
        fetch(weatherDataURL)
            .then(res => res.json())
            .then(data => setWeatherData(data))
    }

    return (
        <div className="WeatherCard__Container">
            {weatherData ?
                (weatherData.region ?
                    (weatherMode === "today" ?
                    <Today
                        region={weatherData.region}
                        time={weatherData.currentConditions.dayhour}
                        temp={weatherData.currentConditions.temp.c}
                        humidity={weatherData.currentConditions.humidity}
                        precip={weatherData.currentConditions.precip}
                        wind={weatherData.currentConditions.wind.km}
                        icon={weatherData.currentConditions.iconURL}
                        setWeatherMode={setWeatherMode}
                    /> :

                    <Days
                        region={weatherData.region}
                        days={weatherData.next_days}
                        setWeatherMode={setWeatherMode}
                    />
                    ) :
                    <p className="Info Error">An error occured. Please refresh the page!</p>
                ) :
                <p className="Info Info__Loading">Loading...</p>
            }

            <button className="Btn Btn__Delete" onClick={() => {props.deleteCard(props.location)}}>Delete card</button>
        </div>
    )
}

export default WeatherCard
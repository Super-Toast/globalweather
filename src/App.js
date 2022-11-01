import './App.css';
import React, {useState, useEffect} from "react";
import WeatherCard from './components/WeatherCard';
import Today from './components/Today';
import Days from './components/Days';
import { nanoid } from 'nanoid';

function App() {

  const [weatherData, setWeatherData] = useState()
  const [city, setCity] = useState({city: ""})
  const [weatherMode, setWeatherMode] = useState("today")
  const [savedLocations, setSavedLocations] = useState(
    JSON.parse(localStorage.getItem("locations")) ?
    JSON.parse(localStorage.getItem("locations")) : 
    []
  )
  const [weatherCardsData, setWeatherCardsData] = useState(
    savedLocations.length > 0 ?
      savedLocations.map(location => <WeatherCard key={nanoid()} location={location} deleteCard={deleteCard}/>) :
      <p className='Info Info__Cards'>You don't have any saved cards. To save a card, search for a city, then press "Save location to cards"</p>
  )
  const [isVisible, setIsVisible] = useState(false)
  const [myLocation, setMyLocation] = useState("")

  function position(pos) {
    const locationCoords = `${pos.coords.latitude},${pos.coords.longitude}`
    setMyLocation(locationCoords)

    fetch(`https://weatherdbi.herokuapp.com/data/weather/${locationCoords}`)
      .then(res => res.json())
      .then(data => setWeatherData(data))
      .catch(err => setWeatherData(err))
    setIsVisible(true)
  }

  useEffect(() => {
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position)
    }    
  }, [])

  function getWeatherData() {
    fetch(`https://weatherdbi.herokuapp.com/data/weather/${city.city}`)
      .then(res => res.json())
      .then(data => setWeatherData(data))
      .catch(err => setWeatherData(err))
  }

  function getCity(event) {
    const {name, value} = event.target
    setCity({[name]: value})
  }

  function addToCards(location) {
    let savedLocationsCopy = [...savedLocations, location]
    savedLocationsCopy = [...new Set(savedLocationsCopy)]
    setSavedLocations([...savedLocationsCopy])
    setWeatherCardsData(savedLocationsCopy.map(location => <WeatherCard key={nanoid()} location={location} deleteCard={deleteCard}/>))
    localStorage.setItem("locations", JSON.stringify(savedLocationsCopy))
  }

  function deleteCard(location) {
    setSavedLocations(prevLocations => {
      let prevLocationsCopy = prevLocations
      prevLocationsCopy = prevLocationsCopy.filter(oldLocation => oldLocation !== location)
      setWeatherCardsData(prevLocationsCopy.length > 0 ?
        prevLocationsCopy.map(location => <WeatherCard key={nanoid()} location={location} deleteCard={deleteCard}/>) :
        <p className='Info Info__Cards'>You don't have any saved cards. To save a card, search for a city, then press "Save location to cards"</p>)
      
      localStorage.setItem("locations", JSON.stringify(prevLocationsCopy))
      return prevLocations.filter(oldLocation => oldLocation !== location)
    })

  }

  return (
    <div className='App__Container'>
      <h1 className='App__Container__Title'>GlobalWeather</h1>
      <div className='Search__Container'>
        <input
          className='Search__Container__Input'
          type="text" 
          name="city"
          id="city" 
          value={city.city} 
          placeholder="Enter city name"
          onChange={getCity}
        ></input>
        <button
          className='Btn Btn__Search' 
          onClick={() => {
            setWeatherData()
            getWeatherData()
            setIsVisible(true)
            setWeatherMode("today")
        }}>
          Search
        </button>
      </div>

      <div className='Searched__Location__Container'>
        {isVisible ? 
          (weatherData ?
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
              <p className='Info Error'>An error occured. Please try again and if the error persists try changing the search terms.</p>
            ) : 
            <p className='Info Info__Loading'>Loading...</p>
          ) : 
          <p className='Info Info__Search'>Location detection is not supported or is blocked. Please allow location detection or search manually for a location!</p>
        }

        {weatherData && weatherData.region && 
          <button 
            className='Btn Btn__Save'
            onClick={() => addToCards(city.city !== "" ? city.city : myLocation)}>
              Save location to cards
          </button>
        }
      </div>

      <h2 className='WeatherCards__Title'>My cards</h2>      
      {savedLocations.length > 0 && 
        <button 
          className='Btn Btn__Delete Btn__Delete__AllCards'
          onClick={() => {
            localStorage.removeItem("locations")
            setSavedLocations([])
            setWeatherCardsData(<p className='Info Info__Cards'>You don't have any saved cards. To save a card, search for a city, then press "Save location to cards"</p>)
        }}>
          Delete all cards
        </button>
      }
      <div className='WeatherCards__Container'>
        {weatherCardsData}
      </div>

    </div>
  );
}

export default App;
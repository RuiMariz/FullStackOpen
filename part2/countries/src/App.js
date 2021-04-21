import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = (props) => {
  return (
    <div>
      find countries<input value={props.countryFilter} onChange={props.handleCountryFilterChange} />
    </div>
  )
}

const Countries = (props) => {
  if (props.shownCountries.length >= 10)
    return <p>Too many matches, specify another filter</p>
  if (props.shownCountries.length > 1) {
    return (
      <div>
        {props.shownCountries.map((name, index) => {
          const country = props.countries.find((co) => co.name === props.shownCountries[index])
          return (
            <div key={name}>
              <p>{name}</p>
              <button onClick={() => props.handleOptionsChange(index)}>
                {props.showOptions[index] ? "hide" : "show"}
              </button>
              <OneCountry country={country} show={props.showOptions[index]} />
            </div>
          )
        }
        )}
      </div>
    )
  }
  if (props.shownCountries.length === 1) {
    const country = props.countries.find((co) => co.name === props.shownCountries[0])
    return (
      <div>
        <OneCountry country={country} show={true}
          weather={props.weather} setWeather={props.setWeather} />
        <h3>Weather in {country.capital}</h3>
        <Weather country={country} weather={props.weather} setWeather={props.setWeather} />
      </div>
    )
  }
  return <p>No countries match the filter</p>
}

const OneCountry = (props) => {
  if (!props.show)
    return null
  return (
    <div>
      <h2>
        {props.country.name}
      </h2>
      <p>capital {props.country.capital}</p>
      <p>population {props.country.population}</p>
      <h3>Languages</h3>
      <ul>
        {props.country.languages.map(language => <li key={language.name}>{language.name}</li>)}
      </ul>
      <img src={props.country.flag} alt={`Flag of ${props.country.name}`} width="150px"></img>
    </div>
  )
}

const Weather = (props) => {
  const [weather, setWeather] = useState({ temp: '', windSpeed: '', windDirection: '' })
  const capital = props.country.capital
  const api_key = process.env.REACT_APP_API_KEY
  useEffect(() => {
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=${api_key}`)
      .then(response => {
        setWeather({ temp: response.data.main.temp, windSpeed: response.data.wind.speed, windDirection: response.data.wind.deg })
      })
  }, [api_key, capital])

  return (
    <div>
      <p>Temperature: {weather.temp} ºC</p>
      <p>Wind: {weather.windSpeed} m/s, {weather.windDirection}º direction</p>
    </div>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [countryFilter, setCountryFilter] = useState('')
  const [shownCountries, setShownCountries] = useState([])
  const [showOptions, setShowOptions] = useState(new Array(10).fill(false))

  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleCountryFilterChange = (event) => {
    setCountryFilter(event.target.value)
    filterCountries(event.target.value)
    setShowOptions(new Array(10).fill(false))
  }

  const handleOptionsChange = (index) => {
    const copy = [...showOptions]
    copy[index] = !copy[index]
    setShowOptions(copy)
  }

  const filterCountries = (filter) => {
    filter = filter.toLowerCase()
    const names = countries.map(country => country.name)
    const filtered = names.filter((name) =>
      name.toLowerCase().includes(filter)
    )
    setShownCountries(filtered)
  }

  return (
    <div>
      <Filter countryFilter={countryFilter} handleCountryFilterChange={handleCountryFilterChange} />
      <Countries shownCountries={shownCountries} countries={countries} showOptions={showOptions} handleOptionsChange={handleOptionsChange} />
    </div>
  )
}

export default App


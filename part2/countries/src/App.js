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
      <ul>
        {props.shownCountries.map(country => <li key={country}>{country}</li>)}
      </ul>
    )
  }
  if (props.shownCountries.length === 1)
    return <OneCountry name={props.shownCountries[0]} countries={props.countries} />
  return <p>No countries match the filter</p>
}

const OneCountry = (props) => {
  const country = props.countries.find((co) => co.name === props.name)
  return (
    <div>
      <h2>
        {props.name}
      </h2>
      <p>capital {country.capital}</p>
      <p>population {country.population}</p>
      <h3>Languages</h3>
      <ul>
        {country.languages.map(language => <li key={language.name}>{language.name}</li>)}
      </ul>
      <img src={country.flag} alt={"Flag of ".concat(country.name)} width="150px"></img>
    </div>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [countryFilter, setCountryFilter] = useState('')
  const [shownCountries, setShownCountries] = useState([])

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
      <Countries shownCountries={shownCountries} countries={countries} />
    </div>
  )
}

export default App


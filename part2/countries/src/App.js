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
        {props.shownCountries.map((country, index) => {
          return (
            <div key={country}>
              <p>{country}</p>
              <button onClick={() => props.handleOptionsChange(index)}>
                {props.showOptions[index] ? "hide" : "show"}
              </button>
              <OneCountry name={country} countries={props.countries} show={props.showOptions[index]} />
            </div>
          )
        }
        )}
      </div>
    )
  }
  if (props.shownCountries.length === 1)
    return <OneCountry name={props.shownCountries[0]} countries={props.countries} show={true} />
  return <p>No countries match the filter</p>
}

const OneCountry = (props) => {
  if (!props.show)
    return null
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


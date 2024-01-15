import { useState,useEffect } from 'react'
import axios from 'axios'
const api_key = import.meta.env.VITE_SOME_KEY

const List_Country =({countries, showCountryDetails}) =>{
  if (countries.length == 1){ 
    return(
      <div>
        {countries.map(c => 
        <h1 key={c.name.common}>{c.name.common}</h1>
        )}
      </div>
    )
  }
  else{ 
    return(
      <div>
        {countries.map(c => 
        <div 
        key={c.name.common}>{c.name.common} 
        <button onClick={() => showCountryDetails(c.name.common)}>show</button>
        </div>
        )}
      </div>
    )
  }
  
}

const WeatherInfo = ({country}) =>{ 
  let lat =country[0].capitalInfo.latlng[0]
  let long =country[0].capitalInfo.latlng[1]

  const [temp, setTemp] = useState('')
  const [icon, setIcon] = useState('')
  const [windspeed, setWind] = useState('')
  // console.log(lat,long)
  // console.log(api_key)

  //gets the data
  useEffect(() =>{ 
    axios.get(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${long}&appid=${api_key}`)
    .then(response => { 
      setTemp(response.current.temp -273.15)
      setIcon(`https://openweathermap.org/img/wn/ ${response.current.weather[0].icon}.png`)
      setWind(response.current.wind_speed)
    })
  }, [])

  console.log(temp)
  return(
    <div>
        <b>Weather in {country[0].capital}</b>
        <p>temperature {temp} Celcius</p>
        <p>wind {windspeed} m/s</p>
        <img src ={icon} />
    </div>
  )
}

const CountryInfo =({countries}) =>{ 
  console.log(countries.length)
  if(countries.length == 1){
    let languages = Object.values(countries[0].languages)
    console.log(languages)
    return(
      <div>
        {countries.map(c =>
          <div key={c.name.official}>
            capital {c.capital} <br></br>
            area {c.area} <br></br><br></br>
            <b>languages: </b>
            <ul> 
              {languages.map(lang => 
                <li key ={lang}>{lang}</li>
              )}
            </ul>
            <img src ={c.flags.png} />
            <WeatherInfo country = {countries} />
          </div>
        )}
        
      </div>
    ) 
  }
}

const App = () => {
  const [country, setCountry] = useState("") 
  const [countries, setAllCountries] = useState([])
  const [flag, setFlag] = useState(false)
  const [filtered_countries, setFilteredCountries] = useState([])

  //retrieve countries from the server
  useEffect(()=>{ 
    axios 
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response =>{ 
        setAllCountries(response.data)
      })
  }, [])

  const showCountryDetails = (key) =>{ 
    const selected_country = filtered_countries.filter(c => c.name.common === key)
    setFilteredCountries(selected_country)
  }


  const countryText = (event) =>{
    const country = event.target.value
    if(country !== ""){
      setCountry(country)
      const fc = countries.filter(c => c.name.common.toLowerCase().includes(country.toLowerCase()))
      if (fc.length >10){ 
        setFlag(true)
        setFilteredCountries([])
      }
      else{
        setFlag(false) 
        setFilteredCountries(fc)
      }
    }
    else{ 
      setCountry("")
      setFlag(false)
      setFilteredCountries([])
    }
  }

  const results_text = flag ? "Too many matches, specify another filter" : ""

  return( 
    <div>
      find countries <input value ={country} onChange={countryText}/>
      <List_Country countries = {filtered_countries} showCountryDetails = {showCountryDetails}/>
      {results_text}
      <CountryInfo countries = {filtered_countries} />
    </div>
  )
}

export default App

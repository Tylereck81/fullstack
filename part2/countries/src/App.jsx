import { useState,useEffect } from 'react'
import axios from 'axios'
const api_key = import.meta.env.VITE_SOME_KEY

//French Polynesia 

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
  let capital =country[0].capital

  const [temp, setTemp] = useState('')
  const [icon, setIcon] = useState('')
  const [windspeed, setWind] = useState('')

  //gets the data 
  useEffect(() =>{ 
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&APPID=${api_key}`)
    .then(response=> {
      console.log(response)
      setTemp(Math.round(((response.data.main.temp -273.15)*100))/100)
      setIcon(`https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`)
      setWind(response.data.wind.speed)
    })
  }, [])

  console.log(temp)
  return(
    <div>
        <b>Weather in {capital}</b>
        <p>temperature {temp} Celcius</p>
        <img src ={icon} />
        <p>wind {windspeed} m/s</p>
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
            <img src ={c.flags.png}/>
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

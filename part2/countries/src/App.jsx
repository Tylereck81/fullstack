import { useState,useEffect } from 'react'
import axios from 'axios'

const List_Country =({countries}) =>{
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
        <div key={c.name.common}>{c.name.common}</div>
        )}
      </div>
    )
  }
  
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
                <li>{lang}</li>
              )}
            </ul>
            <img src ={c.flags.png} />
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
      <List_Country countries = {filtered_countries} />
      {results_text}
      <CountryInfo countries = {filtered_countries} />
    </div>
  )
}

export default App

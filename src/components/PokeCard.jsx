import React, { useEffect, useState } from 'react'
import { getPokedexNumber, getFullPokedexNumber } from '../utils'
import TypeCard from './TypeCard'


const PokeCard = (props) => {
  const { selectedPokemon } = props

  const [data, setData] =  useState(null) //
  const [loading, setLoading] = useState(false)
  // yeh bkc loading state kko true initialize kardiya galti se aur 30 min hogyye yahi soch rha tha fetch kyu nahi horha (╥﹏╥)
  // destructuring data elements from the data object
  const { name, id, height, weight, types, sprites } = data || {}

  // to prevent empty sprites -> filter
  const imgList = Object.keys(sprites || {}).filter(val => {
    if (!sprites[val]) { return false }
    if (['versions', 'other'].includes(val)) { return false }
    return true
})

  useEffect(() => {
    // if loading exit loop -> guard clause (check if localstorage exists)
    if(loading || !localStorage) {return}

    // define the cache
    let cache = {}
    if(localStorage.getItem('pokedex')) {
      cache = JSON.parse(localStorage.getItem('pokedex'))
    }

    // check if the selected pokemon info is available in cache
    if(selectedPokemon in cache){
      // cache mein hai toh vaha se lelo!
      setData(cache[selectedPokemon])
      console.log("pokemon found in cache")
      // setLoading(false)
      return
    }
    
    // now at this stage we know theres no info for that pokemon in cache so we need to fetch the data from the API
    async function fetchPokemonData() {
      setLoading(true)
      try {
        // fetch poke info
        const temp = getPokedexNumber(selectedPokemon)
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${temp}`)
        const pokemonData = await response.json()
        setData(pokemonData)

        // save in cache
        cache[selectedPokemon] = pokemonData
        localStorage.setItem('pokedex',JSON.stringify(cache))
        console.log(pokemonData)


      } catch (err) {
        console.log(err.message)
      } finally {
        setLoading(false)
      }
    }
    
    fetchPokemonData()
    
  }, [selectedPokemon])

  if(loading || !data) {
    return (
      <>
        <div className='poke-card'>
          <div>
            <h2>Loading...</h2>
          </div>
        </div> 
      </>
    )
  }

  return (
    <>
      <div className='poke-card'>
        <div>
          <h4>#{getFullPokedexNumber(selectedPokemon)}</h4>
          <h2>{name}</h2>
        </div>

          <div className='type-container'>
            {types.map((typeObj, typeIndex) => {
              return (
                <TypeCard key={typeIndex} type={typeObj?.type?.name} />
              )
            })}
          </div>
          <img className='default-img' src={'/pokemon/' + getFullPokedexNumber(selectedPokemon) + '.png'} alt={`${name}-large-img`} />
          <div className="img-container">
            
          </div>
      </div> 
    </>
  )
}

export default PokeCard
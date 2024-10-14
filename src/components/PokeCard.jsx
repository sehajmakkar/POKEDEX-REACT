import React, { useEffect, useState } from 'react'
import { getPokedexNumber, getFullPokedexNumber } from '../utils'
import TypeCard from './TypeCard'
import Modal from './Modal'


const PokeCard = (props) => {
  const { selectedPokemon, handleCloseModal } = props

  const [data, setData] =  useState(null) //
  const [loading, setLoading] = useState(false)
  // yeh bkc loading state kko true initialize kardiya galti se aur 30 min hogyye yahi soch rha tha fetch kyu nahi horha (╥﹏╥)
  // destructuring data elements from the data object
  const { name, height, abilities, stats, types, moves, sprites } = data || {}

  // to prevent empty sprites -> filter
  const imgList = Object.keys(sprites || {}).filter(val => {
    
    if (!sprites[val]) { return false } // empty
    if (['versions', 'other'].includes(val)) { return false } // filter versions and other
    return true // only the sprites we need

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
        {/* <Modal handleCloseModal={() => { }}>
          // anything we type here becomes the children component that is present in the modal
          <div>
            <h6>Name</h6>
            <h2></h2>
          </div>
          <div>
            <h6>Description</h6>
            <p></p>
          </div>

        </Modal> */}
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
            {imgList.map((spriteUrl, spriteIndex) => {
              const spritekey = sprites[spriteUrl]
              return (
                <img key={spriteIndex} src={spritekey} alt={`${name}-sprite-${spriteIndex}`} />
              )
            })}
          </div>

          <h3>Stats</h3>
          <div className="stats-card">
            {stats.map((statObj, statIndex) => {
              const { stat, base_stat } = statObj
              return (
                <div key={statIndex} className="stat-item">
                  <p>{stat?.name.replaceAll('-', ' ')}</p>
                  <h4>{base_stat}</h4>
                </div>
              )
            })}
          </div>

          <h3>Moves</h3>
          <div className="pokemon-move-grid">
            {moves.map((movesObj, movesIndex) => {
              return (
                <button key={movesIndex} className='button-card pokemon-move' onClick={() => {}}>
                  <p>{movesObj?.move?.name.replaceAll('-', ' ')}</p>
                </button>
              )
            })}
          </div>

      </div> 
    </>
  )
}

export default PokeCard
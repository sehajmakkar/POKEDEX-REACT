import React from 'react'
import { first151Pokemon, getFullPokedexNumber } from '../utils'

const SideNav = (props) => {

  const { selectedPokemon, setSelectedPokemon } = props

  return (
    <nav>
      <div className={"header"}>
        <h1 className='text-gradient'>Pookiedex</h1>
      </div>

      <input type="text" placeholder='Search' />


      {first151Pokemon.map((pokemon, pokemonindex) => {
        return (
          <button key={pokemonindex} className={'nav-card'}>
            <p>{getFullPokedexNumber(pokemonindex)}</p>
            <p>{pokemon}</p>
          </button>
        )
      })}
    </nav>
  )
}

export default SideNav
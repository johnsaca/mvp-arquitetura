export interface Pokemon {

  id: number;
  name: string;
  height: number;
  weight: number;
  type: string;
  imageUrl: string;
}
export async function getTop20Pokemon(): Promise<Pokemon[]> {
  const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20');
  const data = await response.json();

  const pokemonPromises = data.results.map(async (pokemon: { name: string }) => {
    const pokemonResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`,
    );
    const pokemonData = await pokemonResponse.json();

    const types = pokemonData.types.map(
      (typeSlot: { type: { name: string } }) => typeSlot.type.name,
    );
    const imageUrl =
      pokemonData.sprites.other['official-artwork'].front_default;

    return {
      id: pokemonData.id,
      name: pokemonData.name,
      height: pokemonData.height,
      weight: pokemonData.weight,
      type: types.join(', '),
      imageUrl,
    };
  });

  const pokemonList = await Promise.all(pokemonPromises);
  pokemonList.sort((a,b)=>{
    if(a.id > b.id)
      return 1;
    else return -1;
  })
  return pokemonList as Pokemon[];
}

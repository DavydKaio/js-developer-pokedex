const pokeApi = {};

function convertPokeApiDetailToPokemon(pokeDetail) {
  const pokemon = new Pokemon();
  pokemon.number = pokeDetail.id;
  pokemon.name = pokeDetail.name;

  const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name);
  const [type] = types;

  pokemon.types = types;
  pokemon.type = type;

  pokemon.photo = pokeDetail.sprites.other.dream_world.front_default;

  //   Extra informations
  const abilities = pokeDetail.abilities.map(
    (abilitySlot) => abilitySlot.ability.name
  );
  pokemon.abilities = abilities;
  pokemon.height = pokeDetail.height;
  pokemon.weight = pokeDetail.weight;

  let allStats = [];

  const stats = pokeDetail.stats.map((statSlot) => {
    allStats.push([statSlot.stat.name, statSlot.base_stat]);
  });
  pokemon.stats = allStats;

  pokemon.base_experience = pokeDetail.base_experience;

  return pokemon;
}

pokeApi.getPokemonDetail = (pokemon) => {
  return fetch(pokemon.url)
    .then((response) => response.json())
    .then(convertPokeApiDetailToPokemon);
};

pokeApi.getPokemons = (offset = 0, limit = 5) => {
  const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

  return fetch(url)
    .then((response) => response.json())
    .then((jsonBody) => jsonBody.results)
    .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
    .then((detailRequests) => Promise.all(detailRequests))
    .then((pokemonsDetails) => pokemonsDetails);
};

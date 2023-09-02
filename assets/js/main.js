const pokemonList = document.getElementById("pokemonList");
const loadMoreButton = document.getElementById("loadMoreButton");
const pokedexButton = document.getElementById("#pokedex-button");
const modal = document.getElementById("modal");

const maxRecords = 151;
const limit = 10;
let offset = 0;

let pokemonName;
let pokemonInfo;

function convertPokemonToLi(pokemon) {
  return `
        <button class="listButton">
            <li class="pokemon ${pokemon.type}">
                <span class="number">#${pokemon.number}</span>
                <span class="name">${pokemon.name}</span>

                <div class="detail">
                    <ol class="types">
                        ${pokemon.types
                          .map(
                            (type) => `<li class="type ${type}">${type}</li>`
                          )
                          .join("")}
                    </ol>

                    <img src="${pokemon.photo}"
                        alt="${pokemon.name}">
                </div>
            </li>
        </button>
        `;
}

function findPokemonName() {
  const listButton = document.getElementsByClassName("listButton");
  for (let i = 0; i < listButton.length; i++) {
    const element = listButton[i].addEventListener(
      "click",
      () => (
        (pokemonName = listButton[i].innerText.split("\n")[1]), getPokemonInfo()
      )
    );
  }
}

async function getPokemonInfo() {
  await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`)
    .then((pokemon) => pokemon.json())
    .then(convertPokeApiDetailToPokemon)
    .then((value) => insertModalContent(value));
}

function insertModalContent(pokemonInfo) {
  let info = `
  <div class="modal">
  <div class="modal_content ${pokemonInfo.type}">
    <div class="modal_header">
      <span class="modal_name">${pokemonInfo.name}</span>
      <span class="modal_number">#${pokemonInfo.number}</span>
      <button id="closeModal" type="button"><i class="gg-close"></i></button>

      <div class="detail">
        <ol class="types">
          ${pokemonInfo.types
            .map((type) => `<li class="type ${type}">${type}</li>`)
            .join("")}
        </ol>
      </div>
    </div>

    <div class="modal_details">
      <div class="modal_img_container">
        <img class="modal_img" src="${pokemonInfo.photo}" alt="${
    pokemonInfo.name
  }">
      </div>

      <div class="details_container">
        <div class="modal_charac_container">
          <div class="modal_charac_content">
            <span class="modal_title">Base XP</span>
            <span class="modal_title">Height</span>
            <span class="modal_title">Weight</span>
            
          </div>
          <div class="modal_charac_content">
            <span>${pokemonInfo.base_experience}</span>
            <span>${pokemonInfo.height}</span>
            <span>${pokemonInfo.weight}</span>

          </div>
          </div>
          <div class="modal_ability_container">
            <span class="modal_title">Abilities</span>
            <span>
            ${pokemonInfo.abilities
              .map(
                (ability) =>
                  `${ability}`.charAt(0).toUpperCase() + `${ability}`.slice(1)
              )
              .join(", ")}
          </span>
          </div>

        <span class="modal_separator"></span>

        <div class="stats_container">
          <div class="modal_stats">
            <span class="modal_title">HP</span>
            <span class="modal_title">Attack</span>
            <span class="modal_title">Defense</span>
            <span class="modal_title">SP Attack</span>
            <span class="modal_title">SP Defense</span>
            <span class="modal_title">Speed</span>
          </div>
          <div class="modal_stats_value">
              ${pokemonInfo.stats
                .map(
                  (stat) => `<span class="modal_stat_container">
                <span class="stat_value">${stat[1]}</span>
                <span class="stat_bar ${
                  stat[1] >= 50 ? "green" : "red"
                }"></span>
              </span>`
                )
                .join("")}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
        `;
  modal.innerHTML = info;

  modal.style.display = "block";

  const closeModal = document.getElementById("closeModal");
  closeModal.addEventListener("click", () => (modal.style.display = "none"));

  const values = document.getElementsByClassName("stat_value");
  const bars = document.getElementsByClassName("stat_bar");
  for (let i = 0; i < values.length; i++) {
    bars[i].style.width = values[i].textContent + "px";
  }
}

async function loadPokemonItens(offset, limit) {
  await pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
    const newHtml = pokemons.map(convertPokemonToLi).join("");
    pokemonList.innerHTML += newHtml;
  });

  findPokemonName();
}

loadPokemonItens(offset, limit);

loadMoreButton.addEventListener("click", () => {
  offset += limit;
  const qtdRecordsWithNexPage = offset + limit;

  if (qtdRecordsWithNexPage >= maxRecords) {
    const newLimit = maxRecords - offset;
    loadPokemonItens(offset, newLimit);

    loadMoreButton.parentElement.removeChild(loadMoreButton);
  } else {
    loadPokemonItens(offset, limit);
  }
});

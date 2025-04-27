let API_URL = "https://darkorange-cormorant-406076.hostingersite.com/group_page/crud_piadozo.php";

function submitUser() {
    let pokemonName = document.getElementById("pokemon_name").value;
    let pokemonType = document.getElementById("pokemon_type").value;
    let pokemonHp = document.getElementById("pokemon_hp").value;
    let pokemonDef = document.getElementById("pokemon_def").value;
    let pokemonAttack = document.getElementById("pokemon_attack").value;

    if (!pokemonName || !pokemonType || !pokemonHp || !pokemonDef
        || !pokemonAttack) {
        alert("Please fill in all fields before submitting!");
        return;
    }

    fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "name=" + encodeURIComponent(pokemonName) + "&" +
              "type=" + encodeURIComponent(pokemonType) + "&" +
              "hp=" + encodeURIComponent(pokemonHp) + "&" +
              "defense=" + encodeURIComponent(pokemonDef) + "&" +
              "attack=" + encodeURIComponent(pokemonAttack),
    })
    .then(response => response.text())
    .then(res => {
        alert(res);
        clearForm();
        loadPokemons();
    })
    .catch(error => {
        console.error("Error:", error);
    });
}

function loadPokemons() {
    fetch(API_URL)
        .then(response => response.json())
        .then(pokemons => {
            let tableBody = document.querySelector(".pokemon-table-body");
            tableBody.innerHTML = "";

            pokemons.forEach(pokemon => {
                let row = `
                    <tr>
                        <td>${pokemon.name}</td>
                        <td>${pokemon.type}</td>
                        <td>${pokemon.hp}</td>
                        <td>${pokemon.defense}</td>
                        <td>${pokemon.attack}</td>
                        <td>
                            <button class="edit-btn" onclick="editPokemon(
                                            '${pokemon.id}',
                                            '${pokemon.name}',
                                            '${pokemon.type}',
                                            '${pokemon.hp}',
                                            '${pokemon.defense}',
                                            '${pokemon.attack}')">
                                Edit</button>
                            <button class="delete-btn" onclick="deletePokemon(${pokemon.id})">Del</button>
                        </td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });
        })
        .catch(error => {
            console.error("Error loading pokemons:", error);
        });
}

function deletePokemon(id) {
    if (!id) {
        alert("Cannot delete: Invalid Pokemon ID");
        return;
    }

    if (!confirm("Are you sure you want to delete this pokemon?")) return;

    fetch(API_URL, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "id=" + encodeURIComponent(id),
    })
    .then(response => response.text())
    .then(res => {
        alert(res);
        loadPokemons();
    })
    .catch(error => {
        console.error("Error deleting pokemon:", error);
    });
}

function editPokemon(id, name, type, hp, defense, attack) {
    if (!id || !name || !type || !hp || !defense || !attack) {
        alert("Cannot edit: Missing Pokemon data");
        return;
    }

    document.getElementById("pokemon_id").value = id;
    document.getElementById("pokemon_name").value = name;
    document.getElementById("pokemon_type").value = type;
    document.getElementById("pokemon_hp").value = hp;
    document.getElementById("pokemon_def").value = defense;
    document.getElementById("pokemon_attack").value = attack;

    document.getElementById("add_btn").classList.add("hidden");
    document.getElementById("add_btn").classList.remove("visible");

    document.getElementById("update_btn").classList.remove("hidden");
    document.getElementById("update_btn").classList.add("visible");
}

function updateUser() {
    let id = document.getElementById("pokemon_id").value;
    let pokemonName = document.getElementById("pokemon_name").value;
    let pokemonType = document.getElementById("pokemon_type").value;
    let pokemonHp = document.getElementById("pokemon_hp").value;
    let pokemonDef = document.getElementById("pokemon_def").value;
    let pokemonAttack = document.getElementById("pokemon_attack").value;

    if (!id || !pokemonName || !pokemonType || !pokemonHp || !pokemonDef
        || !pokemonAttack) {
        alert("Please fill in all fields before updating!");
        return;
    }

    fetch(API_URL, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "id=" + encodeURIComponent(id) + "&" +
              "name=" + encodeURIComponent(pokemonName) + "&" +
              "type=" + encodeURIComponent(pokemonType) + "&" +
              "hp=" + encodeURIComponent(pokemonHp) + "&" +
              "defense=" + encodeURIComponent(pokemonDef) + "&" +
              "attack=" + encodeURIComponent(pokemonAttack),
    })
    .then(response => response.text())
    .then(res => {
        alert(res);
        clearForm();
        loadPokemons();
    })
    .catch(error => {
        console.error("Error updating pokemon:", error);
    });
}

function clearForm() {
    document.getElementById("pokemon_id").value = "";
    document.getElementById("pokemon_name").value = "";
    document.getElementById("pokemon_type").value = "";
    document.getElementById("pokemon_hp").value = "";
    document.getElementById("pokemon_def").value = "";
    document.getElementById("pokemon_attack").value = "";

    document.getElementById("add_btn").classList.remove("hidden");
    document.getElementById("add_btn").classList.add("visible");

    document.getElementById("update_btn").classList.add("hidden");
    document.getElementById("update_btn").classList.remove("visible");
}

window.onload = () => {
    loadPokemons();
};
let countryInput = document.getElementById("input_country");
let searchButton = document.getElementById("submit_button");
let countryContainer = document.getElementById("country_container");
let regionCountries = document.getElementById("region_countries");

countryContainer.classList.add("hidden");
regionCountries.classList.add("hidden");

searchButton.onclick = () => {
    searchCountry();
}

function searchCountry() {
    let countryName = countryInput.value.trim();

    if (!countryName) {
        alert("Please enter a country name");
        return;
    }

    countryContainer.classList.add("hidden");

    fetch(`https://restcountries.com/v3.1/name/${countryName}`)
        .then(response => response.json())
        .then(data => {
            let region = data[0].region;

            displayCountryInfo(data[0]);
            fetch(`https://restcountries.com/v3.1/region/${region}`)
                .then(response => response.json())
                .then(data => {
                    displayRegionCountries(data);
                });
        })
        .catch(error => {
            console.error("Error fetching country data:", error);
            alert("Country not found. Check the spelling and try again.");
        });
}

function displayCountryInfo(country) {
    document.getElementById("country_flag")
        .src = country.flags.svg || country.flags.png;
    document.getElementById("country_flag")
        .alt = `Flag of${country.name.common}`;
    document.getElementById("country_name")
        .textContent = country.name.common;
    document.getElementById("official_name")
        .textContent = country.name.official;

    const capitalElement = document.getElementById("capital");
    if (capitalElement) {
        capitalElement.textContent = country.capital ? 
                                     country.capital.join(', ') : 'N/A';
    }

    document.getElementById("region").textContent = country.subregion ?
                                    `${country.subregion} (${country.region})`
                                     : country.region;
    document.getElementById("population").textContent =
                                         country.population.toLocaleString();

    let languageText = "N/A";
    if (country.languages) {
        languageText = Object.values(country.languages).join(', ');
    }
    document.getElementById("language").textContent = languageText;

    let currencyText = "N/A";
    if (!country.currencies || Object.keys(!country.currencies).length) {
        return
    }else{
        let currencies = Object.values(country.currencies);
        currencyText = currencies.map(curr => `${curr.name}
                           (${curr.symbol || " "})`)
            .join(', ');
    }

    document.getElementById("currency").textContent = currencyText;
    countryContainer.classList.remove("hidden");
    countryContainer.classList.add("visible")
}

function displayRegionCountries(countries) {
    let region = countries[0].region;
    document.getElementById("region_title").textContent =
                                            `Countries in ${region}`;

    let countriesGrid = document.getElementById("countries_grid");
    countriesGrid.innerHTML = "";

    countries.sort((a,b) => a.name.common.localeCompare(b.name.common));

    let currentCountry = document.getElementById("country_name").textContent;

    countries.forEach(country => {
        if (country.name.common === currentCountry){
            return;
        }
        let countryElement = document.createElement("div");
        countryElement.className = "country-card";
        
        let countryName = document.createElement("p");
        countryName.textContent = country.name.common;
        countryElement.appendChild(countryName);

        countryElement.addEventListener("click", () => {
            countryInput.value = country.name.common;
            searchCountry();
        });
        countriesGrid.appendChild(countryElement);
    });

    regionCountries.classList.remove("hidden");
    regionCountries.classList.add("visible");

}
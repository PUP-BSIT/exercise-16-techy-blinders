let searchButton = document.getElementById("search_button");
let countryInput = document.getElementById("user_input");
let displayResult = document.getElementById("result");

searchButton.addEventListener("click", () => {
  let countryName = countryInput.value.trim();
  if (!countryName) {
    displayResult.innerHTML = `Please enter a country name.`;
    return;
  }

  let finalURL = `https://restcountries.com/v3.1/name/${countryName}`;
  fetch(finalURL)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Country not found");
      }
      return response.json();
    })
    .then((data) => {
      let country = data.find(c => c.name.common.toLowerCase() ===
        countryName.toLowerCase()) || data[0];
      let flag = country.flags.svg;
      let name = country.name.common;
      let capital = country.capital ? country.capital[0] : "N/A";
      let population = country.population.toLocaleString();
      let continent = country.continents[0];
      let region = country.region;
      let currency = "N/A";

      if (country.currencies) {
        const currencyCode = Object.keys(country.currencies)[0];
        currency = `${country.currencies[currencyCode].name} (${currencyCode})`;
      }

      let languages = "N/A";
      if (country.languages) {
        languages = Object.values(country.languages).toString().split(",")
          .join(", ");
      }

      displayResult.innerHTML = `
        <img id="flag" src="${flag}" alt="${name} flag">
        <h2>${name}</h2>
        <p><strong>Capital:</strong> ${capital}</p>
        <p><strong>Population:</strong> ${population}</p>
        <p><strong>Continent:</strong> ${continent}</p>
        <p><strong>Currency:</strong> ${currency}</p>
        <p><strong>Languages:</strong> ${languages}</p>
        <div class="region-section">
          <h3>Other Countries in ${region}</h3>
          <div id="region_countries" class="region-countries"></div>
        </div>`;

      let currentCountry = countryName.toLowerCase();

      return fetch(`https://restcountries.com/v3.1/region/${region}`)
        .then(response => {
          if (!response.ok) {
            throw new Error("Region data not available");
          }
          return response.json();
        })
        .then(regionData => {
          let regionContainer = document.getElementById("region_countries");
          regionData.sort((a, b) => a.name.common.localeCompare(b.name.common));

          let regionCountriesHTML = "";
          regionData.forEach(country => {
            if (country.name.common.toLowerCase() !== currentCountry) {
              regionCountriesHTML += `
                <div class="region-country" onclick="searchCountry('${country
                    .name.common}')">
                  <img src="${country.flags.svg}" alt="${country.name.common}"
                    class="small-flag">
                  <p>${country.name.common}</p>
                </div>`;
            }
          });

          regionContainer.innerHTML = regionCountriesHTML || `No other
            countries found in this region.`;
          return regionData; 
        })
        .catch(error => {
          console.error("Error fetching region data:", error);
          document.getElementById("region_countries").innerHTML = `<p>Failed to
            load region data: ${error.message}</p>`;
        });
    })
    .catch((error) => {
      console.error(error);
      displayResult.innerHTML = `Country not found. Please enter a valid
        country name.`;
    });
});

function searchCountry(countryName) {
  countryInput.value = countryName;
  searchButton.click();
  displayResult.scrollIntoView({ behavior: 'smooth' });
}

countryInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    searchButton.click();
  }
});
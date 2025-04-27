function searchCountry() {
    let searchInput = document.getElementById("search_input").value.trim();
    let resultDivision = document.getElementById("result_division");

    if (!searchInput) {
        let invalidInputMessage = `<p>Invalid Input.
                                   Enter a valid country name.</p>`;
        resultDivision.innerHTML = invalidInputMessage;
        return;
    }

    fetch(`https://restcountries.com/v3.1/name/${searchInput}`)
        .then(response => response.json())
        .then(data => {
            let country = data[0];
            let region = country.region;
            let flag = country.flags.png;

            let name = country.name.common;
            let population = country.population.toLocaleString();
            let area = country.area.toLocaleString() + ' km²';
            let capital = 'N/A';
                if (country.capital && country.capital.length) {
                    capital = country.capital[0];
                }

            let languages = 'N/A';
                if (country.languages) {
                    let languageList = Object.values(country.languages);
                    languages = languageList.join(', ');
                }

            let results = `
                <div>
                    <h3>Country Details</h3>
                    <img src="${flag}"
                         alt="Flag of ${name}"
                         id="flag"/>
                    <ul>
                        <li><strong>Name:</strong> ${name}</li>
                        <li><strong>Capital:</strong> ${capital}</li>
                        <li><strong>Population:</strong> ${population}</li>
                        <li><strong>Area:</strong> ${area}</li>
                        <li><strong>Languages:</strong> ${languages}</li>
                    </ul>
                </div>
                <div>
                    <h3>Other Countries in ${region}</h3>
                    <ul id="region_list"></ul>
                </div>
            `;

            resultDivision.innerHTML = results;

            return fetch(`https://restcountries.com/v3.1/region/${region}`);
        })
        .then(response => response.json())
        .then(regionCountries => {
            let regionListElement = document.getElementById("region_list");
            let countryItems = [];

            for (let country of regionCountries) {
                let countryName = country.name.common;
                countryItems.push(`<li>${countryName}</li>`);
            }

            regionListElement.innerHTML = countryItems.join('');
        })
}
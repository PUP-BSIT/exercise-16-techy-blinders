let textInput = document.getElementById("comment_name_input");
let textArea = document.getElementById("message_team");
let messageButton = document.getElementById("comment_button");

function checkInput() {
    let inputFilled = textInput.value.trim();
    let textMessage = textArea.value.trim();

    if(inputFilled && textMessage) {
        messageButton.disabled = false;
    } else {
        messageButton.disabled = true;
    }
}

textInput.addEventListener("input", checkInput);
textArea.addEventListener("input", checkInput);

function addComment() {
    let commentContainer = document.querySelector(".message-team");
    let newComment = document.createElement("p");
    let timeSpan = document.createElement("span");
    let getDate = dateGenerator();
    let getTime = timeGenerator();

    timeSpan.textContent = `${getDate} | ${getTime}`;
    newComment.textContent = `${textArea.value} - ${textInput.value} `;
    
    newComment.appendChild(timeSpan);
    commentContainer.appendChild(newComment);
    
    textInput.value = "";
    textArea.value = "";
    
    checkInput();
}

function dateGenerator() {
    let date = new Date();
    return date.toLocaleDateString();
}

function timeGenerator() {
    let date = new Date();
    return date.toLocaleTimeString();
}

function sortAscending() {
    let container = document.querySelector(".message-team");
    let allComments = Array.from(container.querySelectorAll("p"));
    
    allComments.sort((a, b) => {
        let timeStampA = convertTimeStamp(a.querySelector('span').textContent);
        let timeStampB = convertTimeStamp(b.querySelector('span').textContent);
        return timeStampA - timeStampB;
    });
    
    container.innerHTML = "";
    allComments.forEach(comment => {
        container.appendChild(comment);
    });
}

function sortDescending() {
    let container = document.querySelector(".message-team");
    let allComments = Array.from(container.querySelectorAll("p"));
    
    allComments.sort((a, b) => {
        let timeStampA = convertTimeStamp(a.querySelector('span').textContent);
        let timeStampB = convertTimeStamp(b.querySelector('span').textContent);
        return timeStampB - timeStampA;
    });
    
    container.innerHTML = "";
    allComments.forEach(comment => {
        container.appendChild(comment);
    });
}

function convertTimeStamp(dateString) {
    let parts = dateString.trim().split('|');
    let datePart = parts[0].trim();
    let timePart = parts[1].trim();
    let dateTimeString = `${datePart} ${timePart}`;
    let date = new Date(dateTimeString);

    return date.getTime();
}

async function searchCountry() {
    let countryInput = document.getElementById("country_input").value.trim();
    let result = document.getElementById("result");
    let regionBox = document.getElementById("region");

    result.innerHTML = "";
    regionBox.innerHTML = "";

    if (!countryInput) {
        alert("Please enter a country name.");
        return;
    }

    let response;
    let data;
    let regionResponse;
    let regionCountries;

    try {
        response = await fetch(
                `https://restcountries.com/v3.1/name/${encodeURIComponent
                                                               (countryInput)}`
        );
        if (!response.ok) throw new Error("Country not found!");
        data = await response.json();
    } catch (error) {
        result.innerHTML = `<p style="color:red;">${error.message}</p>`;
        return;
    }
        
    let country = data.find(c => c.name.common.toLowerCase() ===
                                        countryInput.toLowerCase()) || data[0];

    let name = country.name.common;
    let region = country.region;
    let capital = country.capital?.[0] || "N/A";
    let languages = country.languages
        ? Object.values(country.languages).join(", ")
        : "N/A";
    let currency = country.currencies
        ? Object.values(country.currencies)[0].name
        : "N/A";
    let population = country.population?.toLocaleString() || "N/A";
    let flag = country.flags.svg;

    let topPlace = "";
    if (name.toLowerCase() === "japan") {
        topPlace = `<p><strong>Top Place to Visit:</strong> Tokyo</p>`;
    } else if (name.toLowerCase() === "philippines") {
        topPlace = `<p><strong>Top Place to Visit:</strong> Boracay</p>`;
    }

    result.innerHTML = `
        <h2>${name}</h2>
        <img src="${flag}" class="flag" alt="Flag of ${name}" />
        <p><strong>Capital:</strong> ${capital}</p>
        <p><strong>Languages:</strong> ${languages}</p>
        <p><strong>Currency:</strong> ${currency}</p>
        <p><strong>Region:</strong> ${region}</p>
        <p><strong>Population:</strong> ${population}</p>
        ${topPlace}`;

    try {
        regionResponse = await fetch
        (`https://restcountries.com/v3.1/region/${encodeURIComponent(region)}`
                                                                             );
        if (!regionResponse.ok) throw new Error("Failed fetch region data.");
        regionCountries = await regionResponse.json();
    } catch (error) {
        console.error(error.message);
        return;
    }

    regionBox.innerHTML = `<h3>Other countries in ${region}:</h3>`;
    regionCountries.forEach((countries) => {
        if (countries.name.common.toLowerCase() !== name.toLowerCase()) {
            return;
        }
        
        let element = document.createElement("span");
        element.classList.add("region-country");
        element.textContent = countries.name.common;
        regionBox.appendChild(element);
    });
}
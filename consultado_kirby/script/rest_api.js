const API_URL = "https://darkorange-cormorant-406076.hostingersite.com/group_page/crud_consultado.php"

let carForm = document.getElementById("car_form");
let carTableBody = document.querySelector("#car_table tbody");
let confirmationMesaage = document.getElementById("message");

let fields = ["brand", "model", "year", "color", "transmission"];

carForm.addEventListener("submit", function(event) {
    event.preventDefault();

    let formData = new FormData(carForm);
    fetch(API_URL, {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            showMessage(data.message, "success");
            carForm.reset();
            loadCars();
            return;
        }

        if (data.error) {
            showMessage(data.error, "error");
            return;
        }
    })
});

function loadCars() {
    fetch(API_URL)
    .then(response => response.json())
    .then(cars => {
        carTableBody.innerHTML = "";

        cars.forEach(car => {
            carTableBody.innerHTML += `
                <tr>
                    <td data-label="Car ID">${car.car_id}</td>
                    <td data-label="Brand"><input type="text"
                               value="${car.brand}"
                               id="brand_${car.car_id}" required></td>
                    <td data-label="Model"><input type="text"
                               value="${car.model}"
                               id="model_${car.car_id}" required></td>
                    <td data-label="Year"><input type="number"
                               value="${car.year}"
                               id="year_${car.car_id}" required></td>
                    <td data-label="Color"><input type="text"
                               value="${car.color}"
                               id="color_${car.car_id}" required></td>
                    <td data-label="Transmission"><input type="text"
                               value="${car.transmission}"
                               id="transmission_${car.car_id}" required></td>
                    <td data-label="Actions">
                        <button onclick="updateCar(${car.car_id})">
                            Update</button>
                        <button onclick="deleteCar(${car.car_id})">
                            Delete</button>
                    </td>
                </tr>`;
        });
    })
}

function updateCar(car_id) {
    if (confirm("Are you sure you want to update this car?")) {
        let data = {car_id};

        for (let field of fields) {
            let value = document.getElementById(`${field}_${car_id}`)
                .value.trim();
            data[field] = value;
        }

        let formData = new URLSearchParams();
        for (let [key, value] of Object.entries(data)) {
            formData.append(key, value);
        }

        fetch(API_URL, {
            method: "PATCH",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formData.toString()
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                showMessage(data.message, "success");
                loadCars();
                return;
            }

            if (data.error) {
                showMessage(data.error, "error");
                return;
            }
        })
    }
}

function deleteCar(car_id) {
    if (confirm("Are you sure you want to delete this car?")) {
        fetch(API_URL, {
            method: "DELETE",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `car_id=${car_id}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                showMessage(data.message, "success");
                loadCars();
                return;
            }

            if (data.error) {
                showMessage(data.error, "error");
                return;
            }
        })
    }
}

function showMessage(msg, type = "info") {
    confirmationMesaage.innerText = msg;
    confirmationMesaage.className = type;

    setTimeout(() => {
        confirmationMesaage.innerText = "";
        confirmationMesaage.className = "";
    }, 3000);
}

document.addEventListener("DOMContentLoaded", loadCars);
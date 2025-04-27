const API_URL = "https://darkorange-cormorant-406076.hostingersite.com/group_page/crud_mosquito.php";

function submitPhone() {
    let phoneType = document.getElementById("phone_type").value;
    let phoneName = document.getElementById("phone_name").value;
    let releaseDate = document.getElementById("release_date").value;
    let creator = document.getElementById("creator").value;
    let price = document.getElementById("price").value;

    if (!phoneType || !phoneName || !releaseDate || !creator || !price) {
        alert("Please fill in all fields.");
        return;
    }

    fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "phoneType=" + encodeURIComponent(phoneType) + "&" +
              "phoneName=" + encodeURIComponent(phoneName) + "&" +
              "releaseDate=" + encodeURIComponent(releaseDate) + "&" +
              "creator=" + encodeURIComponent(creator) + "&" +
              "price=" + encodeURIComponent(price)
    })
    .then(response => response.text())
    .then(responseText => {
        alert(responseText);
        if (!responseText.includes("Error")) {
            document.getElementById("phone_type").value = "";
            document.getElementById("phone_name").value = "";
            document.getElementById("release_date").value = "";
            document.getElementById("creator").value = "";
            document.getElementById("price").value = "";
            loadPhones();
        }
    })
    .catch(error => {
        alert("Error: " + error.message);
    });
}

function loadPhones() {
    fetch(API_URL)
        .then(response => response.text())
        .then(data => {
            document.getElementById("phone_list").innerHTML = data;
        })
        .catch(error => {
            alert("Error loading phones: " + error.message);
        });
}

function editPhone(id) {
    let phoneType = prompt("Enter new phone type:");
    let phoneName = prompt("Enter new phone name:");
    let releaseDate = prompt("Enter new release date:");
    let creator = prompt("Enter new creator:");
    let price = prompt("Enter new price:");

    if (!phoneType || !phoneName || !releaseDate || !creator || !price) {
        alert("All fields must be filled.");
        return;
    }

    fetch(API_URL, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "id=" + encodeURIComponent(id) + "&" +
              "phoneType=" + encodeURIComponent(phoneType) + "&" +
              "phoneName=" + encodeURIComponent(phoneName) + "&" +
              "releaseDate=" + encodeURIComponent(releaseDate) + "&" +
              "creator=" + encodeURIComponent(creator) + "&" +
              "price=" + encodeURIComponent(price)
    })
    .then(response => response.text())
    .then(responseText => {
        alert(responseText);
        loadPhones();
    })
    .catch(error => {
        alert("Error: " + error.message);
    });
}

function deletePhone(id) {
    if (!confirm("Are you sure you want to delete this phone?")) return;

    fetch(API_URL, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "id=" + encodeURIComponent(id)
    })
    .then(response => response.text())
    .then(responseText => {
        alert(responseText);
        loadPhones();
    })
    .catch(error => {
        alert("Error: " + error.message);
    });
}

window.onload = function() {
    loadPhones();
}
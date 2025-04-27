const API_URL = "https://darkorange-cormorant-406076.hostingersite.com/group_page/crud_veslino.php";

function submitMovie() {
  const movieName = document.querySelector("#movie_name").value;
  const movieType = document.querySelector("#movie_type").value;
  const movieYear = document.querySelector("#movie_year").value;
  const movieDirector = document.querySelector("#movie_director").value;
  const movieCountry = document.querySelector("#movie_country").value;

  if (!movieName || !movieType || !movieYear || !movieDirector
      || !movieCountry) {
      alert("Please fill in all fields");
      return;
  }

  fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-type": "application/x-www-form-urlencoded",
    },
    body: `movie_name=${encodeURIComponent(movieName)}
           &movie_type=${encodeURIComponent(movieType)}
           &movie_year=${encodeURIComponent(movieYear)}
           &movie_director=${encodeURIComponent(movieDirector)}
           &movie_country=${encodeURIComponent(movieCountry)}`,
  })
    .then((response) => response.text())
    .then((responseText) => {
      alert(responseText);
      fetchMovies();
      clearFormFields();
    });
}

function clearFormFields() {
  document.querySelector("#movie_name").value = "";
  document.querySelector("#movie_type").value = "";
  document.querySelector("#movie_year").value = "";
  document.querySelector("#movie_director").value = "";
  document.querySelector("#movie_country").value = "";
}

function fetchMovies() {
  fetch(API_URL)
    .then((response) => response.json())
    .then((movies) => {
      displayMovies(movies);
    });
}

function displayMovies(movies) {
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "";
  if (!movies.length) {
    resultDiv.innerHTML = "<p>No movies found. Add your first movie!</p>";
    return;
  }
  
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  thead.innerHTML = `
  <tr>
      <th>Movie Name</th>
      <th>Genre</th>
      <th>Year</th>
      <th>Director</th>
      <th>Country</th>
      <th>Actions</th>
  </tr>
  `;
  table.appendChild(thead);
  
  const tbody = document.createElement("tbody");
  movies.forEach((movie) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${movie.movie_name}</td>
      <td>${movie.movie_type}</td>
      <td>${movie.movie_year}</td>
      <td>${movie.movie_director}</td>
      <td>${movie.movie_country}</td>
      <td>
        <button class="action-btn read-btn"
          onclick="readMovie(${movie.id})">Read</button>
        <button class="action-btn update-btn"
          onclick="startUpdateMovie(${movie.id})">Update</button>
        <button class="action-btn delete-btn"
          onclick="deleteMovie(${movie.id})">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  resultDiv.appendChild(table);
}

function readMovie(id) {
  fetch(`${API_URL}?id=${id}`)
  .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        const movie = data.movie;
        alert(`Movie Details
               Name: ${movie.movie_name}
               Genre: ${movie.movie_type}
               Year: ${movie.movie_year}
               Director: ${movie.movie_director}
               Country: ${movie.movie_country}`
        );
      } else {
        alert("Error: " + data.message);
      }
    });
}

function startUpdateMovie(id) {
  const movieName = prompt("Enter new Movie Name:");
  const movieType = prompt("Enter new Genre:");
  const movieYear = prompt("Enter new Year:");
  const movieDirector = prompt("Enter new Director:");
  const movieCountry = prompt("Enter new Country:");

  if (movieName && movieType && movieYear && movieDirector && movieCountry) {
    fetch(API_URL, {
      method: "PATCH",
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
      },
      body: `id=${id}&movie_name=${encodeURIComponent(movieName)}
                     &movie_type=${encodeURIComponent(movieType)}
                     &movie_year=${encodeURIComponent(movieYear)}
                     &movie_director=${encodeURIComponent(movieDirector)}
                     &movie_country=${encodeURIComponent(movieCountry)}`,
    })
      .then((response) => response.text())
      .then((responseText) => {
        alert(responseText);
        fetchMovies();
      });
  }
}

function deleteMovie(id) {
  if (confirm("Are you sure you want to delete this movie?")) {
    fetch(API_URL, {
      method: "DELETE",
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
      },
      body: `id=${id}`,
    })
      .then((response) => response.text())
      .then((responseText) => {
        alert(responseText);
        fetchMovies();
      });
  }
}
window.onload = fetchMovies;
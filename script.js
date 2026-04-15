const API_KEY = "7a91fd9f";

let movies = [];

// Fetch movies
async function searchMovies() {
  const query = document.getElementById("searchInput").value;

  const loading = document.getElementById("loading");
  const results = document.getElementById("results");

  // SHOW loading
  loading.classList.remove("hidden");
  results.innerHTML = "";

  const response = await fetch(
    `https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`
  );
  const data = await response.json();

  movies = data.Search || [];
    // HIDE loading
    loading.classList.add("hidden");
    
  displayMovies(movies);
}

// Display movies
function displayMovies(movieArray) {
  const results = document.getElementById("results");
  results.innerHTML = "";

  

  if (movieArray.length === 0) {
    results.innerHTML = "<p>No results found</p>";
    return;
  }

  movieArray.slice(0, 6).forEach(movie => {
    const div = document.createElement("div");
    div.classList.add("card");

    div.innerHTML = `
      <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/200'}" />
      <h3>${movie.Title}</h3>
      <p>${movie.Year}</p>
    `;

    // Click for more details
    div.onclick = () => getMovieDetails(movie.imdbID);
    
    results.appendChild(div);
  });
}

// Get full movie info
async function getMovieDetails(id) {
  const response = await fetch(
    `https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}`
  );
  const data = await response.json();
  openModal(data);

  function openModal(data) {
    document.getElementById("modalPoster").src =
      data.Poster !== "N/A" ? data.Poster : "";
  
    document.getElementById("modalTitle").textContent = data.Title;
    document.getElementById("modalYear").textContent = "Year: " + data.Year;
    document.getElementById("modalGenre").textContent = "Genre: " + data.Genre;
    document.getElementById("modalPlot").textContent = data.Plot;
  
    document.getElementById("modal").classList.remove("hidden");
  }
  
  function closeModal() {
    document.getElementById("modal").classList.add("hidden");
  }
  document.getElementById("modal").addEventListener("click", (e) => {
    if (e.target.id === "modal") {
      closeModal();
    }
  });
}

// Sorting
function sortMovies() {
  const value = document.getElementById("sortSelect").value;

  let sorted = [...movies];

  if (value === "az") {
    sorted.sort((a, b) => a.Title.localeCompare(b.Title));
  } else if (value === "za") {
    sorted.sort((a, b) => b.Title.localeCompare(a.Title));
  } else if (value === "new") {
    sorted.sort((a, b) => b.Year - a.Year);
  } else if (value === "old") {
    sorted.sort((a, b) => a.Year - b.Year);
  }

  displayMovies(sorted);
}

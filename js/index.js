const moviesApi = 'https://japceibal.github.io/japflix_api/movies-data.json';
const searchButton = document.getElementById('btnBuscar');
const searchInput = document.getElementById('inputBuscar');
const movieList = document.getElementById('lista');

let moviesData = [];

// Evento que guarda los datos del JSON una vez que se carga la página

window.addEventListener("DOMContentLoaded", () => {
    fetch(moviesApi)
        .then(response => response.json())
        .then(movies => {
            moviesData = movies;
            console.log(moviesData); 
        })
        .catch(error => {
            console.error("Error:", error);
        });
});

// Event listener para el botón de búsqueda

searchButton.addEventListener('click', () => {
    const inputValue = searchInput.value.toLowerCase(); 
    movieList.innerHTML = ''; 

    if (inputValue.trim() === "") {
        alert("Por favor, ingrese un término de búsqueda");
        return; 
    }

    const filteredMovies = moviesData.filter(movie =>
        movie.title.toLowerCase().includes(inputValue) ||
        movie.genres.some(genre =>
            typeof genre === 'string' && genre.toLowerCase().includes(inputValue)
        ) ||
        (movie.tagline && movie.tagline.toLowerCase().includes(inputValue)) ||
        (movie.overview && movie.overview.toLowerCase().includes(inputValue))
    );

    if (filteredMovies.length === 0) {
        movieList.innerHTML = '<li class="list-group-item text-white bg-danger">No se encontraron películas</li>';
        return;
    }


    filteredMovies.forEach(movie => {
        movieList.innerHTML += `
            <li class="list-group-item bg-dark text-light">
                <h5>${movie.title}</h5>
                <p>${movie.tagline || 'Sin tagline disponible'}</p>
                <div>${starRating(movie.vote_average)}</div>
            </li>
        `;
    });
});


searchInput.addEventListener('input', () => {
    const inputValue = searchInput.value.toLowerCase();

    if (inputValue.trim() === "") {
        movieList.innerHTML = '';
    }
});


// Función para mostrar las estrellas basado en el voto promedio

function starRating(vote) {
    const fullStars = Math.floor(vote / 2);
    const stars = Array(5).fill('<i class="fa fa-star text-muted"></i>');

    for (let i = 0; i < fullStars; i++) {
        stars[i] = '<i class="fa fa-star checked"></i>'; 
    }

    return stars.join('');
}


movieList.addEventListener('click', (event) => {
    const movieTitle = event.target.closest('.list-group-item');

    if (movieTitle) {
        const movie = moviesData.find(m => m.title === movieTitle.querySelector('h5').textContent);
        if (movie) {
            
            const offcanvasContainer = document.createElement('div');
            offcanvasContainer.classList.add('offcanvas', 'offcanvas-end', 'bg-dark');
            offcanvasContainer.setAttribute('tabindex', '-1');
            offcanvasContainer.setAttribute('id', 'movieDetails');
            offcanvasContainer.setAttribute('aria-labelledby', 'movieDetailsLabel');

            offcanvasContainer.innerHTML = `
            <div class="offcanvas-header">
                <h5 id="movieDetailsLabel" class="text-light">${movie.title}</h5>
                <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body text-light">
                <p><strong>Overview:</strong> ${movie.overview || 'No overview available'}</p>
                <p><strong>Genres:</strong> ${Array.isArray(movie.genres) ? movie.genres.map(genre => typeof genre === 'string' ? genre : genre.name).join(' - ') : 'No genres available'}</p>
                <p><strong>Release Year:</strong> ${movie.release_date.split('-')[0]}</p>
                <p><strong>Runtime:</strong> ${movie.runtime} minutes</p>
                <p><strong>Budget:</strong> $${movie.budget.toLocaleString()}</p>
                <p><strong>Revenue:</strong> $${movie.revenue.toLocaleString()}</p>
            </div>
        `;

            // Agregar el offcanvas 

            document.body.appendChild(offcanvasContainer);

            const offcanvas = new bootstrap.Offcanvas(offcanvasContainer);
            offcanvas.show();

            offcanvasContainer.addEventListener('hidden.bs.offcanvas', () => {
                offcanvasContainer.remove();
            });
        }
    }
});





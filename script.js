const apikey = "6a18c1c9ec15c5ed95e54eba3af64be4";
const apiEndPoint = "https://api.themoviedb.org/3/";
const imgpath= "https://image.tmdb.org/t/p/original";
const allpath = {
    getAllCat: `${apiEndPoint}genre/movie/list?api_key=${apikey}&language=en-US`,
    gettrending: `${apiEndPoint}/trending/all/day?api_key=${apikey}&language=en-US`,
    getmovielist: (id) =>`${apiEndPoint}discover/movie?api_key=${apikey}&with_genres=${id}`,
    
}


function loadingcomplete() {
    getbanner()
   
    getallgeners()
}
function getbanner (){
    fetchAndbuildSection(allpath.gettrending,'Trending Now')
  
    .then(list =>{
        const index = parseInt(Math.random()*list.length);
        buildbannersection(list[index]);
    })
    .catch(err=>console.error(err))
    
}
function buildbannersection(movie){
    const bannercont = document.getElementById('banner-sec')
    bannercont.style.backgroundImage =`url('${imgpath}${movie.backdrop_path}')`;
    const div=document.createElement('div');
    div.innerHTML=
   `<h2 class="banner-title">${movie.original_title||movie.name}</h2>
    <p class="banner-info">Ratting ${movie.vote_average}⭐</p>
    <p class="banner-overview">${movie.overview}<p>
    <div class="action-buttons">
      <button class="action-button"> ▶️ Play</button>
      <button class="action-button"> ℹ️ More info</button>
      <div>
  `;
  div.className="banner-content container"
  bannercont.append(div)
}
function getallgeners() {
    fetch(allpath.getAllCat)
        .then(res => res.json())
        .then(res => {
            const catogires = res.genres;
            if (Array.isArray(catogires) && catogires.length) {
                catogires.slice(0,7).forEach(category=> {
                    fetchAndbuildSection(allpath.getmovielist(category.id),category.name);
                } );
            }
            // console.table(catogires)
        })
        .catch(err => console.log(err))

}
function fetchAndbuildSection(fetchUrl, categoryName){
    console.log(fetchUrl,categoryName);
    return fetch(fetchUrl)
    .then(res => res.json())
    .then(res => {
        // console.table(res.results);
        const movies = res.results;
        if (Array.isArray(movies) && movies.length) {
            buildMoviesSection(movies.slice(0,8), categoryName);
        }
        return movies;
    })
    .catch(err=>console.error(err))
}

function buildMoviesSection(list, categoryName)
{
    console.log(list, categoryName);

    const moviesCont = document.getElementById('movies-cont');
    
    const moviesListHTML = list.map(item => {
        return `
            <img class="movie-item" src="${imgpath}${item.backdrop_path}" alt="${item.original_title}" />
        
    `}).join('');

    const moviesSectionHTML = `
        <h2 class="movies-sec-head">${categoryName} <span class="explore">Explore All ></span></h2>
        <div class="movies-row">
            ${moviesListHTML}
        </div>
    `

    const div = document.createElement('div');
    div.className = "movies-section"
    div.innerHTML = moviesSectionHTML;

    // append html into movies container
    moviesCont.append(div);
}


window.addEventListener('load', function(){
    loadingcomplete()
    window.addEventListener('scroll', function(){
        // header ui update
        const header = document.getElementById('header');
        if (window.scrollY > 5) header.classList.add('black-bg')
        else header.classList.remove('black-bg');
    })
})
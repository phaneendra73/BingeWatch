const apikey = "6a18c1c9ec15c5ed95e54eba3af64be4";
const apiEndPoint = "https://api.themoviedb.org/3/";
const imgpath= "https://image.tmdb.org/t/p/original";
const allpath = {
    getAllCat: `${apiEndPoint}genre/movie/list?api_key=${apikey}&language=en-US`,
    gettrending: `${apiEndPoint}/trending/all/day?api_key=${apikey}&language=en-US`,
    getmovielist: (id) =>`${apiEndPoint}discover/movie?api_key=${apikey}&with_genres=${id}`,
    searchOnYt:(query) => `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=AIzaSyD8s94vQ4wdl8D5qRlYBzmdZN_nNSNK-o8`
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
     const you=movie.vote_average
    const rating=Math.round(you)
    const bannercont = document.getElementById('banner-sec')
    bannercont.style.backgroundImage =`url('${imgpath}${movie.backdrop_path}')`;
    
    const div=document.createElement('div');
    div.innerHTML=
   `<h2 class="banner-title">${movie.original_title||movie.name}</h2>
    <p class="banner-info">IMDB ${rating}⭐</p>
    <p class="banner-overview">${movie.release_date}<p>
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
                catogires.slice(0,6).forEach(category=> {
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
        const you=item.vote_average;
        const rating=Math.round(you);
        return `
        <div class="movie-item" onclick="searchtrailer('${item.title}', 'yt${item.id}')">
        <img class="nlogo" src="./images/N.png">
        <span class="movie-info">
        ${item.title}<br> IMDB : ${rating}⭐<br>DT : ${item.release_date}<br></span>
            <img  class="movie-item-img" src="${imgpath}${item.backdrop_path}" alt="${item.title}"/>
            <div class="iframe-wrap" id="yt${item.id}"></div>
        </div>
        
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
//youtube api fetching section
function searchtrailer(Moviename,iframId){
    if(!Moviename)  return;

    fetch(allpath.searchOnYt(Moviename))
    .then(res => res.json())
    .then(res => {
        const bestResult = res.items[0];
        
        const elements = document.getElementById(iframId);
        console.log(elements, iframId);

        const div = document.createElement('div');
        div.innerHTML = `<iframe width="400px" height="220px" src="https://www.youtube.com/embed/${bestResult.id.videoId}?autoplay=1&controls=0"></iframe>`

        elements.append(div);
        
    })
    .catch(err=>console.log(err));
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
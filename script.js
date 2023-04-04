const apikey="6a18c1c9ec15c5ed95e54eba3af64be4";
const apiEndPoint="https://api.themoviedb.org/3/"
const allpath={
    allmovies :`${apiEndPoint}genre/movie/list?api_key=${apikey}&language=en-US`
    
}
function loadingcomplete(){
 fetch(allpath.allmovies)
 .then(res => console.log(res))
 .catch(err => console.log(err));
}
window.addEventListener('load',loadingcomplete())
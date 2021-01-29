/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise. 
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.
const noImg = 'https://cdn-5fcbf5c4c1ac1a221c18568d.closte.com/wp-content/themes/ryse/assets/images/no-image/No-Image-Found-400x264.png';
  const searchURL = 'https://cors-anywhere.herokuapp.com/http://api.tvmaze.com/search/shows'
  const response = await axios.get(searchURL, { params: { q: query } });
  let shows = response.data.map(show => {
    return {
      id: show.show.id,
      name: show.show.name,
      summary: show.show.summary,
      image: show.show.image ? show.show.image.medium : noImg
    }
  })
  return shows;
  
}


/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show text-dark my-3" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
            <img class="card-img-top" src="${show.image}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button class="showEpisode btn btn-outline-info">Show episodes</button>
           </div>
         </div>
       </div>
      `);
    $showsList.append($item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch(evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);
  populateShows(shows);
  $("#search-query").val('')

});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  const result = await axios.get(`https://cors-anywhere.herokuapp.com/http://api.tvmaze.com/shows/${id}/episodes`);
  console.log(result.data)
  let episode = result.data.map(show => ({
    
      id: show.id,
      name: show.name,
      season: show.season,
      number: show.number
    
  }))
  return episode;

  // TODO: return array-of-episode-info, as described in docstring above
}

function populateEpisodes(episode){
const $episodeList = $('#episodes-list');
$episodeList.empty();
for (let show of episode) {
  let $item = $(`<li class="list-group-item text-dark">
    <b>${show.name}</b>
    (Season ${show.season}, episode${show.number})</li>
    `);
    $episodeList.append($item);
  }
  $('#episodes-area').show();
}

$('body').on('click', '.showEpisode', async (e) => {
 let showID = $(e.target).closest('.Show').data('show-id');
 let episodes = await getEpisodes(showID);
  populateEpisodes(episodes);
})

//JQuery Element Variables

const lyricSearchBtn = $('.lyricSearchBtn');
const artistInfoDiv = $('.artistInfo');
const lyricsDiv = $('.lyrics');
const recommendedArtistsDiv = $('.recommendedArtists');
const apiKey = "395206-Hayley-2B98EPSV";
const queryURL = "https://tastedive.com/api/similar";
const similarArtistsDiv = $('.similarArtists');
//modal test vars

const modal = $('#modal1');

// localstorage variables

let savedArtists = []
let savedsongName = []
let savedPoster= []
let savedlyrics = []

// test to push




$(document).ready(function() {
    modal.modal();
});
  
lyricSearchBtn.click(handleShazam)


function handleShazam () {
    const searchedLyrics = $('.lyricSearchBar').val();
    $.ajax({
        "async": true,
        "crossDomain": true,
        "url": "https://shazam.p.rapidapi.com/search?term=" + searchedLyrics + "&locale=en-US&offset=0&limit=5",
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "198c5d9404msh8afbdbe95aa7f12p115299jsn1d3f7e17a3ea",
            "x-rapidapi-host": "shazam.p.rapidapi.com"
        }
    }).done(function (response) {
    console.log(response);
    if ($.isEmptyObject(response)){
        console.log('oops!');
        modal.modal('open');
        artistInfoDiv.empty();
        lyricsDiv.empty();
        similarArtistsDiv.empty();
        return
    };
    const artistName = response.tracks.hits[0].track.subtitle;
    const modArtist = artistName.replace(" ", "-") && artistName.replace("Feat.", "feat");
    const artistKey = response.tracks.hits[0].track.key;
    const songName = response.tracks.hits[0].track.title
    const songLyrics = response.tracks.hits[0].track.url
    const songArt = response.tracks.hits[0].track.images.background
    let artistObject = {
        artist : artistName,
        song : songName,
        lyrics : songLyrics,
        poster : songArt,
        key : artistKey
    }
    createArtistBio(artistObject);
    console.log(artistObject);
    handleTasteDive(modArtist, artistKey);

    })
}


function saveSearchedArtist(artist) {
    savedArtists.push(artist);
    window.localStorage.setItem('artists', JSON.stringify(savedArtists));
}
function savesongName (songName) {
    savedsongName.push(songName);
    window.localStorage.setItem('songName', JSON.stringify(savedsongName));
}
function savePoster (poster) {
    savedPoster.push(poster);
    window.localStorage.setItem('poster', JSON.stringify(savedPoster));
}
function savelyrics (lyrics) {
    savedlyrics.push(lyrics);
    window.localStorage.setItem('lyrics', JSON.stringify(savedlyrics));
}


function handleTasteDive (modArtist, artistKey) {

    // if the shazam return has ft artist, split string and return first in returned array
    if (modArtist.includes("feat")){
        modArtist = modArtist.split("feat")[0];
        console.log("this is modartist: ", modArtist);
    };

    $.ajax({
        type: "GET",
        url: queryURL,
        jsonp: "callback", 
        dataType: "jsonp", // send JSON data without worry of cross-domain issues

        // data object is for TasteDive API calls
        data: {
            type: "music", // media form specification
            q: modArtist, // string query
            k: apiKey, // API access key for TasteDive
            info: 1, // to include a return of youtube links
        },
    }).then(function (response) {
        // variable for number of items displayed
        const totalSimArtists = 3;
        // clear list before appending new search results
        $(".similarArtists").empty();
                
        var tasteDiveResult = response.Similar.Results;
        // if the object is empty, run handleUndefined function
        if (tasteDiveResult.length < 1){

            handleUndefined(artistKey);        

        } else {

            for (var i = 0; i < totalSimArtists; i++) {
                
                var youtubeID = response.Similar.Results[i].yID;
                var youtubeLink = "https://www.youtube.com/watch?v=" + youtubeID; // youtube link with response ID to form html link
                var tasteDiveResults = (response.Similar.Results[i].Name); // name of similar artist
                var hrefAttr = $('<a>').attr('href', youtubeLink).text(tasteDiveResults); // hyperlink
                var listAttr = $("<li>").append(hrefAttr); // create list element with hyperlink
                $(".similarArtists").append(listAttr); // append the hyperlink to the ul 

            }
        }
    });
}

function handleUndefined(artistKey){
    console.log("AK:", artistKey)

    const settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://shazam.p.rapidapi.com/songs/list-recommendations?key=" + artistKey + "&locale=en-US",
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "198c5d9404msh8afbdbe95aa7f12p115299jsn1d3f7e17a3ea",
            "x-rapidapi-host": "shazam.p.rapidapi.com"
        }
    };
    
    $.ajax(settings).done(function (response) {

        const totalReturnArtists = 3;
        var isEmptyObject = jQuery.isEmptyObject(response) // returns true or false 

        // if the object is empty, post sorry
        if (isEmptyObject === true){
            $(".similarArtists").append("Sorry, similar recommendations are not availible for this search.");
        } else { 
            for (var i = 0; i < totalReturnArtists; i++) {

                var similarArtistLink = response.tracks[i].url; // shazam url
                var similarArtistResults = response.tracks[i].subtitle; // name of artist
                var artistHrefAttr = $('<a>').attr('href', similarArtistLink).text(similarArtistResults); // href with artist name
                var artistListAttr = $("<li>").append(artistHrefAttr); // list href item 
                $(".similarArtists").append(artistListAttr); // add list item

            }
        }
    });
}

function createArtistBio(artistObject) {
    artistInfoDiv.empty();
    lyricsDiv.empty();

    // Links title of song with url to lyrics.
    let lyricsUrl = 'https://www.shazam.com/track/' + artistObject.key;
    const songLink = artistObject.song;

    // Displays artist name and poster.
    $('<div>', {
        id: 'artist',
        text: artistObject.artist
    }).appendTo(artistInfoDiv);
        
    $('<img>', {
        class: 'responsive-img materialboxed',
        id: 'poster',
        src: artistObject.poster
    }).appendTo(artistInfoDiv);

    // Expands displayed poster.
    $(document).ready(function(elem){
        var instance = M.Materialbox.getInstance(elem);
        $('.materialboxed').materialbox(instance);
    });

    // Displays song name as a link to the lyrics.
    $('<a>', {
        id: 'link-lyrics',
        href: lyricsUrl,
        target: '_blank',
        text: songLink,
    }).appendTo(lyricsDiv);

}


// // const artistName = response.tracks.hits[0].track.subtitle;
// const songName = response.tracks.hits[0].track.title
// console.log("this is artist: ", artistName);
// console.log("this is name: ", songName);

//console.log("this is artist: ", artistName);
//console.log("this is name: ", songName);

//.fail(function(error){console.log('somethings wrong')})





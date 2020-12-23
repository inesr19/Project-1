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
            "x-rapidapi-key": "1c9a023ed1msh7f6737bed07a8e3p126d31jsnfd7845cb0d56",
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
    const songName = response.tracks.hits[0].track.title
    const songLyrics = response.tracks.hits[0].track.url
    const songArt = response.tracks.hits[0].track.images.background
    let artistObject = {
        artist : artistName,
        song : songName,
        lyrics : songLyrics,
        poster : songArt
    }
    createArtistBio(artistObject);
    console.log(artistObject);
    handleTasteDive(modArtist);
    })
}


function saveSearchedArtist(artist) {
    savedArtists.push(artist);
    window.localStorage.setItem('artists', JSON.stringify(savedArtists));
}

function handleTasteDive (modArtist) {
    console.log("this is before if statement: ", modArtist)
    // if the shazam return has ft artist, split string and return first in returned array
    if (modArtist.includes("feat")){
        modArtist = modArtist.split("feat")[0];
        console.log("this is modartist: ", modArtist);
    }
    
    $.ajax({
        type: "GET",
        url: queryURL,
        jsonp: "callback", // not sure if we need this, if commented out, this test still works
        dataType: "jsonp", // send JSON data without worry of cross-domain issues

        // data object is for TasteDive API calls
        data: {
            type: "music", // media form specification
            q: modArtist, // string query
            k: apiKey, // API access key for TasteDive
            info: 1, // to include a return of youtube links
        },
    }).then(function (response) {
        // set total similar artist to 3 for displaying only 3 artists, can adjust for fewer or more
        const totalSimArtists = 3;
        // clear list before appending new search results
        $(".similarArtists").empty();
        // for each similar artist, add a list item
        for (var i = 0; i < totalSimArtists; i++) {
            // youtube link with response ID to form html link
            let youtubeLink = "https://www.youtube.com/watch?v=" + response.Similar.Results[i].yID
            // name of similar artist
            const tasteDiveResults = (response.Similar.Results[i].Name);
            // hyper link to youtube with name of artist as hyperlink
            let hrefAttr = $('<a>').attr('href', youtubeLink).text(tasteDiveResults);
            // create list element with hyperlink as content
            let listAttr = $("<li>").append(hrefAttr);

            // append the hyperlink to the ul 
            $(".similarArtists").append(listAttr);

            // console.log("this is taste dive result: ", tasteDiveResults)
            console.log("td response: ", youtubeLink)
            console.log("tastdive object: ", response)

        }


    });

}

function createArtistBio(artistObject) {
    artistInfoDiv.empty();
    lyricsDiv.empty();

    // Links title of song with url to lyrics.
    let lyricsUrl = 'https://www.shazam.com/track/46697155/' + artistObject.song;
    const songLink = artistObject.song;

    // Displays artist name and poster.
    $('<div>', {
        id: 'artist',
        text: artistObject.artist
    }).append($('<img>', {
        id: 'poster',
        src: artistObject.poster
    })).appendTo(artistInfoDiv);

    // Displays song name as a link to the lyrics.
    $('<a>', {
        id: 'link-lyrics',
        href: lyricsUrl,
        target: '_blank',
        text: songLink,
    }).appendTo(lyricsDiv);

}


//createArtistBio(testArtistObject);


//console.log("this is artist: ", artistName);
//console.log("this is name: ", songName);

//.fail(function(error){console.log('somethings wrong')})

//JQuery Element Variables

const lyricSearchBtn = $('.lyricSearchBtn');
const artistInfoDiv = $('.artistInfo')
const lyricsDiv = $('.lyrics')
const recommendedArtistsDiv = $('.recommendedArtists')
const apiKey = "395206-Hayley-2B98EPSV"
const queryURL = "https://tastedive.com/api/similar";

// localstorage variables
let savedArtists = []

  
$(".lyricSearchBtn").click(function(){
    
    
    const searchedLyrics = $('.lyricSearchBar').val();
    $.ajax({
        "async": true,
        "crossDomain": true,
        "url": "https://shazam.p.rapidapi.com/search?term=" + searchedLyrics + "&locale=en-US&offset=0&limit=5",
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "908b7a298emsh26a4313bfcc5dd1p11e1dbjsn03ef870d77d7",
            "x-rapidapi-host": "shazam.p.rapidapi.com"
        }
    }).done(function (response) {
    console.log(response);
    // second ajax call here
    // code here will be executed once we get response from Shazam
    const artistName = response.tracks.hits[0].track.subtitle;
    const modArtist = artistName.replace(" ", "-");
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

    });


    //saveSearchedArtist(searchedLyrics);
    console.log("we're in the function");
        
})

function saveSearchedArtist (artist) {
    savedArtists.push(artist);
    window.localStorage.setItem('artists', JSON.stringify(savedArtists));
}

function handleTasteDive (modArtist) {
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
        }).then(function(response) {
        // code here will be executed after tastedive
        const totalSimArtists = 3
        console.log(response);
        
        

        for (var i = 0; i < totalSimArtists; i++){
            let youtubeLink = response.Similar.Results[i].yUrl
            const tasteDiveResults = (response.Similar.Results[i].Name);
            let hrefAttr = $('<a>').attr('href', youtubeLink).text(tasteDiveResults);
            let listAttr = $("<li>").append(hrefAttr);
            
            console.log("this is taste dive result: ", tasteDiveResults)
            $(".similarArtists").append(listAttr);
            console.log("td response: ", youtubeLink)
            
        }

        // $(recommendedArtistsDiv).html(response.Similar.Results[0].Name + "<br/>" + response.Similar.Results[1].Name + "<br/>" + response.Similar.Results[2].Name); 
        });
}

let testArtistObject = {
    artist: 'Kanye West',
    poster: './assets/images/kanyeTestImage.jpeg',
    song: 'Power',
    lyrics: 'https://www.shazam.com/track/52699656/power'
    
}

function createArtistBio (artistObject) {
    artistInfoDiv.empty();
    lyricsDiv.empty();
    let artist = $('<div>').text(artistObject.artist);
    let poster = $('<img>').attr('src', artistObject.poster);
    let song = $('<div>').text(artistObject.song);
    let lyrics = $('<a>').attr('href', artistObject.lyrics).text('Click for lyrics');
    artistInfoDiv.append(artist).append(poster);
    lyricsDiv.append(song).append(lyrics);
}

//createArtistBio(testArtistObject);


//console.log("this is artist: ", artistName);
//console.log("this is name: ", songName);




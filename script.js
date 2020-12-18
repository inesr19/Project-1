//JQuery Element Variables

const lyricSearchBtn = $('.lyricSearchBtn');
const artistInfoDiv = $('.artistInfo')
const lyricsDiv = $('.lyrics')
const recommendedArtistsDiv = $('.recommendedArtists')


// cd 
const artistInput = "Anderson-Paak";
const apiKey = "395206-Hayley-2B98EPSV"
const queryURL = "https://tastedive.com/api/similar";

  
$(".lyricSearchBtn").click(function(){
    const searchedLyrics = $('.lyricSearchBar').val();
    // replace user input spaces with dash so that TaseDive can read name properly
    const modSearchLyrics = searchedLyrics.replace(" ", "-");
    console.log(modSearchLyrics)
    console.log("we're in the function");
        $.ajax({
        type: "GET",
        url: queryURL,
        jsonp: "callback", // not sure if we need this, if commented out, this test still works
        dataType: "jsonp", // send JSON data without worry of cross-domain issues
        
        // data object is for TasteDive API calls
        data: {
            type: "music", // media form specification
            q: modSearchLyrics, // string query
            k: apiKey, // API access key for TasteDive
            info: 1, // to include a return of youtube links
        },
    }).then(function(response) {
        // Set a same-site cookie for first-party contexts
        // document.cookie = "cookie1=value1; SameSite=None";
        // Set a cross-site cookie for third-party contexts
        // document.cookie = 'cookie2=value2; SameSite=None; Secure';
        console.log(response);
        // console.log(response.Similar.Results[0].yUrl);
        
        // playing with incoporating buttons
        // const artistReturn1 = response.Similar.Results[0].Name
        // const button1 = $("<button id:name>").text(artistReturn1);

        // probably should end up doing this in a for loop
        // append names of similar artists
        $(".recommendedArtists").html("<br/>" + response.Similar.Results[0].Name + "<br/>" + response.Similar.Results[1].Name + "<br/>" + response.Similar.Results[2].Name);

        // create link element, currently set to 2 item in array
        // var thelink = $("<a>",{
        // text: " linktext",
        // href: response.Similar.Results[1].yUrl
        // }).appendTo("body");
        // $("body").append(response.Similar.Results[0]);
        });

})
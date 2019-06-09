require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var request = require("request");
var fs = require('fs');

var command = process.argv[2]; 
var userInput = process.argv[3];

userInputs(command, userInput);

function userInputs (command, userInput){
    switch (command) {
    case ('concert-this' || 'Concert-this'):
        infoConcert(userInput);
        break;
    case ('spotify-this-song' || 'Spotify-this-song'):
        infoSong(userInput);
        break;
    case ('movie-this' || 'Movie-this'):
        infoMovie(userInput);
        break;
    case ('do-what-it-says' || 'Do-what-it-says'):
        infoDoIt();
        break;
    default: 
        console.log("Error. Please type any of the following commands exactly as they are seen here: \nconcert-this \nspotify-this-song \nmovie-this \ndo-what-it-says")
    }
}

function infoConcert(userInput){
    var queryUrl = "https://rest.bandsintown.com/artists/" + userInput + "/events?app_id=codingbootcamp";
    request(queryUrl, function(err, response, body) {
    // If the request is successful
    if (!err && response.statusCode === 200) {
        var concerts = JSON.parse(body);
        for (var i = 0; i < concerts.length; i++) {  
            console.log(i);
            fs.appendFileSync("log.txt", i+"\n");
            console.log("Name of the Venue: " + concerts[i].venue.name);
            fs.appendFileSync("log.txt", "Name of the Venue: " + concerts[i].venue.name+"\n");
            console.log("Venue Location: " +  concerts[i].venue.city);
            fs.appendFileSync("log.txt", "Venue Location: " +  concerts[i].venue.city+"\n");
            console.log("Date of the Event: " +  concerts[i].datetime);
            fs.appendFileSync("log.txt", "Date of the Event: " +  concerts[i].datetime+"\n");
            console.log("-----------------------");  
            fs.appendFileSync("log.txt", "-----------------------\n");
        }
    } else{
      console.log('Error. Please re-input your request.');
    }
});}

function infoSong(userInput) {
    if (userInput == '' || userInput == undefined) {
        userInput = "The Sign";
    }
    spotify.search(
        {
            type: "track",
            query: userInput
        },
        function (err, data) {
            if (err) {
                console.log("Error occurred: " + err);
                return;
            }
            var results = data.tracks.items;

            for (var i = 0; i < results.length; i++) {
                console.log(i);
                fs.appendFileSync("log.txt", i +"\n");
                console.log("Song name: " + results[i].name);
                fs.appendFileSync("log.txt", "song name: " + results[i].name +"\n");
                console.log("Preview song: " + results[i].preview_url);
                fs.appendFileSync("log.txt", "preview song: " + results[i].preview_url +"\n");
                console.log("Album: " + results[i].album.name);
                fs.appendFileSync("log.txt", "album: " + results[i].album.name + "\n");
                console.log("Artist(s): " + results[i].artists[0].name);
                fs.appendFileSync("log.txt", "artist(s): " + results[i].artists[0].name + "\n");
                console.log("-----------------------");  
                fs.appendFileSync("log.txt", "-----------------------\n");
             }
        }
    );
};

function getRTObjectRating(data) {
    return data.Ratings.find(function(item) {
        return item.Source === "Rotten Tomatoes";
    });
}
  
function getRTValue(data) {
    return getRTObjectRating(data).Value;
}

function infoMovie(userInput) {
    if(userInput == undefined || userInput == '') {
        userInput = "Mr. Nobody"
        console.log("-----------------------");
        fs.appendFileSync("log.txt", "-----------------------\n");
        console.log("Showing by default: Mr. Nobody");
        fs.appendFileSync("log.txt", "Showing by default: Mr. Nobody");
    }
    var queryUrl = "http://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&apikey=trilogy";
    request(queryUrl, function(err, response, body) {
        if(!err && response.statusCode === 200) {
            var movie = JSON.parse(body);
            console.log("Title: " + movie.Title);
            fs.appendFileSync("log.txt", "Title: " + movie.Title + "\n");
            console.log("Release Year: " + movie.Year);
            fs.appendFileSync("log.txt", "Release Year: " + movie.Year + "\n");
            console.log("IMDB Rating: " + movie.imdbRating);
            fs.appendFileSync("log.txt", "IMDB Rating: " + movie.imdbRating + "\n");
            console.log("Rotten Tomatoes Rating: " + getRTValue(movie));
            fs.appendFileSync("log.txt", "Rotten Tomatoes Rating: " + getRTValue(movie) + "\n");
            console.log("Country of Production: " + movie.Country);
            fs.appendFileSync("log.txt", "Country of Production: " + movie.Country + "\n");
            console.log("Language: " + movie.Language);
            fs.appendFileSync("log.txt", "Language: " + movie.Language + "\n");
            console.log("Plot: " + movie.Plot);
            fs.appendFileSync("log.txt", "Plot: " + movie.Plot + "\n");
            console.log("Actors: " + movie.Actors);
            fs.appendFileSync("log.txt", "Actors: " + movie.Actors + "\n");
            console.log("-----------------------");  
            fs.appendFileSync("log.txt", "-----------------------\n");
        }else{
            console.log('Error. Please try entering your search again.');
        }

    });
}

function infoDoIt() {
    fs.readFile("random.txt", "utf8", function(err, data) {
        if(err) {
            return console.log(err);
        }

        var dataArr = data.split(',');
        userInputs(dataArr[0], dataArr[1]);
    });
}
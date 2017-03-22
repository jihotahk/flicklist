
var model = {
  watchlistItems: [],
  browseItems: []
}


var api = {
  root: "https://api.themoviedb.org/3",
  token: "9b90763f6589aec565f60adb21f2bb07"
};

/**
 * Makes an AJAX request to themoviedb.org, asking for some movies
 * if successful, updates the model.browseItems appropriately, and then invokes
 * the callback function that was passed in
 */
function discoverMovies(callback) {
	$.ajax({

		url: api.root + "/discover/movie",
		data: {
			api_key: api.token,
		},
		success: function(response) {
			console.log("We got a response from The Movie DB!");
			console.log(response);

            var movieList = response.results;
            movieList.forEach( function(movie) {
                model.browseItems.push(movie.title);
            })
            console.log(model.browseItems);
			// invoke the callback function that was passed in.
			callback();
		}
	});

}


/**
 * re-renders the page with new content, based on the current state of the model
 */
function render() {
  $('#section-watchlist ul').empty();
  $('#section-browse ul').empty();

  model.watchlistItems.forEach( function(movie) {
      var watchlistItem = $('<li></li>').append("<p>"+movie+"</p>");
      $('#section-watchlist ul').append(watchlistItem);
  });

  model.browseItems.forEach(function(movie) {

        var listItem = $('<li></li>').append("<p>"+movie+"</p>");
        var listButton = $('<button></button>').text('Add to watchlist');
        listItem.append(listButton);

        $('#section-browse ul').append(listItem);

        listButton.click( function() {
            model.watchlistItems.push(movie);
            render();
        })
  });

}


// When the HTML document is ready, we call the discoverMovies function,
// and pass the render function as its callback
$(document).ready(function() {
  discoverMovies(render);
});

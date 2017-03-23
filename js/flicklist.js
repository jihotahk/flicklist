

var model = {
  watchlistItems: [],
  browseItems: []
}


var api = {

  root: "https://api.themoviedb.org/3",
  token: "9b90763f6589aec565f60adb21f2bb07",
  posterUrl: function(movie) {
    // TODO 4b
    // implement this function
    var img_url = "http://image.tmdb.org/t/p/w300//";
    img_url += movie.poster_path;
    return img_url
  }
}


/**
 * Makes an AJAX request to themoviedb.org, asking for some movies
 * if successful, updates the model.browseItems appropriately, and then invokes
 * the callback function that was passed in
 */
function discoverMovies(callback) {
  $.ajax({
    url: api.root + "/discover/movie",
    data: {
      api_key: api.token
    },
    success: function(response) {
      model.browseItems = response.results;
      callback(response);
      console.log(response);
    }
  });
}


/**
 * Makes an AJAX request to the /search endpoint of the API, using the
 * query string that was passed in
 *
 * if successful, updates model.browseItems appropriately and then invokes
 * the callback function that was passed in
 */
function searchMovies(query, callback) {
  $.ajax({
    url: api.root + "/search/movie",
    data: {
      api_key: api.token,
      query: query
    },
    success: function(response) {
      model.browseItems = response.results;
      callback(response);
    }
  });
}


/**
 * re-renders the page with new content, based on the current state of the model
 */
function render() {

  // clear everything
  $("#section-watchlist ul").empty();
  $("#section-browse ul").empty();

  // insert watchlist items
  model.watchlistItems.forEach(function(movie) {
    var title = $("<h6></h6>")
        .text(movie.original_title)
        .addClass('panel-title')

    var watchedButton = $('<button></button>')
        .text('I watched it')
        .addClass('btn btn-danger')
        .click( function() {
            var location = model.watchlistItems.indexOf(movie);
            model.watchlistItems.splice(location, 1);
            render();
        });

    // TODO 4a
    // add a poster image and append it inside the
    // panel body above the button
    var posterImg = $('<img />')
        .addClass('img-responsive')
        .attr('src', api.posterUrl(movie));

    var panelHeading = $('<div></div>')
        .addClass('panel-heading')
        .append(title);

    var panelBody = $('<div></div>')
        .addClass('panel-body')
        .append(posterImg)
        .append(watchedButton);

    var itemView = $("<li></li>")
        .attr("class", "panel panel-default")
        .append(panelHeading)
        .append(panelBody);

    $("#section-watchlist ul").append(itemView);
  });

  // insert browse items
  model.browseItems.forEach(function(movie) {

    var title = $("<h4></h4>").text(movie.original_title);

    var button = $("<button></button>")
      .text("Add to Watchlist")
      .addClass('btn btn-primary')
      .click(function() {
        model.watchlistItems.push(movie);
        render();
      })
      .prop("disabled", model.watchlistItems.indexOf(movie) !== -1);

    var overview = $("<p></p>").text(movie.overview);

    // append everything to itemView, along with an <hr/>
    var itemView = $("<li></li>")
      .addClass('list-group-item')
      .append(title)
      .append(overview)
      .append(button);

    // append the itemView to the list
    $("#section-browse ul").append(itemView);
  });

}


// When the HTML document is ready, we call the discoverMovies function,
// and pass the render function as its callback
$(document).ready(function() {
  discoverMovies(render);
});

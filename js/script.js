
function loadData(event) {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');
    var streetValue, cityValue;

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview

    streetValue = $("#street").val();
    cityValue = $("#city").val();
    var fullAddress = streetValue + ', ' + cityValue;

    $greeting.text('So, you want to live at ' +fullAddress+ '?');

    var streetView = 'https://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + fullAddress + '';
    $body.append('<img class = "bgimg" src = "'+ streetView+'">');

    $.getJSON('https://api.nytimes.com/svc/search/v2/articlesearch.json?q='+city+'&sort=newest&api-key=2bf83b4a30eb4586a75b52e8da1fb10c', function(data) {

        $nytHeaderElem.text('New York Times Articles About ' + city);

        var items = data.response.docs;
        for (var i=0; i<items.length; i++){
            var article = items[i];
            $nytElem.append('<li class="article">' +
             '<a href="'+article.web_url+'">'+article.headline.main+'</a>'+
             '<p>'+article.snippet+'</p>'+
             '</li>');
        };
    }).error(function(e) {
        $nytHeaderElem.text("New York Times Articles Could Not Be Loaded");
    });

    //Wikipedia AJAX request
    var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + cityValue + '&format=json&callback=wikiCallback';

    $ajax({
        url: wikiUrl,
        dataType: 'jsonp',
        success: function(response) {
            var articleList = response[1];

            for (var i=0; i<articleList.length; i++) {
                articleStr = articleList[i];
                var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                $wikiElem.append('<li><a href="' + url + '">' +
                    articleStr + '</a></li>');
            };
        }
    });

    return false;
    event.preventDefault();

};


$('#form-container').submit(loadData);

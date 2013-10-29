/**
 * Search component.
 *
 * @package backpack
 * @author Andrew Sliwinski <andrew@diy.org>
 */

/**
 * Dependencies
 */
var request    = require('browser-request');

/**
 * Search query request helper
 *
 * @param {string} Query
 *
 * @return {array}
 */
function fetch (query, callback) {
    request({
        method: 'GET',
        uri:    '/search?q=' + query
    }, function (err, response, body) {
        if (err) return callback(err);
        callback(null, JSON.parse(body));
    });
}

/**
 * Export
 */
module.exports = function ($el, config) {
    // DOM elements
    var $search     = $el.getElementById('search');
    var $badges     = $el.getElementById('badges');
    var $form       = $el.getElementById('form');
    var $query      = $el.getElementById('query');
    var $container  = $badges.getElementsByTagName('div')[0];

    // Pre-load
    if (config.preload) {
        $query.value = config.preload;
        render(null);
    }

    // Render method
    function render (e) {
        fetch($query.value, function (err, result) {
            if (err) return;
            
            var html = '';
            for (var i = 0; i < result.length; i++) {
                html += '<a href="' + result[i].criteria + '" target="_blank" ' + 
                    'class="item" ' +
                    'style="background-image: url(' + result[i].image + ')">' +
                    '<h4>' + result[i].name + '</h4>' +
                    '<p>' + result[i].description + '</p>' +
                    '</a>';
            }
            $container.innerHTML = html;
        });
    }

    // Bind UI events
    $form.addEventListener('submit', function (e) {
        if (e.preventDefault) e.preventDefault();
        return false;
    });

    $form.addEventListener('keyup', render);

    // // DOM elements
    // $context    = document.getElementById('context');
    // $search     = document.getElementById('search');
    // $form       = document.getElementById('form');
    // $query      = document.getElementById('query');

    // // Create search index & populate
    // var index   = lunr(function () {
    //     this.ref('title');
    //     this.field('title', { boost: 10 });
    //     this.field('meta');
    // });

    // for (var i = 0; i < data.length; i++) {
    //     index.add(data[i]);
    // }

    // // Render the context indicator
    

    // // Render the search field
    // $form.addEventListener('submit', function (e) {
    //     if (e.preventDefault) e.preventDefault();
    //     return false;
    // });

    // $form.addEventListener('keyup', function (e) {
    //     console.dir(index.search($query.value));
    // });
};
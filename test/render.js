/* global describe, it */

var should = require('should');
var paginate = require('../index')({
	// No options passed...
	mongoose: false
});

var PER_PAGE = 10;

// Set up some test data (95 items).
var data = [];
for (var i = 0, l = 95; i < l; i++) {
	data.push(i);
}

describe('Paginate', function() {

	describe('#render', function() {

		it('should return the correct html per the default templates', function(done) {
			var paging = paginate.page(data.length, PER_PAGE, 1);
			var html = paging.render({ baseUrl: '/example' });
			html.should.eql('<div class="pagination"><ul><li><a class="active">1</a></li><li><a href="/example?page=2">2</a></li><li><a href="/example?page=3">3</a></li><li><span class="separator">...</span></li><li><a href="/example?page=10">10</a></li><li><a href="/example?page=2">Next &rsaquo;</a></li></ul></div>');

			done();
		});

        it('should return the correct html per the default templates for baseUrl already containing URL parameters', function(done) {
            var paging = paginate.page(data.length, PER_PAGE, 1);
            var html = paging.render({ baseUrl: '/example?a=1&b=2' });
            html.should.eql('<div class="pagination"><ul><li><a class="active">1</a></li><li><a href="/example?a=1&amp;b=2&amp;page=2">2</a></li><li><a href="/example?a=1&amp;b=2&amp;page=3">3</a></li><li><span class="separator">...</span></li><li><a href="/example?a=1&amp;b=2&amp;page=10">10</a></li><li><a href="/example?a=1&amp;b=2&amp;page=2">Next &rsaquo;</a></li></ul></div>');

            done();
        });

	});

});
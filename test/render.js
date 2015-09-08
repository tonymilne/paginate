var should = require('should');
var paginate = require('../index')({
	// No options passed...
	mongoose: false,
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
			var paging = paginate.page(data.length, PER_PAGE, 2);
			var html = paging.render({ baseUrl: '/example' });
			html.should.eql('<div><ul class="pagination"><li class="previous"><a href="/example?page=1">&lsaquo; Previous</a></li><li><a href="/example?page=1">1</a></li><li class="active"><a>2</a></li><li><a href="/example?page=3">3</a></li><li><a href="/example?page=4">4</a></li><li><span class="separator">...</span></li><li><a href="/example?page=10">10</a></li><li class="next"><a href="/example?page=3">Next &rsaquo;</a></li></ul></div>');

			done();
		});

	});

});

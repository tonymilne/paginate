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

	describe('#page', function() {

		it('should return a pages array and a render function', function(done) {
			var paging = paginate.page(data.length, PER_PAGE, 1);

			paging.pages.should.be.an.instanceOf(Array);
			paging.render.should.be.an.instanceOf(Function);

			done();
		});

		it('should return the right paging when on the first page', function(done) {
			var paging = paginate.page(data.length, PER_PAGE, 1);

			// [1], 2, 3 ... 10.

			paging.pages.should.have.length(5);

			paging.pages[0].should.have.property('page', 1);
			paging.pages[0].should.have.property('isFirst', true);
			paging.pages[0].should.have.property('isCurrent', true);

			paging.pages[1].should.have.property('page', 2);
			paging.pages[1].should.have.property('isNext', true);

			paging.pages[2].should.have.property('page', 3);

			paging.pages[3].should.have.property('isSeparator', true);

			paging.pages[4].should.have.property('page', 10);
			paging.pages[4].should.have.property('isLast', true);

			done();
		});

		it('should return the right paging when on the second page', function(done) {
			var paging = paginate.page(data.length, PER_PAGE, 2);

			// 1, [2], 3, 4 ... 10.

			paging.pages.should.have.length(6);

			paging.pages[0].should.have.property('page', 1);
			paging.pages[0].should.have.property('isFirst', true);
			paging.pages[0].should.have.property('isPrevious', true);

			paging.pages[1].should.have.property('page', 2);
			paging.pages[1].should.have.property('isCurrent', true);

			paging.pages[2].should.have.property('page', 3);
			paging.pages[2].should.have.property('isNext', true);

			paging.pages[3].should.have.property('page', 4);

			paging.pages[4].should.have.property('isSeparator', true);

			paging.pages[5].should.have.property('page', 10);
			paging.pages[5].should.have.property('isLast', true);

			done();
		});

		it('should return the right paging when on a page in the middle of many pages', function(done) {
			var paging = paginate.page(data.length, PER_PAGE, 6);

			// 1 ... 4, 5, [6], 7, 8 ... 10.

			paging.pages.should.have.length(9);
			paging.pages[0].should.have.property('page', 1);
			paging.pages[0].should.have.property('isFirst', true);

			paging.pages[1].should.have.property('isSeparator', true);

			paging.pages[2].should.have.property('page', 4);

			paging.pages[3].should.have.property('page', 5);
			paging.pages[3].should.have.property('isPrevious', true);

			paging.pages[4].should.have.property('page', 6);
			paging.pages[4].should.have.property('isCurrent', true);

			paging.pages[5].should.have.property('page', 7);
			paging.pages[5].should.have.property('isNext', true);

			paging.pages[6].should.have.property('page', 8);

			paging.pages[7].should.have.property('isSeparator', true);

			paging.pages[8].should.have.property('page', 10);
			paging.pages[8].should.have.property('isLast', true);

			done();
		});

		it('should return the right paging when on the second last page', function(done) {
			var paging = paginate.page(data.length, PER_PAGE, 9);

			// 1 ... 7, 8, [9], 10.

			paging.pages.should.have.length(6);
			paging.pages[0].should.have.property('page', 1);
			paging.pages[0].should.have.property('isFirst', true);

			paging.pages[1].should.have.property('isSeparator', true);

			paging.pages[2].should.have.property('page', 7);

			paging.pages[3].should.have.property('page', 8);
			paging.pages[3].should.have.property('isPrevious', true);

			paging.pages[4].should.have.property('page', 9);
			paging.pages[4].should.have.property('isCurrent', true);

			paging.pages[5].should.have.property('page', 10);
			paging.pages[5].should.have.property('isNext', true);
			paging.pages[5].should.have.property('isLast', true);

			done();
		});

		it('should return the right paging when on the last page', function(done) {
			var paging = paginate.page(data.length, PER_PAGE, 10);

			// 1 ... 8, 9, [10].

			paging.pages.should.have.length(5);
			paging.pages[0].should.have.property('page', 1);
			paging.pages[0].should.have.property('isFirst', true);

			paging.pages[1].should.have.property('isSeparator', true);

			paging.pages[2].should.have.property('page', 8);

			paging.pages[3].should.have.property('page', 9);
			paging.pages[3].should.have.property('isPrevious', true);

			paging.pages[4].should.have.property('page', 10);
			paging.pages[4].should.have.property('isCurrent', true);
			paging.pages[4].should.have.property('isLast', true);

			done();
		});

		it('should handle less than the maximum number of pages being displayed (based on window)', function(done) {
			var paging = paginate.page(35, PER_PAGE, 4);

			// 1, 2, 3, [4].

			paging.pages.should.have.length(4);
			paging.pages[0].should.have.property('page', 1);
			paging.pages[0].should.have.property('isFirst', true);

			paging.pages[1].should.have.property('page', 2);

			paging.pages[2].should.have.property('page', 3);
			paging.pages[2].should.have.property('isPrevious', true);

			paging.pages[3].should.have.property('page', 4);
			paging.pages[3].should.have.property('isCurrent', true);
			paging.pages[3].should.have.property('isLast', true);

			done();
		});

	});

});

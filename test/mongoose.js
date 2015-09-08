var should = require('should');
var step = require('step');

var mongoose = require('mongoose');
if (!mongoose.connection.readyState) {
	mongoose.connect('mongodb://localhost/paginate');
}

// Create an Example model (populated in `before` function).
var Schema = mongoose.Schema;
var schema = new Schema({
	value: Number,
	created: Date
});
mongoose.model('example', schema);
var Example = mongoose.model('example');

var paginate = require('../index')({
	// We want the paginate module to patch mongoose!
	mongoose: mongoose,
});

var PER_PAGE = 10;

describe('Paginate', function() {

	before(function(done) {
		step(
			function() {
				Example.remove(this);
			},
			function(err) {
				var group = this.group();

				// Set up some test data (95 items).
				for (var i = 1, l = 95; i <= l; i++) {
					(new Example({
						value: i,
						created: new Date()
					})).save(group());
				}
			},
			done
		);
	});

	describe('#render', function() {

		it('should return the array of example models with a .pagination property', function(done) {
			Example.find()
			.sort({ value: 1 })
			.paginate({ page: 6 }, function(err, examples) {
				if (err) {
					throw err;
				}

				// The examples array will contain those example from page 6,
				// E.g. page 1 has values: 1 ... 10, page 6 has values: 51 ... 60.

				examples.should.have.length(10);
				examples[0].should.have.property('value', 51);
				examples[9].should.have.property('value', 60);

				var paging = examples.pagination;

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
		});

		it('should handle queries with a count of 0 documents', function(done) {
			Example.find({ foobar: 'lorem' })
			.paginate({ page: 1 }, function(err, examples) {
				if (err) {
					throw err;
				}

				// The examples array will contain those example from page 6,
				// E.g. page 1 has values: 1 ... 10, page 6 has values: 51 ... 60.

				examples.should.have.length(0);

				var paging = examples.pagination;

				// 1 ... 4, 5, [6], 7, 8 ... 10.

				done();
			});
		});

	});

});

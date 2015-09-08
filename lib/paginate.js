/*
 * paginate
 * https://github.com/tonymilne/paginate
 *
 * Copyright (c) 2012 Tony Milne
 * Licensed under the MIT license.
 */

var fs = require('fs');
var path = require('path');

var _ = require('lodash');
var jade = require('jade');

var Page = require('./page');

module.exports = function(options) {
	options = options || {};

	var viewsDirectory = path.join(__dirname, '../views');
	var templates = options.templates || {
		pagination: path.join(viewsDirectory, 'pagination.jade'),
		page: path.join(viewsDirectory, 'page.jade'),
		next: path.join(viewsDirectory, 'next.jade'),
		previous: path.join(viewsDirectory, 'previous.jade'),
		separator: path.join(viewsDirectory, 'separator.jade')
	};

	function ascendingSortFn(a, b) {
		if (a > b) {
			return 1;
		}
		if (a < b) {
			return -1;
		}
		return 0;
	}

	function paginate(itemCount, itemsPerPage, current) {
		// Sane defaults.
		itemsPerPage = itemsPerPage || 10;
		current = current || 1;

		var pages = [];
		var currentPage = null;

		var first = 1;
		var last = Math.ceil(itemCount / itemsPerPage);

		var previous = (current - 1);
		var next = (current + 1);

		var window = 2;
		var outerWindow = 1;
		// The outerWindow can be separetely specified by left and right values.
		var left = (typeof options.left === 'undefined') ? outerWindow : options.left;
		var right = (typeof options.left === 'undefined') ? outerWindow : options.right;

		// Populate the pages array with `Page` objects (excluding previous and next).
		// The pages array will contain a `Page` object for the separators too.
		// 1 ... 3 4 [5] 6 7 ... 10

		// The +1 are to account for the separators.
		var leftRange = _.range(first, first + left + 1);
		var rightRange = _.range(last - right, last + 1);
		var innerRange = _.range(current - window, current + window + 1);

		// Sort and filter out any "irrelephant" values (e.g. non unique/out of bounds).
		var ranges = innerRange.concat(leftRange, rightRange);
		ranges.sort(ascendingSortFn);
		ranges = _.unique(ranges, true);
		ranges = _.reject(ranges, function(value) {
			return (value < 1 || value > last);
		});

		// Create a page for each int in the range.
		ranges.forEach(function(value, i) {
			var page = new Page(value, {
				current: current,
				totalPages: last,
				left: left,
				right: right,
				window: window
			});

			// Add a reference to previous/next pages,
			// They remain undefined if they don't exist, e.g. previous for page 1.
			if (i > 0) {
				page.previousPage = pages[i - 1];
				page.previousPage.nextPage = page;
			}
			pages.push(page);

			// Keep a reference to `this` page, if it is the currentPage (for view rendering).
			if (value === current) {
				currentPage = page;
			}
		});

		return {
			pages: pages,
			render: function render(options) {
				// @TODO: Improve on the template options and add view caching.
				var template = fs.readFileSync(templates.pagination);
				var fn = jade.compile(template, {
					filename: templates.pagination
				});

				var html = fn({
					baseUrl: options.baseUrl || '/',
					pages: pages,
					currentPage: currentPage
				});
				return html;
			}
		};
	}

	// Optionally patch `Mongoose.Query' with a paginate function.
	if (typeof options.mongoose === 'undefined' || options.mongoose) {
		try {
			var Query = null;
			if (typeof options.mongoose !== 'undefined' && typeof options.mongoose.Query !== 'undefined') {
				Query = options.mongoose.Query;
			}
			else {
				var mongoose = require('mongoose');
				Query = mongoose.Query;
			}
			Query.prototype.paginate = require('./mongoose-paginate')(paginate);
		}
		catch (exception) {
			console.error('Could not patch Mongoose, due to the following exception:');
			console.error(exception);
		}
	}

	// Expose the public facing module functionality.
	return {
		page: paginate,
	};
};

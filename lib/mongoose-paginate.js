/**
 * Mongoose Paginate
 * A Mongoose Query paginate function that can be patched onto `Mongoose.Query`.
 */

module.exports = function(paginate) {
	return function(options, callback) {
		var query = this;
		var model = query.model;

		model.count(query._conditions, function(err, count) {
			if (err) {
				return callback(err);
			}

			// Return early if count is 0 to avoid the extra MongoDB query.
			if (count === 0) {
				return process.nextTick(preCallbackHandler);
			}

			var perPage = options.perPage || 10;
			var page = parseInt(options.page, 10) || 1;
			var last = Math.ceil(count / perPage);

			// Clamp the page to positive numbers within the range.
			if (page < 0) {
				page = 1;
			}
			if (page > last) {
				page = last;
			}

			var skip = (page - 1) * perPage;

			query
			.skip(skip)
			.limit(perPage);

/*
			// @NOTE: Ideally we could support query chaining,
			// but it doesn't seem possible unless we tap into the exec/execFind functions too.
			if (typeof callback === 'undefined') {
				return query;
			}
			else { ... }
*/
			query.exec(preCallbackHandler);

			/**
			 * The preCallbackHandler adds pagination to the models collection and then calls back.
			 * Used by both query callback and if we are returning early due to a 0 count.
			 */
			function preCallbackHandler(err, models) {
				if (err) {
					return callback(err);
				}
				models = models || [];

				// Add the pagination property to the returned array of models.
				models.pagination = paginate(count, perPage, page);

				callback(null, models);
			}
		});
	};
};
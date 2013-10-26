# paginate

Pagination. Especially useful with Mongoose + Express/Jade.

## Getting Started
Install the module with: `npm install paginate`

The paginate plugin returns a function that accepts an options object.
Call this to get access to the module functionality itself. E.g:

```javascript
var paginate = require('paginate')({
	// options go here...
});
```

## Documentation

_(Coming soon)_

## Examples

### Basic (non Mongoose) usage

```javascript
var paginate = require('paginate')();
var data = new Array(95);

var PER_PAGE = 10;
var currentPage = 6;

var pagination = paginate.page(data.length, PER_PAGE, currentPage);
var html = pagination.render({ baseUrl: '/example' });
```

### Mongoose + Express usage

```
var mongoose = require('mongoose');
var paginate = require('paginate')({
	mongoose: mongoose
});

// @NOTE: Assuming a post model has been created and registered...
var Post = mongoose.model('posts');

// An express route action:
app.get('/posts', function(req, res, next) {
	Post.find()
	.paginate({ page: req.query.page }, function(err, posts) {
		res.render('posts/index', {
			posts: posts
		})
	});
});
```

optionally, you can control the paging size for mongoose using the following:

```
Post.find().paginate({ page: req.query.page, perPage: 5 }, callback);
```

Then in the posts/index template, you could include the html generated from posts.pagination.render().
E.g. in Jade, this might look like:
```
!= posts.pagination.render({ baseUrl: '/posts })
```
## Persisting Additional QueryString Parameters
For cases where you might need to persist other values while paging, you can pass the req.query object forward:
```
Post.find().paginate({ page: req.query.page, query: req.query }, function(err, posts){
...
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/cowboy/grunt).

## Release History

### 0.1.2

- ADDITION: Ability to persist additional querystring params.

### 0.1.1

- FIX: Queries with 0 results caused an invalid skip value to throw an error.
- FIX: Typo in the readme params to query.

## License
Copyright (c) 2012 Tony Milne
Licensed under the MIT license.

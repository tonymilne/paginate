/**
 * Represents a page.
 */

function Page(page, options) {
	this.page = page;

	this.isFirst = (this.page === 1);
	this.isLast = (this.page === options.totalPages);
	this.isCurrent = (this.page === options.current);
	this.isPrevious = (this.page === options.current - 1);
	this.isNext = (this.page === options.current + 1);

	this.inLeftOuter = (this.page <= options.left);
	this.inRightOuter = (options.totalPages - this.page < options.right);
	this.inInner = Math.abs(options.current - this.page) <= options.window;

	this.isSeparator = !(this.inLeftOuter || this.inRightOuter || this.inInner);
}

module.exports = Page;
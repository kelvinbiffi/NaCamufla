var gulp = require('gulp-param')(require('gulp'), process.argv),
	concat = require('gulp-concat'),
	less = require('gulp-less'),
	path = require('path'),
	del = require('del'),
	util = require('gulp-util'), 
	ftp = require('gulp-ftp'),
	jshint = require('gulp-jshint');

//Routes for archives types
var routes = {
	less : ['css/*.less'],
};

//Clean CSS Files
gulp.task('cleanCSS', function() {
	return del(['css/main.css']);
});

//Concat LESS files
gulp.task('conCSS',['cleanCSS'], function(){
	return gulp.src(routes.less)
	.pipe(concat('style.less'))
	.pipe(gulp.dest('css'));
});

//Building LESS files in CSS files
gulp.task('buildCSS', function() {
	return gulp.src(routes.less)
	.pipe(less({
		paths: [ path.join(__dirname, 'less', 'includes') ]
	}))
	.pipe(gulp.dest('css'));
});

//Default Gulp Action Watch buildJS and buildCSS
gulp.task('default', ['buildCSS'], function(){
	gulp.watch(routes.scripts, ['buildJS']);
	gulp.watch(routes.less, ['buildCSS']);
});

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
	scripts: ['js/*.js'],
	less : ['css/*.less'],
	images: 'images/*.*'
};

//FTP configuration
var configFTP = function(path){
	return {
		host: 'ftp.xxx.com',
		user: 'xxx',
		pass: 'xxx',
		remotePath: 'xxx/' + path
	};
};

//Clean CSS Files
gulp.task('cleanCSS', function() {
	return del(['css/*.css']);
});

//varify Syntax Code Errors
gulp.task('JSCheck',function(){
	return gulp.src(routes.scripts)
	.pipe(jshint())
	.pipe(jshint.reporter('default'));
});

//Building LESS files in CSS files
gulp.task('buildCSS',['cleanCSS'], function() {
	return gulp.src(routes.less)
	.pipe(less({
		paths: [ path.join(__dirname, 'less', 'includes') ]
	}))
	.pipe(gulp.dest('css'));
});

//Publish Images Files
gulp.task('pubChat', function(arch){
	return gulp.src((arch === null ? 'chat/*' : 'chat/'+arch))
	.pipe(ftp(configFTP('ws')))
	.pipe(util.noop());
});

//Publish Images Files
gulp.task('pubWS', function(arch){
	return gulp.src((arch === null ? 'ws/*' : 'ws/'+arch))
	.pipe(ftp(configFTP('ws')))
	.pipe(util.noop());
});

//Publish Images Files
gulp.task('pubSounds', function(arch){
	return gulp.src((arch === undefined ? 'sounds/*' : 'sounds/'+arch))
	.pipe(ftp(configFTP('sounds')))
	.pipe(util.noop());
});
gulp.task('deb', function(tt){
	console.log(tt);
});

//Publish Images Files
gulp.task('pubImg', function(arch){
	return gulp.src((arch === null ? 'images/*' : 'images/'+arch))
	.pipe(ftp(configFTP('images')))
	.pipe(util.noop());
});

//Publish CSS Files
gulp.task('pubCSS', function(){
	return gulp.src('css/*.css')
	.pipe(ftp(configFTP('css')))
	.pipe(util.noop());
});

//Publish JS Files Had Build
gulp.task('pubJS', function(){
	return gulp.src('js/*.js')
	.pipe(ftp(configFTP('js')))
	.pipe(util.noop());
});

//Publish JS Dependencies Files
gulp.task('pubHTML', function(){
	return gulp.src('*.html')
	.pipe(ftp(configFTP('')))
	.pipe(util.noop());
});

//Publish All Source Files
gulp.task('publish', ['pubImg','pubCSS','pubJS','pubWS','pubHTML', 'pubSounds'], function(){
	return gulp.src('*')
	.pipe(ftp(configFTP('')))
	.pipe(util.noop());
});

//Default Gulp Action Watch buildJS and buildCSS
gulp.task('default', ['buildJS','buildCSS'], function(){
	gulp.watch(routes.scripts, ['buildJS']);
	gulp.watch(routes.less, ['buildCSS']);
});

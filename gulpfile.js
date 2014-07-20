var gulp = require('gulp'),
    sass = require('gulp-sass'),
    gutil = require('gulp-util'),

    // Webserver & livereload reqs
    embedlr = require('gulp-embedlr'),//        Embeds livereload snippet in HTML files
    refresh = require('gulp-livereload'),//     Livereload server
    lrserver = require('tiny-lr')(),//          Background-friendly tiny livereload
    express = require('express'),//             Local webserver dependency, MVC framework
    livereload = require('connect-livereload'),// Middleware for livereload
    livereloadport = 35728,
    serverport = 5000;
    var server = express();// Set up an express server (but not starting it yet)

// Dev Task
gulp.task('dev', function() {
  // Start webserver
  server.listen(serverport);
  // Start live reload
  lrserver.listen(livereloadport);
  // Run the watch task, to keep taps on changes
  gulp.run('watch');
});

// Watch Task
gulp.task('watch', function() {

  // Watch component Sass
  gulp.watch(['app/components/**/*.scss'], [
    'component'
  ]);

  // Watch component HTML
  gulp.watch(['app/components/**/*.html', 'app/components/index.html'], [
    'component'
  ]);

});

// Component compile
gulp.task('component', function () {
  gulp.src('app/components/index.html')
    .pipe(gulp.dest('dist/components'));

  gulp.src('app/components/**/*.scss')// Process component SCSS
    .pipe(sass())
    .pipe(gulp.dest('dist/components/'));

  gulp.src('./app/components/**/*.html')// Process component HTML
    .pipe(gulp.dest('dist/components/'));

  gulp.src('app/components/**/*.js')// Process component JS
    .pipe(gulp.dest('dist/components/'));

  // .pipe(refresh(lrserver));
});

// webserver with livereload (run)
server.use(livereload({port: livereloadport}));// Add live reload
server.use(express.static('dist/components/refills'));// Use our 'dist' folder as rootfolder
// Because I like HTML5 pushstate .. this redirects everything back to our index.html
server.all('/*', function(req, res) {
    res.sendfile('refills.html', { root: 'dist/components/refills' });
});

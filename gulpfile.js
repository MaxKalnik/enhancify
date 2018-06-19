var gulp = require('gulp'),
    stylus = require('gulp-stylus'),
    autoprefixer = require('autoprefixer-stylus'),
    cssmin = require('gulp-cssmin'),
    rename = require('gulp-rename'),
    jsmin = require('gulp-jsmin'),
    imagemin = require('gulp-imagemin'),
    concat = require('gulp-concat'),
    changed = require('gulp-changed'),
    clean = require('gulp-clean'),
    livereload = require('gulp-livereload'),
    browsersync = require('browser-sync'),
    jade = require('gulp-jade'),
    inlinesource = require('gulp-inline-source');



var dev_path = {
    jade: 'src/partials',
    html: 'src/',
    styl: 'src/styl/',
    js: 'src/js/',
    fonts: 'src/fonts/',
    img: 'src/images/',
    svg: 'src/svg/'
};

var build_path = {
    html: 'build/',
    css: 'build/css/',
    js: 'build/js/',
    fonts: 'build/fonts/',
    img: 'build/images/',
    svg: 'build/svg/'
};



gulp.task('inlineSVG', function () {
    return gulp.src(build_path.html + '*.css')

        .pipe(gulp.dest(build_path.html));
});



gulp.task('stylus', function () {
    return gulp.src([
            dev_path.styl + '*.css',
            dev_path.styl + 'virtual/*.css',
            dev_path.styl + 'index.styl'
        ])
        .pipe(stylus({
            use: [autoprefixer({browsers: ['last 2 versions']})],
            compress: true
        }))
        .on('error', console.log)
        .pipe(concat('style.css'))
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(build_path.html))
        .pipe(browsersync.reload({
            stream: true
        }));
});


gulp.task('js', function () {
    return gulp.src([
            dev_path.js + '**/*'
        ])
        .on('error', console.log)
        .pipe(concat('script.js'))
        .pipe(jsmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(build_path.js))
        .pipe(browsersync.reload({
            stream: true
        }));
});

// gulp.task('js', function () {
//     return gulp.src([
//             dev_path.js + '**/*'
//         ])
//         .on('error', console.log)
//         .pipe(gulp.dest(build_path.js))
//         .pipe(browsersync.reload({
//             stream: true
//         }));
// });

gulp.task('jade', function(){
    gulp.src([dev_path.html + '*.jade'])
      .pipe(jade())
      .pipe(gulp.dest('./build/'))
});


gulp.task('images', function () {
    return gulp.src([dev_path.img + '**/*'])
        .pipe(changed(build_path.img))
        .pipe(imagemin())
        .pipe(gulp.dest(build_path.img))
        .pipe(browsersync.reload({
            stream: true
        }));
});


gulp.task('copyhtml', function () {
    return gulp.src([dev_path.html + '*.html'])
        .pipe(changed(build_path.html))
        .pipe(gulp.dest(build_path.html));
});

gulp.task('browsersync-server', function () {
    browsersync.init(null, {
        server: {
            baseDir: './build/'
        },
        open: false,
        notify: false
    });
});


gulp.task('inlinesource', function () {
    var options = {
        compress: false
    };
    return gulp.src(build_path.html + '*.html')
        .pipe(inlinesource(options))
        .pipe(gulp.dest(build_path.html));
});

gulp.task('clean', function () {
    return gulp.src('build', {read: false})
        .pipe(clean());
});

gulp.task('watch', function () {
    gulp.watch(dev_path.styl + '**/*.styl', ['stylus']);
    gulp.watch([dev_path.img + '**/*'], ['images']);
    gulp.watch([dev_path.html + '*.html'], ['copyhtml']);
    gulp.watch([dev_path.jade + '**/*.jade'], ['jade']);
    gulp.watch(dev_path.js + '**/*.js', ['js']);
    livereload.listen();
    gulp.watch(['src/**']).on('change', livereload.changed);
});

gulp.task('default', [
    'jade', 'copyhtml', 'js', 'stylus', 'images', 'browsersync-server', 'watch'
]);

gulp.task('prod', ['clean', 'copyhtml','stylus', 'images', 'js', 'inlinesource']);

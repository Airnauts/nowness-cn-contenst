const gulp = require('gulp');
const postcss = require('gulp-postcss');
const sass = require('gulp-sass');
const autoprefixer = require('autoprefixer');
const concat = require('gulp-concat');
const nunjucksRender = require('gulp-nunjucks-render');
const babel = require('gulp-babel');
const header = require('gulp-header');
const footer = require('gulp-footer');
const gulpSequence = require('gulp-sequence')
const cssnano = require('cssnano');
const rename = require('gulp-rename');

const processors = [
  autoprefixer({
    browsers: ['last 2 versions']
  }),
  cssnano()
]

const pathTo = {
  scss: './src/',
  js: './src/',
  css: './src/'
}

const distFor = {
  build: './build/'
}

gulp.task('styles', () => {
  gulp.src(pathTo.scss + 'index.scss')
      .pipe(sass())
      .pipe(postcss(processors))
      .pipe(rename('styles.css'))
      .pipe(gulp.dest(distFor.build));
})

gulp.task('babel', () => {
  gulp.src(pathTo.js + 'index.js')
      .pipe(babel({
          presets: ['@babel/env']
      }))
      .pipe(rename('scripts.js'))
      .pipe(gulp.dest(distFor.build))
})

gulp.task('concat', () => {
  setTimeout(() => {

    gulp.src([distFor.build + 'styles.css', distFor.build + 'scripts.js'])
      .pipe(gulp.dest(distFor.build));
  }, 1000);
})

gulp.task('build', function (cb) {
  gulpSequence(['styles', 'babel'], 'concat')(cb)
});


gulp.task('watch:build', () => {
  gulp.watch([pathTo.scss + '**/*.scss', pathTo.js + '**/*.js'], ['build'])
      .on('change', event => {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
      });
})

gulp.task('default', ['build',
                      'watch:build'
                     ]);
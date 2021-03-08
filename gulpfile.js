const { src, dest, watch, parallel, series } = require('gulp');
const scss = require('gulp-sass'),
    sync = require('browser-sync').create();
    ttf2woff = require('gulp-ttf2woff'),
    ttf2woff2 = require('gulp-ttf2woff2'),
    fileinclude = require('gulp-file-include'),
    imagemin = require('gulp-imagemin'),
    uglify = require('gulp-uglify');    
    fs = require('fs');

function uglifyJs() {
    return src('app/js/draft/*.js').pipe(uglify()).pipe(dest('app/js'));
}    

function imagesCompressed() {
    return src('app/_img/*{jpg,png,svg}').pipe(imagemin()).pipe(dest('app/img'));
}
    
const fileInclude = function () {
     return src(['app/pages/**/*.html']).pipe(fileinclude({
        'prefix' :  '@@',
        'basepath' : '@file'
     })).pipe(dest('app'));
};

function convertStyles() {
    return src('app/scss/*.scss').pipe(scss()).pipe(dest('app/css'));
}

function convertFonts() {
    src(['app/fonts/*.ttf']).pipe(ttf2woff()).pipe(dest('app/fonts/'));
    return src(['app/fonts/*.ttf']).pipe(ttf2woff2()).pipe(dest('app/fonts/'));
}

function watchFiles() {
    watch('app/scss/**/*.scss',convertStyles);
    watch('app/**/*.html').on('change',sync.reload);
    watch('app/css/*.css').on('change',sync.reload);
    watch('app/fonts/*.ttf',series(convertFonts, fontsStyle));
    watch('app/_img', imagesCompressed);
}

function browserSync() {
    sync.init({
        server: {
            baseDir: "app",
            open: "local"
        }
    });
}

exports.convertStyles = convertStyles;
exports.watchFiles = watchFiles;
exports.browserSync = browserSync;

exports.convertFonts = convertFonts;
exports.fontsStyle = fontsStyle;

exports.fileInclude = fileInclude;

exports.imagesCompressed = imagesCompressed;

exports.uglifyJs = uglifyJs;

exports.default = parallel(fileInclude,convertStyles,browserSync,watchFiles, series(convertFonts,fontsStyle));

/* create folders*/
function createFolders() {
    return src('*.*',{ read: false}).pipe(dest('newfolder/scss')).pipe(dest('./newfolder/js')).pipe(dest('./newfolder/img')).pipe(dest('./newfolder/fonts'));
}

const cb = () => {};

/* Шрифты*/
let srcFonts = "app/scss/_fonts.scss";
let appFonts = "app/fonts";

function fontsStyle() {
    let file_content = fs.readFileSync(srcFonts);

    fs.writeFile(srcFonts, "", cb);
    fs.readdir(appFonts, function (err, items) {
        if (items) {
            let c_fontname;
            for (let i = 0; i < items.length; i++) {
                let fontname = items[i].split(".");
                fontname = fontname[0];
                if (c_fontname != fontname) {
                    fs.appendFile(
                        srcFonts,
                        '@include font-face("' +
                        fontname +
                        '", "' +
                        fontname +
                        '", 400);',
                        cb
                    );
                }
                c_fontname = fontname;
            }
        }
    });
}

exports.createFolders = createFolders;

/* Build*/
function moveHtml() {
    return src('app/*.html').pipe(dest('dist'));
}

function moveCss() {
    return src('app/css/*.css').pipe(dest('dist/css'));
}

function moveJs() {
    return src('app/js/*.js').pipe(dest('dist/js'));
}

function moveImg() {
    return src('app/img/*').pipe(dest('dist/img'));
}

exports.moveHtml = moveHtml;
exports.moveCss = moveCss;
exports.moveJs = moveJs;
exports.moveImg = moveImg;

exports.build = series(moveHtml,moveCss,moveJs,moveImg);

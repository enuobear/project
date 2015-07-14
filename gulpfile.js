var os      = require('os'),
	gulp    = require('gulp'),
	shell   = require('gulp-shell'),
	clean   = require('gulp-clean'),
	sass    = require('gulp-sass'),
	connect = require('gulp-connect'),
    zip     = require('gulp-zip'),
    plumber = require('gulp-plumber');

var task = {
	sass: function(type) {

		gulp.src('./source/themes/all.scss')
            .pipe(plumber())
			.pipe(sass())
			.pipe(gulp.dest('./'+ type +'/themes/'));

	},
	
	move: function() {

		gulp.src([
                './source/**/*.html',
                './source/**/*.js',
				'./source/**/*.jpg',
				'./source/**/*.png'
			])
			.pipe(gulp.dest('./build/'));

	},

	connect: function(type) {

        var version = os.platform(),
        	url = '';

        connect.server({
            root: type,
            port: '9999',
            livereload: true
        });

        switch (version) {
            case 'win32':
                url = 'start http://localhost:9999';
                break;
            case 'darwin':
                url = 'open http://localhost:9999';
                break;
        }

        gulp.src('')
            .pipe(shell(url));
            
    },

    watch: function() {
    	var self = this;

    	gulp.watch([
    		'./source/**/*.scss'
    	], function(){
    		self.reload();
    	})
    },

    reload: function() {
    	var self = this;

    	self.sass('source');
    }
};


gulp.task('clean', function() {
	var strpath = [
			'./build/'
		];

	return gulp.src(strpath, {read: false})
		.pipe(clean());

});


gulp.task('run', function() {
	task.sass('source');
	task.connect('source');
	task.watch();
});


gulp.task('build', ['clean'], function() {
    task.sass('build');
    task.move();
});


gulp.task('default', function(){
    task.connect('build');
});


gulp.task('zip', function () {
    var d = new Date(),
        y = d.getFullYear().toString(),
        m = d.getMonth(),
        t = d.getDate().toString(),
        h = d.getHours().toString(),
        s = d.getMinutes();

    if (m <= 9) {
        m++;
        m = '0' + m;
    }

    if (t <= 9) {
        t = 0 + t;
    }

    var version = y + m + t + '-' + h + '-' + s;

    return gulp.src('build/**/*')
        .pipe(zip(version+'.zip'))
        .pipe(gulp.dest('build'));
});

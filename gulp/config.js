module.exports = {
  base : {
    src   : 'src',
    dest  : 'public/'
  },

  js : {
    src   : 'js',
    dest  : './assets/js',
    watch : 'src/**/*.js',
    files : ['src/assets/js/index.js'],
    babelify:{
      presets: ['@babel/preset-env'],
      plugins: [
        [
          'babel-plugin-root-import',
          {
            rootPathSuffix: 'src/assets/js',
          },
        ],
        [
          'babel-plugin-inline-import',
          {
            extensions: ['.vert', '.frag'],
          },
        ],
      ],
    }
  },

  copy: {
    src : [
      'src/**/*',
      '!src/**/base',
      '!src/**/include',
      '!src/**/include/**',
      '!src/**/css/**',
      '!src/**/css/**/*',
      '!src/**/js/**/*',
      '!src/**/js/**/*',
      '!src/_templete',
      '!src/_templete/**',
      '!src/**/*.coffee',
      '!src/**/*.jade',
      '!src/**/*.{sass,scss}',
      '!src/**/*.pug',
      '!src/common',
      '!src/common/**/*',
      '!src/**/*.{gif,jpeg,jpg,png,svg,webp}'
    ],
    watch : ['src/**/images/**','src/images/**'],
    dest : './'
  },

  css : {
    src : [
      'src/**/*.scss',
      '!src/**/_*.scss'
    ],
    watch : 'src/**/*.{sass,scss}',
    dest  : './',
    sass  : { indentedSyntax: false },  // Enable .sass syntax (.scss still works too)
    autoprefixer: { browsers: ["last 3 versions", "Android > 4.1", "iOS > 7"]},
    extensions: ['scss', 'sass', 'css']
  },

  html : {
    src   : ['src/**/*.html', '!src/**/include/**'],
    watch : ['src/**/*.html', 'src/**/include/*.html'],
    dest  : ''
  },

  pug : {
    basedir: 'src',
    src   : ['src/**/*.pug', '!src/**/common/**'],
    watch : ['src/**/*.pug', 'src/common/*.pug'],
    dest  : ''
  },

  imagemin: {
    pngquant: {
        quality: '60-80'
    },
    svgo: [
        {removeViewBox: false},
        {removeUselessStrokeAndFill: false},
        {cleanupIDs: false},
        {removeHiddenElems: false}
    ],
    src: 'src/**/*.{gif,jpeg,jpg,png,svg,webp}',
    watch: 'src/**/*.{gif,jpeg,jpg,png,svg,webp}',
    dest: 'public/'
  },

  svgstore: {
    src: 'src/assets/images/symbol/*.svg',
    watch: 'src/assets/images/symbol/*.svg',
    dest: 'src/assets/images',
    destFileName: 'symbols'
  }
}

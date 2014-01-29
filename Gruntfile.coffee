module.exports = (grunt)->
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')

    compass:
      sp:
        options:
          config: 'config_sp.rb'

    uglify:
      build_pc:
        files: 'pub/js/history.min.js': ['pub/js/history.js']

    watch:
      css_sp:
        files: ['sp/sass/**/*.scss']
        tasks: ['compass:sp']
        options:
          atBegin: true
          spawn: false
  })

  grunt.loadNpmTasks('grunt-contrib-compass')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-contrib-uglify')

  grunt.registerTask('default', ['compass'])
  grunt.registerTask('pc', ['compass:pc'])
  grunt.registerTask('sp', ['compass:sp'])
  grunt.registerTask('pc-dev', ['compass:dev_pc'])
  grunt.registerTask('sp-dev', ['compass:dev_sp'])
  grunt.registerTask('watch-pc', ['watch:css_pc'])
  grunt.registerTask('watch-sp', ['watch:css_sp'])



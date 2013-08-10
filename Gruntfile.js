'use strict';

module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    jstatic: {
      options: {
        linkPrefix: "http://azeemarshad.in/",
        extraContext: {
            disqus: {
                shortname: "azeemarshad",
                developer: 0
            }
        },
        swig: {
            root: ["./", "src/templates"],
            layout: "default.html"
        }
      },
      site: {
        files: [
            {src: ['src/content/index.html'], dest: "site", formatters: {type: "swig", layout: "simple.html"}},
            {src: ['src/content/*.html', '!src/content/index.html'], dest: "site"},
            {src: ['src/content/*.md'],   dest: "site", formatters: ["markdown", "swig"]},

            {src: ['src/content/posts/index.html'], dest: "site/posts"},
            {src: ['src/content/posts/rss.xml'], dest: "site/posts", outExt: ".xml",
             formatters: {type: "swig", layout: null}},
            {src: ['src/content/posts/*.md'],   dest: "site/posts", 
             preprocessors: ["yafm", "summary"],
             formatters: ["markdown", {type: "swig", layout: "posts.html"}] }
        ],
      }
    },
    clean: {
      site: ['site/*'],
    },
    copy: {
        site: {
            files: [
                {expand: true, cwd:"src/", src:["assets/**/*", "images/**/*"], dest: "site"},
                {src:"src/CNAME", dest: "site/CNAME"}
            ]
        }
    },
    watch: {
      site: {
        files: "src/**/*",
        tasks: ["default"]
      }
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('jstatic');

  grunt.registerTask('default', ["clean", "jstatic", "copy"]);
  grunt.registerTask('w', ["default", "watch"]);
};

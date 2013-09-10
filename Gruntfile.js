'use strict';

module.exports = function(grunt) {
  var jstatic = require('../jstatic/lib/jstatic.js');

  // Project configuration.
  grunt.initConfig({
    jstatic: {
      options: {
        extraContext: {
            meta: {
                title: "Azeem Arshad",
                site_link: "http://azeemarshad.in",
                description: "Azeem Arshad's Personal Pages"
            },
            disqus: {
                shortname: "azeemarshad",
                developer: 0
            }
        },
        permalink: {
            linkPrefix: "http://azeemarshad.in/",
        },
        swig: {
            layout: "src/templates/default.html"
        }
      },
      site: {
        files: [
            {
                src: ['src/content/index.html'],
                dest: "site",
                generators: [
                    "yafm",
                    "permalink",
                    {type: "swig", layout: "src/templates/simple.html"}
                ],
                depends: ["blog_posts", "linklogs", "linkPages"]
            },
            {
                src: ['src/content/*.html', '!src/content/index.html'], 
                dest: "site"
            },
            {
                src: ['src/content/*.md'],
                dest: "site",
                generators: ["yafm", "permalink", "markdown", "swig"]
            },
            {
                src: ['src/content/posts/index.html'], 
                dest: "site/posts",
                depends: ["blog_posts"]
            },
            {
                src: ['src/content/posts/rss.xml'], 
                dest: "site/posts", 
                outExt: ".xml",
                generators: [{type: "swig", layout: null}],
                depends: ["blog_posts"]
            },
            {
                name: "blog_posts",
                src: ['src/content/posts/*.md'],   
                dest: "site/posts", 
                generators: [
                    "yafm", 
                    "unpublish",
                    "permalink", 
                    "summary", 
                    "markdown", 
                    {type: "swig", layoutOnly: true, layout: "src/templates/posts.html"}
                ]
            },
            {
                name: "linklogs",
                src: "src/content/links/*.md",
                generators: [
                    {type: "yafm", multi: true},
                    {
                        // create a slug
                        type: "inlinegen",
                        iter: function(entry) {
                            entry.slug = entry.title
                                              .toLowerCase()
                                              .replace(/ /g,'_')
                                              .replace(/[^\w_]+/g,'')
                                              .slice(0, 50);
                        }
                    },
                    {
                        type: "permalink",
                        link: function(entry, prefix, pathElems, outExt) {
                            var month = jstatic.utils.monthNames[entry.publishTime.getMonth()].slice(0,3);
                            return prefix + "links/" + month + entry.publishTime.getFullYear() + outExt + "#" + entry.slug;
                        }
                    },
                    "markdown", 
                ]
            },
            {
                name: "linkPages",
                src: "src/content/links/index.html",
                dest: "site/links",
                depends: ["linklogs"],
                generators: [
                    "yafm", 
                    {
                        type:"paginator", 
                        pivot: "linklogs", 
                        pageBy: function(entry) {
                            var time = entry.publishTime;
                            return new Date(time.getFullYear(), time.getMonth());
                        }
                    },
                    {
                        type: "destination", 
                        dest: function(entry, outExt) {
                            if(entry.page == 1) {
                                return "index" + outExt;
                            } else {
                                var month = jstatic.utils.monthNames[entry.page.getMonth()].slice(0,3);
                                return month + entry.page.getFullYear() + outExt;
                            }
                        }
                    },
                    "permalink",
                    {
                        type: "sequencer",
                        sortBy: "page",
                        reverse: true
                    },
                    "swig", 
                ]
            },
            {
                src: ['src/content/links/rss.xml'], 
                dest: "site/links", 
                outExt: ".xml",
                generators: [{type: "swig", layout: null}],
                depends: ["linklogs"]
            },
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
                {src:"src/CNAME", dest: "site/CNAME"},
                {src:"src/foaf.rdf", dest: "site/foaf.rdf"}
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
  //grunt.loadNpmTasks('jstatic');

  grunt.loadTasks('../jstatic/tasks');

  grunt.registerTask('default', ["clean", "jstatic", "copy"]);
  grunt.registerTask('w', ["default", "watch"]);
};

---
title: Introducing jstatic
published: false
---

[jstatic](https://github.com/azeem/jstatic) is static html site generation task for [grunt](http://gruntjs.com/). With jstatic i am trying to realize a generic pattern for static site generation tasks, a simple model thats easy to understand, flexible and easily extensible. Like [assemble](https://github.com/assemble/assemble), jstatic is also designed as a grunt task. This is rather convenient, because Grunt provides excellent facilities for lot of the boilerplates tasks (minification, copying assets etc.). This also makes easier to integrate jstatic for documentation or project pages generation in projects that uses grunt. I have been using jstatic to generate this site, and i am quite pleased with the results. Here i'll discuss some of the basics of it.

Flexible static site generation
-------------------------------

In my experience, if a generation tool supports any case of the following types of conversion arity, then it can cater to a huge variety of static page generation tasks.

1. *One to One* - This is the simplest case, where one source file is manipulated, (markdowned, templated etc.) and then written to one destination file. Most typical cases like article pages, blog entries, landing pages etc. fall into this category

2. *Many to One* - Here, contents from multiple files are aggregated into a single destination file. Blog home pages, Article archives, RSS feeds etc. fall into this category.

3. *One to Many* - A single source file producing multiple files. Simplest example for this case is pagination. A single, very long, markdown article may need to be generated in multiple pages.

4. *Many to Many* - I have only so far encountered this as a combination of 2 and 3, specifically, paginated aggregation pages. eg. paginated blog archives.

jstatic basics
--------------

The basic concept of jstatic is as follows

1. Every *Task* consists of one or more named Flows.
2. A *Flow* is a conversion for a set of source files, optionally terminating in a disk write. The conversion semantics is specified using a series of Generator applications.
3. A *Generator* is a function that takes a sequence of File Entries (dictionary containing file details) and returns a manipulated sequence of entries.
4. Any Flow can have dependency on other flows. The final file entry sequence of the dependency flows are made available to Generators of the current flow. Dependency, thus, also mandates an ordering for exection of Flows.

The following sections show how jstatic can handle different conversions. Check [Grunt documentation](http://gruntjs.com/getting-started) for complete documentation on writing Gruntfile.js configs. 

One to One
----------

```
                      ______     ___________     __________     ______
                     |      |   |           |   |          |   |      |
src/content/*.md ----| yafm |---| permalink |---| markdown |---| swig |--- site/*.html
                     |______|   |___________|   |__________|   |______|

```

```js
grunt.initConfig({
    jstatic: {
        mySite: {
            files: [
            	{
                    src: "src/content/*.md",
                    dest: "site",
                    name: "root_files",
                    generators: [
                        "yafm", "permalink", "markdown",
                        {type:"swig", layout: "src/template/layout.html"}
                    ]
                }
            ]
        }
    }
});
```

The grunt [files array](http://gruntjs.com/configuring-tasks#files-array-format) structure makes a convenient way to represent Flows in jstatic. The additional fields specify the flow details. *name* is an optional unique string that identifies the flow. *generators* is an array of generators to be applied in this flow.

This flow starts out with a sequence of all markdown files in the `src/content` directory. The files are then sequentially passed through the generators. *yafm* extracts [yaml front matter](http://jekyllrb.com/docs/frontmatter/) metadata and puts back the remaining content. *permalink* generates a permanent link url for the file. *markdown* applies markdown processor on the file contents. And finally *swig* sends the file contents to a swig template. The contents of each file is then written at the destination.

Many to One
-----------
```js
grunt.initConfig({
    jstatic: {
        mySite: {
            files: [
                {
                    src: "src/content/index.html",
                    dest: "site",
                    name: "index",
                    depends: ["articles"],
                    generators: ["swig"]
                },
            	{
                    src: "src/content/*.md",
                    name: "articles",
                    generators: ["yafm", "markdown"]
                }
            ]
        }
    }
});
```

There are two flows in this example. Our intention is to generate an index.html file which contains a list of articles. The "index" flow specifies that it has dependency on the "articles" flow. (Note that the "articles" flow doesnt have destination ie. no files are written, the flow runs nonetheless and the result is available). Because of the dependency structure, jstatic runs "articles" flow before the "index" flow. During the "index" flow, the list of files from "articles" flow is made available to the generators. The swig generator makes dependency results available inside the templates. Thus index.html written as follows, can generate a list of articles (many to one).

```
<ul>
{% for article in articles %}
    <li>{{ article.title }} {{ article.content }}</li>
{% endfor %}
</ul>
```

The many to one mapping is possible here because the entire result of one flow available to each file in another flow.

One to Many
-----------
```js
grunt.initConfig({
    jstatic: {
        mySite: {
            files: [
                {
                    src: "src/content/index.html",
                    dest: "site",
                    name: "index",
                    depends: ["links"],
                    generators: [
                        {type: "paginator", pivot: "links", pageSize: 5},
                        "swig"
                    ]
                },
            	{
                    src: "src/content/links.md",
                    name: "links",
                    generators: [{type: "yafm", multi: true}, "markdown"]
                }
            ]
        }
    }
});
```

This case is very similar to the previous case. Here we use yafm multi mode, this treats the file as a concatenation of multiple files each with separate front matter. yafm splits the file into multiple files one for each front matter entry. The "index" flow uses *paginator*, this generator uses the length of a dependency result to generate clones of each page in the current flow (as many clones as the number of pages required to accomodate the length). Each clone will have a page index property. Inside the swig template, this page index can be used to obtain a slice of the dependency result for that page and generate html for it.

One to Many is possible here because generators can modify the size of sequence of file entries that is passed to the next generator.

Many to Many
------------

This is the case where, in the previous example, the "links" flow would take multiple files instead of one eg. src: `"src/content/*.md"`
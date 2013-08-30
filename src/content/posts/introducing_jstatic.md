---
title: Introducing jstatic
published: false
---

[jstatic](https://github.com/azeem/jstatic) is static html site generation task for [grunt](http://gruntjs.com/). With jstatic i am trying to realize a generic pattern for static site generation tasks, a simple model thats easy to understand, flexible and easily extensible. Like [assemble](https://github.com/assemble/assemble), jstatic is also designed as a grunt task. This is rather convenient, because Grunt provides excellent facilities for lot of the boilerplates tasks (minification, copying assets etcetera.). This also makes easier to integrate jstatic for documentation or project pages generation in projects that uses grunt

Flexible static site generation
-------------------------------

In my experience, the essence of flexibility in site generation tools lies in the ability to cater to the follow types of conversion arity

1. *One to One* - This is the simplest case, where one source file is manipulated, (markdowned, templated etcetera.) and then written to one destination file. Most typical cases like article pages, blog entries, landing pages etc fall into this category

2. *Many to One* - Here, contents from multiple files are aggregated into a single destination file. Blog home pages, Article archives, RSS feeds etcetera fall into this category.

3. *One to Many* - A single source file producing multiple files. Simplest example for this case is pagination. A single, very long, markdown article may need to be generated in multiple pages.

4. *Many to Many* - I have only so far encountered this as a combination of 2 and 3, specifically, paginated aggregation pages. exempli gratia. paginated blog archives.

jstatic basics
--------------

The basic concept of jstatic is as follows

1. Every *Task* consists of one or more named Flows.
2. A *Flow* is a conversion for a set of source files, optionally terminating in a disk write. The conversion semantics is specified using a series of Generator applications.
3. A *Generator* is a function that takes a sequence of File Entries (dictionary containing file details) and returns a manipulated sequence of entries.
4. Any Flow can have dependency on other flows. The final file entry sequence of the dependency flows are made available to Generators of the current flow. Depency, thus, also mandates an ordering for exection of Flows.

We shall now see how jstatic facilitates different conversions, through examples. 

One to One
----------




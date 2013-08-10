---
title: Organizing Git Repo for Github User Pages
publishTime: 2013-08-10 14:10:00
category: blog
---

This site, is hosted on the fantastic [Github Pages](http://pages.github.com/) service. 
If you are using some tool like [jekyll][1] or [assemble][2] or my personal project: [jstatic][3]
to generate your static html then you will end up with a bunch of source files (markdown files,
config files. templates etc.) that the tool uses to generate the site. Managing the source
files separately is rather cumbersome. Fortunately git has some nice little features that
makes it easier.

Orphan Branches
---------------

`git checkout` has an `--orphan` switch that lets you create a completely disconnected
branch.

> Create a new orphan branch, named &lt;new_branch&gt;, started from
> &lt;start_point&gt; and switch to it. The first commit made on this new
> branch will have no parents and it will be the root of a new
> history totally disconnected from all the other branches and
> commits.

We can use an orphan branch to store unrelated content. Github Project Pages
[documentation][4] suggests this method to store project pages separate from the main
code branch, but still within the same repo. With Organization and User pages, however, since
it uses a separate repo itself, the static files are picked up from the master branch.
Our source files can therefore be maintained in a separate orphan branch.

Subtree
-------

Copying the static site generator output directory into the master branch and then pushing 
it separately is again, too much work. The Git subtree feature makes this simpler.

> Subtrees allow subprojects to be included within a subdirectory of the
> main project, optionally including the subproject's entire history.

So the only thing that we need to do now, is add the master branch as subtree directory
in our source branch, and configure the tool to ouput to this directory.

The Setup
---------

1. Create an orphan branch for the source (*source* in this eg: ) and clean up everything
        git checkout --orphan source
        rm -rf ,
2. Add all your source files (markdown, tool config, templates etc)
3. Commit the code
        git commit -m "adding the source files"
4. Add master branch as subtree directory (i'm calling it *site* here). This will create
   a new commit with subtree details. (Note: I had to install git subtree module
   separately on my linux machine, not sure if this is part of the main package now)
        git subtree add --prefix site origin master --squash
5. Generate your static files. (Replace with whatever tool)
        grunt
6. Commit and push the source branch
        git commit -m "adding the source files"

Now you can simply keep working on the source branch. Whenever you need to publish
the content into the master branch, just do

    git subtree push --prefix=site/ origin master

[1]: http://jekyllrb.com/
[2]: http://assemble.io/
[3]: https://github.com/azeem/jstatic
[4]: https://help.github.com/articles/creating-project-pages-manually

---
title: Yago Loader
publishTime: 2012-03-18 23:21:00
category: blog
---

[Yago][1] is a huge semantic knowledge base, containing millions of facts about millions of entities (People, Organizations, Places etc.). I have been playing around with Yago some time back. I was going through the stuff again this weekend and I came across this small loader program that I had written back then.

The Yago core database is a 3.4Gb [download][2]. It comes as a bunch of TSV (Tab Separated Values) files, one file for each predicate (Facts in knowledge bases are represented as triplets of subject, predicate, object). Each file contains tab separated ID, subject and predicate on every line. There is a [converter tool][3] also, that can load the TSV data into a database, but I wanted to try loading the files using [MySQL LOAD DATA INFILE][4] statement. LOAD DATA INFILE lets you bulk load a file into a table, thus ridding the need to run INSERT statements.  My loader program simply reads a TSV file and creates a temporary file containing the rows to be loaded into the database table and then runs LOAD DATA INFILE statement.

<script src="https://gist.github.com/azeem/1103406.js"></script>

Using the `--exclude` option and `--log` option with the same argument will exclude files in the log. This would allow us to stop the loading at any point and resume, some time later, with the TSV file that it stopped at.

[1]: http://www.mpi-inf.mpg.de/yago-naga/yago/
[2]: http://www.mpi-inf.mpg.de/yago-naga/yago/downloads.html
[3]: http://www.mpi-inf.mpg.de/yago-naga/yago/download/yago2/yago2converters_20111027.7z
[4]: http://dev.mysql.com/doc/refman/5.1/en/load-data.html

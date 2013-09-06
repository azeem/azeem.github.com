#!/usr/bin/sh

git pull --rebase
grunt
if [ $? -eq 0 ]; then
    git add site/*
    git commit -a -m "publishing: $(date)"
    git push
    git subtree push --prefix=site/ origin master
else
    echo "Not published due to build fail"
fi

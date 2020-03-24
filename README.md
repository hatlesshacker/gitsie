# gitsie
[![Build Status](https://travis-ci.org/hatlesshacker/gitsie.svg?branch=master)](https://travis-ci.org/hatlesshacker/gitsie) ![GitHub top language](https://img.shields.io/github/languages/top/hatlesshacker/gitsie) ![license](https://img.shields.io/github/license/hatlesshacker/gitsie) ![code size](https://img.shields.io/github/languages/code-size/hatlesshacker/gitsie)

#### <a href="https://madewithlove.org.in" target="_blank">Made with <span style="color: #e74c3c">&hearts;</span> in India</a>
## Overview
gitsie is a package manager for projets hosted on GitHub. It's covinient to use, and works similar to package managers like `apt`.

## Quick-Start
You must have npm installed before installing gitsie.

Install gitsie as follows:
`
$ npm install -g gitsie
`
This will install gitsie globally on your system. Next, check that it's working properly:
```
$ gitsie
gitsie: The github package manager
Usage: gitsie [options] [package]

Options:
  -s   /  search     Search for package
  -r   /  retrieve   Download project sources
  -d   /  delete     Remove project sources
  -i   /  install    Unpack sources to intended location
  -h   /  help       Show this help message
```  

## Retrieving a repository
Retrieving a repository from GitHub is as easy as:
`$ gitsie -r user/repo`
then, unpack the sources to wherever you like, by:
`$ gitsie -i user/repo path/to/some/place`

## Removing a repository
The source packages of a repository stay stored on your system until you remove them. To delete a repository from your system, run:

`$ gitsie -d user/repo`

# gitsie
![Gitsie](https://hatlesshacker.github.io/gitsie/Gitsie.png)[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fhatlesshacker%2Fgitsie.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fhatlesshacker%2Fgitsie?ref=badge_shield)


[![Build Status](https://travis-ci.org/hatlesshacker/gitsie.svg?branch=master)](https://travis-ci.org/hatlesshacker/gitsie) ![CircleCI](https://img.shields.io/circleci/build/gh/hatlesshacker/gitsie/master) ![GitHub top language](https://img.shields.io/github/languages/top/hatlesshacker/gitsie) ![license](https://img.shields.io/github/license/hatlesshacker/gitsie) ![code size](https://img.shields.io/github/languages/code-size/hatlesshacker/gitsie)

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

## Why Gitsie?

### Flexible
From a developer's point of view, gitsie gives you much needed flexiblity. There are 4 different sripts that trigger on 4 important events: when your repo is being downloaded by the user, before and after the user has installed the repo, and before the user deletes your repo. Customize the 4 scripts to your preference an you have 100% control over your user's experience.

### Fat-Free
unlike many of the popular package managers, gitsie doesn't come with all the bloat. the entire project size is about 4 MB, and that includes all the third party libraries, and other redundant stuff.

### Easy to maintain
As mentioned earlier, all you have to do to customize the user's experience is to edit the 4 control scripts. You may have an interactive build system with issue-resolving; you can implement a system-setup using the post-install script. The choice is yours.


## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fhatlesshacker%2Fgitsie.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fhatlesshacker%2Fgitsie?ref=badge_large)
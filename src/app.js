#!/usr/bin/env node

var GitHub = require('github-api');
var Search = require('./search');
var Retrieve = require('./retrieve');
var ShowHelp = require('./showhelp');
var Delete = require('./delete');
var Install = require('./install');
var List = require('./list');
var OS = require('os');
var FS = require('fs');

cmdargs = process.argv;
var gh_handle = new GitHub();

// Check if this is the first time user is running gitsie
const homedir = require('os').homedir();
var gitsie_dir = homedir + '/.gitsie';
if (!FS.existsSync(gitsie_dir)) {
    console.log("Creating gitsie storage directory: " + gitsie_dir)
    FS.mkdirSync(gitsie_dir, 0744);
    FS.mkdirSync(gitsie_dir + "/packages/", 0744);
    //Create the configuration file
    FS.writeFile(gitsie_dir + "/conf", "", function (data) {
        return "Can't create configuration file";
    })
    console.log("")
}

if (cmdargs.length == 2 || cmdargs[2] == '-h' || cmdargs[2] == 'help') {
    //No arguments provided, show help
    ShowHelp.showhelp()
} else if (cmdargs[2] == '-s' || cmdargs[2] == 'search') {
    // user wants to search repositories
    repo_req = cmdargs[3];
    Search.search(repo_req);
} else if (cmdargs[2] == '-r' || cmdargs[2] == 'retrieve') {
    // user wants to retrieve a repo
    repo_req = cmdargs[3];
    Retrieve.retrieve(repo_req);
} else if (cmdargs[2] == '-d' || cmdargs[2] == 'delete') {
    // user wants to delete a repo
    repo_req = cmdargs[3];
    Delete.delete_src(repo_req)
} else if (cmdargs[2] == '-i' || cmdargs[2] == 'install') {
    // user wants to unpack a repo
    repo_req = cmdargs[3];
    location = cmdargs[4];
    Install.install(repo_req, location)
} else if (cmdargs[2] == '-l' || cmdargs[2] == 'list') {
    // user wants to list releases
    repo_req = cmdargs[3];
    List.listreleases(repo_req)
} else {
    ShowHelp.showhelp()
}
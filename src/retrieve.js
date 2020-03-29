var Search = require('./search');
var GitHub = require('github-api');
var Https = require('https');
var Md5 = require('md5');
var FS = require('fs');
var Events = require('events');
var AdmZip = require('adm-zip');
var Wget = require('wget-improved');
var Config = require('./updateconfig');
const Spawn = require('cross-spawn');
var colors = require('colors');

var gh_handle = new GitHub();

function stage_2(reponame, username, gitsie_dir) {
    //ACTUALLY RETRIEVE THE REPO
    console.log(colors.brightCyan("Retrieving " + reponame + ", by @" + username))
    var repo = gh_handle.getRepo(username, reponame)
    repo.listReleases(function(err, releases) {
        release = releases[0]

        console.log(colors.brightCyan("** getting release #" + release['id'] + " :: " + release['name']))
        console.log(colors.brightCyan("** published on " + release['published_at']))
        console.log()

        //STEP1: DOWNLOAD THE REPO
        url = "https://github.com/" + username + "/" + reponame + "/archive/" + release['tag_name'] + ".zip"
        //Download.download(url)
        const output = gitsie_dir + "/packages/" + pack_name_encoded;
        options = {
            protocol: 'https',
            headers: {
                'User-Agent': 'Node'
            }
        }

        let download = Wget.download(url, output, options);
        download.on('error', function(err) {
            console.log(colors.red(err));
        });

        download.on('end', function(output) {
            console.log(colors.brightCyan("Finished Downloading."));

            //STEP2: UPDATE CONFIG
            Config.updateconfig_new(repo_req, release);



            //STEP3: EXECUTE POSTRETRIEVE SCRIPT IF PRESENT
            archive = gitsie_dir + "/packages/" + pack_name_encoded
            //Check if the post-retrieve script is present
            var zip = new AdmZip(archive);
            var zipEntries = zip.getEntries();
            postretrieve_entry_name = reponame + "-" + release['tag_name'] + "/.gitsie/postretrieve"

            zipEntries.forEach(function(zipEntry) {
                if (zipEntry.entryName == postretrieve_entry_name) {
                    //The script is indeed present
                    zip.extractEntryTo(postretrieve_entry_name, gitsie_dir + "/temp/", false, true);
                    //Run the script
                    console.log(colors.brightCyan("------Executing postretrieve script-----"))
                    const result_chmod = Spawn.sync("chmod", ['+x', gitsie_dir + "/temp/postretrieve"], {
                        stdio: 'inherit'
                    });
                    const result_run = Spawn.sync(gitsie_dir + "/temp/postretrieve", [], {
                        stdio: 'inherit'
                    });
                    console.log(colors.brightCyan("---------------------------------------"))
                    FS.unlinkSync(gitsie_dir + "/temp/postretrieve") //Remove temporary script                    
                }
            });
        });
    }).catch((error) => {
        console.log(colors.red('ERROR:', error))
    });
}

var retrieve = function(repo_req) {

    if (repo_req == null) {
        console.log(colors.red("Enter the name of the repo to retrieve"))
        process.exit()
    }

    user_repo = repo_req.split("/")
    if (user_repo.length != 2) {
        console.log(colors.red("Invalid repo name"))
        process.exit()
    }
    username = user_repo[0]
    reponame = user_repo[1]
    if (username.length == 0 || reponame.length == 0) {
        console.log(colors.red("Invalid repo name"))
        process.exit()
    }

    //Check that the repo actually exists
    //We need to implement another Search() here

    var author = gh_handle.getUser(username);

    author.listRepos(function(err, repos) {
        var i;
        stat = false
        for (i = 0; i <= repos.length - 1; i++) {
            var repo = repos[i];
            if (repo['full_name'] == this.repo_req) {
                stat = true
                break
            }
        }
        if (stat == false) {
            console.log(colors.red("Specified repository doesn't exist!"))
            process.exit()
        }

        //If we are here, it means that the repo definitely exists.
        const homedir = require('os').homedir();
        var gitsie_dir = homedir + '/.gitsie';
        pack_name_encoded = Md5(repo_req)

        conf_contents = FS.readFileSync(gitsie_dir + "/conf", "utf-8")
        if (conf_contents.length == 0) { // No packages currently installed
            stage_2(reponame, username, gitsie_dir)
        } else { // Config is not empty, the pack might be already present 
            conf_contents_data = JSON.parse(conf_contents)
            var l;
            for (l = 0; l <= conf_contents_data.length - 1; l++) {
                record = conf_contents_data[l];
                if (record['name'] == repo_req) {
                    console.log(colors.brightCyan("Package " + repo_req + " is already present"))
                    process.exit()
                }
            }

            //Package not present.
            stage_2(reponame, username, gitsie_dir)
        }


    }).catch(error => {
        throw error
    })
}

module.exports = {
    retrieve
}
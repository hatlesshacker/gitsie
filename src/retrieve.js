var Search   = require('./search');
var GitHub   = require('github-api');
var Https    = require('https');
var Md5      = require('md5');
var FS       = require('fs');
var Wget     = require('wget-improved');
var Download = require('./download');
var Config   = require('./updateconfig');

var gh_handle = new GitHub();

var retrieve = function (repo_req) {
    //obtain the zip file of the repository, and update .gitsie/conf
    user_repo = repo_req.split("/")
    username = user_repo[0]
    reponame = user_repo[1]

    //Check that the repo actually exists
    //We need to implement another Search() here

    var author = gh_handle.getUser(username);
    author.listRepos(function(err, repos) {
        var i;
        repo_list_author = []
        stat = false
        repo_len = repos.length
        for (i=0; i<=repo_len-1; i++){
            var repo = repos[i];
            if (repo['full_name'] == this.repo_req){
                stat = true
                break
            }
        }

        if (stat == true){
            console.log("Retrieving "+reponame+", by @"+username)
            
            var rep = gh_handle.getRepo(username, reponame)
            rep.listReleases(function(err, releases) {
                release = releases[0]

                const homedir = require('os').homedir();
                var gitsie_dir = homedir+'/.gitsie';
                pack_name_encoded = Md5(repo_req)

                //Check if the release requested is already present or not.
                FS.readFile(gitsie_dir+"/conf", "utf-8", (err, data) => {
                    if (err) {
                        console.log("ERROR: "+err)
                    } else{
                        if (data.length != 0){
                            prev_conf_data = JSON.parse(data)                            
                            var l;
                            for (l=0; l<=prev_conf_data.length-1; l++){
                                record = prev_conf_data[l];
                                if (record['name'] == repo_req){
                                    console.log("Package "+ repo_req+ " is already present")
                                    process.exit()
                                }
                            }

                            //All clear here
                            console.log("** getting release #"+release['id']+" :: "+release['name'])
                            console.log("** published on "+release['published_at'])

                            //STEP1: DOWNLOAD THE REPO
                            url = "https://github.com/"+username+"/"+reponame+"/archive/"+release['tag_name']+".zip"
                            Download.download(url)

                            //STEP2: UPDATE CONFIG
                            Config.updateconfig_new(repo_req, release);



                        } else {
                            //All clear here
                            console.log("** getting release #"+release['id']+" :: "+release['name'])
                            console.log("** published on "+release['published_at'])

                            //STEP1: DOWNLOAD THE REPO
                            url = "https://github.com/"+username+"/"+reponame+"/archive/"+release['tag_name']+".zip"
                            Download.download(url)

                            //STEP2: UPDATE CONFIG
                            Config.updateconfig_new(repo_req, release);
                        }
                    }
                })
            }).catch((error) => {
                console.log('ERROR:', error)
            });

        } else {
            console.log("Specified repository doesn't exist!")
        }
     }).catch((error) => {
        console.log('ERROR:', error)
    });
}

module.exports = {retrieve}
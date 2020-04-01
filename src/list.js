var GitHub = require('github-api');
var colors = require('colors');
var gh_handle = new GitHub();

var listreleases = function(repo_req) {
    if (repo_req == null) {
        console.log(colors.red("Enter the name of the repo to search for"))
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

    console.log(colors.brightCyan("Listing releases of " + reponame + ", by " + username));

    var repo = gh_handle.getRepo(username, reponame)
    repo.listReleases(function(err, releases) {
        //Check if the repo actually has a release or not.
        if (releases.length != 0) {
            releases.forEach(release => {
                console.log("** "+colors.cyan(release['name'] + " .. released on " + release['published_at']))
            });
            console.log()
        } else {
            release = {
                name: repo_req,
                published_on: datetime,
                package: pack_name_encoded,
                tag_name: "master"
            }

            console.log(colors.cyan("** "+repo_req+" currently has no releases."))
        }
    }).catch((error) => {
        console.log(colors.red('ERROR:', error))
    });
}

module.exports = {
    listreleases
}
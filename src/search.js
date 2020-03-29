var GitHub = require('github-api');
var colors = require('colors');
var gh_handle = new GitHub();

var search = function(repo_req) {
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

    console.log(colors.brightCyan("Searching for " + reponame + ", by " + username));

    gh_handle.search().forRepositories({
            q: reponame,
            user: username
        })
        .then(({
            data: repos
        }) => {
            console.log(colors.brightCyan("Found the following repositories:"))
            var i;
            for (i = 0; i <= repos.length - 1; i++) {
                var repo = repos[i];
                console.log(colors.brightCyan("  * " + repo['full_name']))
            }

        }).catch((error) => {
            console.log(colors.red('forRepositories error:', error))
        })
}

module.exports = {
    search
}
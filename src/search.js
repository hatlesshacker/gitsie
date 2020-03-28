var GitHub = require('github-api');
var gh_handle = new GitHub();

var search = function(repo_req) {
    if (repo_req == null) {
        console.log("Enter the name of the repo to search for")
        process.exit()
    }

    user_repo = repo_req.split("/")
    if (user_repo.length != 2) {
        console.log("Invalid repo name")
        process.exit()
    }
    username = user_repo[0]
    reponame = user_repo[1]

    if (username.length == 0 || reponame.length == 0) {
        console.log("Invalid repo name")
        process.exit()
    }

    console.log("Searching for " + reponame + ", by " + username);

    gh_handle.search().forRepositories({
            q: reponame,
            user: username
        })
        .then(({
            data: repos
        }) => {
            console.log("Found the following repositories:")
            var i;
            for (i = 0; i <= repos.length - 1; i++) {
                var repo = repos[i];
                console.log("  * " + repo['full_name'])
            }

        }).catch((error) => {
            console.log('forRepositories error:', error)
        })
}

module.exports = {
    search
}
var FS = require('fs');
var AdmZip = require('adm-zip');
const Spawn = require('cross-spawn');

var install = function(name, loc) {
    const homedir = require('os').homedir();
    var gitsie_dir = homedir + '/.gitsie';

    if (name == null) {
        console.log("Enter the name of the repo to install")
        process.exit()
    }

    if (loc == null) {
        console.log("Enter the location")
        process.exit()
    }

    user_repo = name.split("/")
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

    conf_contents = FS.readFileSync(gitsie_dir + "/conf", "utf-8")
    if (conf_contents.length == 0) {
        console.log("Package " + name + " is not present in the system")
        process.exit()
    } else {
        prev_conf_data = JSON.parse(conf_contents)
        var l;
        for (l = 0; l <= prev_conf_data.length - 1; l++) {
            record = prev_conf_data[l];
            if (record['name'] == name) {
                //Match found. The mentioned package is present in the system.
                archive = gitsie_dir + "/packages/" + record['package']
                var zip = new AdmZip(archive);
                var zipEntries = zip.getEntries();

                //SEARCH AND RUN PRE-INSTALL SCRIPT
                preinstall_entry_name = reponame + "-" + record['tag_name'] + "/.gitsie/preinstall"

                zipEntries.forEach(function(zipEntry) {
                    //console.log(zipEntry.entryName)
                    if (zipEntry.entryName == preinstall_entry_name) {
                        //The script is indeed present
                        zip.extractEntryTo(preinstall_entry_name, gitsie_dir + "/temp/", false, true);

                        console.log("------Executing preinstall script-----")
                        const result_chmod = Spawn.sync("chmod", ['+x', gitsie_dir + "/temp/preinstall"], {
                            stdio: 'inherit'
                        });
                        const result_run = Spawn.sync(gitsie_dir + "/temp/preinstall", [], {
                            stdio: 'inherit'
                        });
                        console.log("---------------------------------------")
                        FS.unlinkSync(gitsie_dir + "/temp/preinstall") //Remove temporary script
                    }
                });

                console.log("")
                console.log("Installing " + record['name'] + " to " + loc)
                console.log("")
                //Actually decompress the archive 
                zip.extractAllTo(loc, true);


                //SEARCH AND RUN POST-INSTALL SCRIPT
                postinstall_entry_name = reponame + "-" + record['tag_name'] + "/.gitsie/postinstall"

                zipEntries.forEach(function(zipEntry) {
                    //console.log(zipEntry.entryName)
                    if (zipEntry.entryName == postinstall_entry_name) {
                        //The script is indeed present
                        zip.extractEntryTo(postinstall_entry_name, gitsie_dir + "/temp/", false, true);

                        console.log("------Executing postinstall script-----")
                        const result_chmod = Spawn.sync("chmod", ['+x', gitsie_dir + "/temp/postinstall"], {
                            stdio: 'inherit'
                        });
                        const result_run = Spawn.sync(gitsie_dir + "/temp/postinstall", [], {
                            stdio: 'inherit'
                        });
                        console.log("---------------------------------------")
                        FS.unlinkSync(gitsie_dir + "/temp/postinstall") //Remove temporary script
                    }
                });

                process.exit()
            }
        }

        console.log("Package " + name + " is not present in the system")
        process.exit()
    }
}

module.exports = {
    install
}
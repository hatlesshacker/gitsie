var FS = require('fs');
var AdmZip = require('adm-zip');
const Spawn = require('cross-spawn');
var colors = require('colors');
var execute = require('exe');

var install = function(name, loc) {
    const homedir = require('os').homedir();
    var gitsie_dir = homedir + '/.gitsie';

    if (name == null) {
        console.log(colors.red("Enter the name of the repo to install"))
        process.exit()
    }

    if (loc == null) {
        console.log(colors.red("Enter the location"))
        process.exit()
    }

    user_repo = name.split("/")
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

    conf_contents = FS.readFileSync(gitsie_dir + "/conf", "utf-8")
    if (conf_contents.length == 0) {
        console.log(colors.brightCyan("Package " + name + " is not present in the system"))
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
                    if (zipEntry.entryName == preinstall_entry_name) {
                        //The script is indeed present
                        zip.extractEntryTo(preinstall_entry_name, gitsie_dir + "/temp/", false, true);

                        console.log(colors.brightCyan("------Executing preinstall script-----"))
                        const result_chmod = Spawn.sync("chmod", ['+x', gitsie_dir + "/temp/preinstall"], {
                            stdio: 'inherit'
                        });
                        const result_run = Spawn.sync(gitsie_dir + "/temp/preinstall", [loc], {
                            stdio: 'inherit'
                        });
                        console.log(colors.brightCyan("---------------------------------------"))
                        FS.unlinkSync(gitsie_dir + "/temp/preinstall") //Remove temporary script
                    }
                });

                console.log(colors.brightCyan(""))
                console.log(colors.brightCyan("Installing " + record['name'] + " to " + loc))
                console.log(colors.brightCyan(""))
                //Actually decompress the archive 
                zip.extractAllTo(loc, true);
                
                //Check if this is an NPM package. If so, run npm update
                //at the installed folder
                files = FS.readdirSync(loc +"/"+ reponame + "-" + record['tag_name'])
                if (files.indexOf('package.json') != -1){
                    console.log("This is an NPM Package.")

                    pwd = process.env.PWD
                    process.chdir(loc +"/"+ reponame + "-" + record['tag_name'])
                    execute("npm update")
                    process.chdir(pwd)
                    console.log(colors.brightCyan("Ran NPM update."))
                }


                //SEARCH AND RUN POST-INSTALL SCRIPT
                postinstall_entry_name = reponame + "-" + record['tag_name'] + "/.gitsie/postinstall"

                zipEntries.forEach(function(zipEntry) {
                    if (zipEntry.entryName == postinstall_entry_name) {
                        //The script is indeed present
                        zip.extractEntryTo(postinstall_entry_name, gitsie_dir + "/temp/", false, true);

                        console.log(colors.brightCyan("------Executing postinstall script-----"))
                        const result_chmod = Spawn.sync("chmod", ['+x', gitsie_dir + "/temp/postinstall"], {
                            stdio: 'inherit'
                        });
                        const result_run = Spawn.sync(gitsie_dir + "/temp/postinstall", [loc], {
                            stdio: 'inherit'
                        });
                        console.log(colors.brightCyan("---------------------------------------"))
                        FS.unlinkSync(gitsie_dir + "/temp/postinstall") //Remove temporary script
                    }
                });

                process.exit()
            }
        }

        console.log(colors.brightCyan("Package " + name + " is not present in the system"))
        process.exit()
    }
}

module.exports = {
    install
}
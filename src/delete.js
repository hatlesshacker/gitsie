var Md5 = require('md5');
var FS = require('fs');
var Md5 = require('md5');
const Spawn = require('cross-spawn');
var AdmZip = require('adm-zip');

var delete_src = function(name) {
    if (name == null) {
        console.log("Enter the name of the repo to delete")
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

    //Check whether the mentioned repo exists in the system or not
    const homedir = require('os').homedir();
    var gitsie_dir = homedir + '/.gitsie';

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
                pack_name_encoded = Md5(name)
                archive = gitsie_dir + "/packages/" + pack_name_encoded

                var zip = new AdmZip(archive);
                var zipEntries = zip.getEntries();
                predelete_entry_name = reponame + "-" + record['tag_name'] + "/.gitsie/predelete"

                zipEntries.forEach(function(zipEntry) {
                    if (zipEntry.entryName == predelete_entry_name) {
                        //The script is indeed present
                        zip.extractEntryTo(predelete_entry_name, gitsie_dir + "/temp/", false, true);
                        //Run the script
                        console.log("------Executing predelete script-----")
                        const result_chmod = Spawn.sync("chmod", ['+x', gitsie_dir + "/temp/predelete"], {
                            stdio: 'inherit'
                        });
                        const result_run = Spawn.sync(gitsie_dir + "/temp/predelete", [], {
                            stdio: 'inherit'
                        });
                        console.log("---------------------------------------")
                        FS.unlinkSync(gitsie_dir + "/temp/predelete") //Remove temporary script                    
                    }
                });

                //STEP1: remove the corresponding archive
                FS.unlinkSync(archive)

                //STEP2: remove the entry
                prev_conf_data.splice(l, 1)
                //console.log(JSON.stringify(prev_conf_data))
                FS.writeFileSync(gitsie_dir + "/conf", JSON.stringify(prev_conf_data), (err) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Records updated.");
                    }
                });

                console.log("Removed package " + name)
                process.exit()
            }
        }

        console.log("Package " + name + " is not present in the system")
        process.exit()
    }
}

module.exports = {
    delete_src
}
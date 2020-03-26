var FS = require('fs');
var AdmZip = require('adm-zip');

var install = function(name, loc) {
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

                //SEARCH AND RUN PRE-INSTALL SCRIPT

                user_repo = record['name'].split("/")
                username = user_repo[0]
                reponame = user_repo[1]

                archive = gitsie_dir + "/packages/" + record['package']
                var zip = new AdmZip(archive);
                var zipEntries = zip.getEntries();
                preinstall_entry_name = reponame + "-" + record['tag_name'] + "/.gitsie/preinstall"

                zipEntries.forEach(function(zipEntry) {
                    //console.log(zipEntry.entryName)
                    if (zipEntry.entryName == preinstall_entry_name) {
                        //The script is indeed present
                        zip.extractEntryTo(preinstall_entry_name, gitsie_dir + "/temp/", false, true);
                        const execSync = require('child_process').execSync;
                        const execASync = require('child_process').exec;
                        //console.log("------Executing preinstall script-----")
                        //execSync("chmod +x " + gitsie_dir + "/temp/preinstall")
                        //RUN THE SCRIPT HERE
                    }
                });


                console.log("Installing " + record['name'] + " to " + loc)
                //Actually decompress the archive 
                zip.extractAllTo(loc, true);
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
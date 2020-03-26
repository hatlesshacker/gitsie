var Md5 = require('md5');
var FS = require('fs');

var delete_src = function(name) {
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

                //STEP1: remove the corresponding archive
                archive_name = record['package']
                FS.unlinkSync(gitsie_dir + "/packages/" + archive_name)

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
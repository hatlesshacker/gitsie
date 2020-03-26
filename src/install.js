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
                console.log("Installing " + record['name'] + " to " + loc)
                archive = gitsie_dir + "/packages/" + record['package']
                //Actually decompress the archive 
                var zip = new AdmZip(archive);
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
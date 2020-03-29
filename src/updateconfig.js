var Md5 = require('md5');
var FS = require('fs');
var colors = require('colors');

var updateconfig_new = function(repo_req, release) {

    const homedir = require('os').homedir();
    var gitsie_dir = homedir + '/.gitsie';
    pack_name_encoded = Md5(repo_req)

    FS.readFile(gitsie_dir + "/conf", "utf-8", (err, data) => {
        if (err) {
            console.log(colors.red("ERROR: " + err))
        } else {
            if (data.length == 0) {
                //first retrieval
                entries = []
                current_entry = {
                    name: repo_req,
                    published_on: release['published_at'],
                    package: pack_name_encoded,
                    tag_name: release['tag_name']
                }
                entries.push(current_entry)
                FS.writeFileSync(gitsie_dir + "/conf", JSON.stringify(entries))
                console.log(colors.brightCyan("Records updated."));
            } else {
                prev_conf_data = JSON.parse(data)
                current_entry = {
                    name: repo_req,
                    published_on: release['published_at'],
                    package: pack_name_encoded,
                    tag_name: release['tag_name']
                }
                prev_conf_data.push(current_entry)
                FS.writeFileSync(gitsie_dir + "/conf", JSON.stringify(prev_conf_data))
                console.log(colors.brightCyan("Records updated."));
            }
        }
    })
}

module.exports = {
    updateconfig_new
}
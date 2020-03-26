var Md5 = require('md5');
var FS = require('fs');

var updateconfig_new = function(repo_req, release) {

    const homedir = require('os').homedir();
    var gitsie_dir = homedir + '/.gitsie';
    pack_name_encoded = Md5(repo_req)

    FS.readFile(gitsie_dir + "/conf", "utf-8", (err, data) => {
        if (err) {
            console.log("ERROR: " + err)
        } else {
            //console.log("previous contents: "+data);
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
                //console.log(JSON.stringify(entries))
                /*FS.writeFile(gitsie_dir+"/conf", JSON.stringify(entries), (err) => {
                    if (err) console.log(err);
                    console.log("Records updated.");
                });*/

                FS.writeFileSync(gitsie_dir + "/conf", JSON.stringify(entries))
                console.log("Records updated.");
            } else {
                prev_conf_data = JSON.parse(data)
                current_entry = {
                    name: repo_req,
                    published_on: release['published_at'],
                    package: pack_name_encoded,
                    tag_name: release['tag_name']
                }
                prev_conf_data.push(current_entry)
                /*FS.writeFile(gitsie_dir+"/conf", JSON.stringify(prev_conf_data), (err) => {
                    if (err) console.log(err);
                    console.log("Records updated.");
                });*/
                FS.writeFileSync(gitsie_dir + "/conf", JSON.stringify(prev_conf_data))
                console.log("Records updated.");
            }
        }
    })
}

module.exports = {
    updateconfig_new
}
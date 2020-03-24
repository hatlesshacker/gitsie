var Md5      = require('md5');
var Wget     = require('wget-improved');

var download = function (url) {
    const homedir = require('os').homedir();
    var gitsie_dir = homedir+'/.gitsie';
    pack_name_encoded = Md5(repo_req)

    const output = gitsie_dir+"/packages/"+pack_name_encoded;
    options = {
    protocol : 'https',
        headers  : {
            'User-Agent': 'Node'
        }
    }

    let download = Wget.download(url, output, options);
    download.on('error', function(err) {
        console.log(err);
    });
}

module.exports = {download}
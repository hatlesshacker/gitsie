var showhelp = function() {
    console.log("gitsie: The github package manager")
    console.log("Usage: gitsie [options] [package]")
    console.log("")
    console.log("Options:")
    console.log("  -s   /  search     Search for package")
    console.log("  -r   /  retrieve   Download project sources")
    console.log("  -d   /  delete     Remove project sources")
    console.log("  -i   /  install    Unpack sources to intended location")
    console.log("  -h   /  help       Show this help message")
}

module.exports = {
    showhelp
}
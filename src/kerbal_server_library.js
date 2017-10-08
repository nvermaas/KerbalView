// kerbal_server_library.js
// Nico Vermaas - 18 aug 2017
// node.js library that contains the server side kerbalview functionality

var fs = require("fs")
var dm = require("./kerbal_server_datamodel.js")


// === INTERFACE (public functions)  ===
var fileNameInput = 'persistent.sfs'
var datafile = null;

//========= INTERFACE (public functions) ==========
exports.getDataFile = function() {
    if (this.datafile == null) {
        console.log('kerbal_server_library.getDataFile() - (refreshed)')
        this.datafile = fs.readFileSync(fileNameInput).toString()
    } else {
        console.log('kerbal_server_library.getDataFile() - (unchanged)')
    }
    return this.datafile
}


exports.readKSP = function() {
    console.log('kerbal_server_library.readKSP()')
    // read file synchronous (blocking)
    var data = fs.readFileSync(fileNameInput).toString()
    return data
}


exports.writeKSP = function(fileNameOutput, my_html) {
    // write file synchronous (blocking)
    fs.writeFileSync(fileNameOutput, my_html)
}

// getDescription reads the 'description' tag from the data string (a string representation of persistant.sfs).
exports.getDescription = function (data) {
    var search_start = "Description ="
    var search_end = "linkURL ="
    var pos1 = data.indexOf(search_start)
    var length = data.indexOf(search_end) - pos1 - search_start.length - 1

    // if description is found, then create and write some html.
    if (pos1 > 0 && length > 0) {
        var my_description = (data.substr(pos1 + search_start.length + 1, length)).trim()
    }
    return my_description
}

exports.createHtml = function(description) {
    var html = "";
    html = html + '<meta http-equiv="refresh" content="5">'
    html = html + "<h2>Description = " + description + "</h2>"
    return html;
}

// getKerbals
exports.getKerbalList = function (data,state) {
    myKerbalList = new dm.KerbalList()
    myKerbalList.fillFromData(data,state);
    return myKerbalList
}

// getParts
exports.getPartsList = function (data,partName) {
    myPartsList = new dm.PartsList()
    myPartsList.fillFromData(data,partName);
    return myPartsList
}

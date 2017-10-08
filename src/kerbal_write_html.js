// kerbal_write_html.js
// Nico Vermaas - 17 aug 2017
// node.js program to read 'description' from the Kerbal 'persistent.sfs' file and writes it to kerbal_html.htm

var ksl = require("./kerbal_server_library.js")

var fileNameOutput = 'kerbal_html.htm'

var data = ksl.getDataFile()
var my_description = ksl.getDescription(data)
var my_html = ksl.createHtml(my_description)

var myKerbalList = ksl.getKerbalList(data)
my_html += myKerbalList.getHtml()
ksl.writeKSP(fileNameOutput, my_html);

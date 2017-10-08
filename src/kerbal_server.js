// kerbal_server.js
// Nico Vermaas - 23 aug 2017
// node.js express webserver implementation of the API

var express = require('express');
var ksl = require("./kerbal_server_library.js")
var cors = require('cors')

var app = express();
app.use(cors())
// This responds with "Welcome to the KerbalView API" on the homepage
app.get('/', function (req, res) {
    console.log("Got a GET request for the homepage");
    res.send('Welcome to the KerbalView API');
})

// This responds with the description
app.get('/description', function (req, res) {

    var data = ksl.readKSP()
    var result = ksl.getDescription(data)

    console.log("get /description = "+result );
    res.send(result);
})

// This responds with the kerballist
app.get('/parts', function (req, res) {
    var name = req.query.name

    var data = ksl.readKSP()
    var myPartsList = ksl.getPartsList(data,name)
    var json = myPartsList.getJson()

    // add content type 'application/json'
    res.setHeader('content-type','application/json')
    res.send(json);
})

// This responds with the kerballist
app.get('/kerbals', function (req, res) {
    var state = req.query.state

    var data = ksl.readKSP()
    var myKerbalList = ksl.getKerbalList(data,state)
    var json = myKerbalList.getJson()

    // add content type 'application/json'
    res.setHeader('content-type','application/json')
    res.send(json);
})


// This responds with a single kerbal
app.get('/kerbal', function (req, res) {
    // read parameters
    // http://expressjs.com/de/api.html#req.query
    var name = req.query.name

    var data = ksl.getDataFile() //refresh or read
    //var data = ksl.readKSP()
    var myKerbalList = ksl.getKerbalList(data)
    var myKerbal = myKerbalList.getKerbalByName(name)

    var json =JSON.stringify("No Kerbal with name '"+name+"' found")
    if (myKerbal != null) {
        var json = myKerbal.getJson()
    }
    // add content type 'application/json'
    res.setHeader('content-type','application/json')
    res.send(json);
})

var server = app.listen(8081, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("kerbal server listening at http://%s:%s", host, port)
})
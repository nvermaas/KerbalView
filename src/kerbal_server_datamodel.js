// kerbal_server_datamodel.js
// Nico Vermaas - 23 aug 2017
// node.js library that contains the server side kerbal datamodel

// ========= DATA MODEL ==========

var persistent = require("./kerbal_persistent.js")

//========= INTERFACE (public functions) ==========
exports.PartsList = function(){
    this.parts = []

    this.fillFromData = function(data,partName) {
        console.log('kerbal_server_datamodel.fillFromData('+partName+')')
        this.parts = persistent.readParts(data,partName)
    }

    // get a list of parts per state
    this.getParts = function (states) {
        results = [];
        if (states.indexOf("all")>=0) {
            return this.parts;
        } else {
            for (part in this.parts) {
                if (states.indexOf(part.state)>=0) {
                    results.push(part)
                }
            }
            return results
        }
    }

    this.getJson = function(){
        var json = JSON.stringify(this.parts);
        return json
    }
}

Part = function(partName, state, vessel) {
    this.name = partName
    this.state = state
    this.vessel = vessel

    this.getJson = function() {
        return JSON.stringify(this);
    }
}

//----------------------------------------

exports.KerbalList = function(){
    this.kerbals = []

    this.fillFromData = function(data,state) {
        console.log('kerbal_server_datamodel.fillFromData()')
        this.kerbals = persistent.readKerbals(data,state)
    }

    // get a list of kerbals per state
    this.getKerbals = function (states) {
        results = [];
        if (states.indexOf("all")>=0) {
            return this.kerbals;
        } else {
            for (kerbal in this.kerbals) {
                if (states.indexOf(kerbal.state)>=0) {
                    results.push(kerbal)
                }
            }
            return results
        }
    }

    // get a single kerbal by name (case insensitive)
    this.getKerbalByName = function(name) {
        for (i = 0; i < this.kerbals.length; i++) {
            var myKerbal = this.kerbals[i]
            if (myKerbal != null) {
                if (myKerbal.name.toUpperCase().indexOf(name.toUpperCase()) >= 0) {
                    return myKerbal
                }
            }
        }
    }

    this.getHtml = function(){
        var html = "<table>";
        html += "<tr>";

        for (i = 0; i < this.kerbals.length; i++) {
            html += this.kerbals[i].getHtml();
         }
        html += "</tr>";
        html += "</table>";

        return html
    }

    this.getJson = function(){
        var json = JSON.stringify(this.kerbals);
        return json
    }
}

Kerbal = function(name, trait, state, career) {
    this.name = name
    this.trait = trait
    this.state = state
    this.career = career

    this.getHtml = function() {
        var html = "<tr>";
        html += "<td>"+this.name+ "</td>";
        html += "<td>"+this.trait+ "</td>";
        html += "<td>"+this.state+ "</td>";
        html += "<td>"+this.career+ "</td>";
        html += "</tr>";
        return html
    }

    this.getJson = function() {
        return JSON.stringify(this);
    }
}

Career = function(flights, orbit, land, flag) {
    this.flights = flights
    this.orbit = orbit
    this.land = land
    this.flag = flag

    this.getOutputData = function () {
        this.myOutput = "<tr>"
        this.myOutput += "<td>" + this.flights + "</td>";
        this.myOutput += "<td>" + this.orbit + "</td>";
        this.myOutput += "<td>" + this.land + "</td>";
        this.myOutput += "<td>" + this.flag + "</td>";
        this.myOutput += "</tr>";
    }
}





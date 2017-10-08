// kerbal_datamodel.js - Nico Vermaas 18 aug 2017

// ========= DATA MODEL ==========

// to exports or not to exports
//https://caolan.org/posts/writing_for_node_and_the_browser.html

function KerbalList() {
    this.kerbals = []

    this.fillFromDataFile = function(data) {
        kerbal = new Kerbal('Nico Vermaas','Programmer','Alive','Astron')
        this.kerbals.push(kerbal)
    }

    this.addJsonResult = function(jsonResult, max) {
        this.result = jsonResult;
        // console.log("this.result[0].title: "+this.result[0].title);
        // console.log("isArray? :"+Array.isArray(this.result))
        console.log("this.results.length = "+this.result.length+ ", max = "+max);

        for (i = 0; i < this.result.length; i++) {
            kerbal = new Kerbal();
            kerbal.addJsonResult(this.result[i]);
            this.kerbals.push(kerbal);
            if (i>=max) {
                break;
            }
        }
    }

    // get a list of kerbals per state
    this.getKerbals = function (states) {
        results = [];
        if (states.indexOf("all")>=0) {
            return this.kerbals;
        } else {
            for (kerbal in this.kerbals) {
                if (states.indexOf(kerbal.state)>=0) {
                    results.pop(kerbal)
                }
            }
            return results
        }
    }

    // get a single kerbal by name
    this.getKerbal = function(name) {
        for (kerbal in this.kerbals) {
            if (kerbal.name.indexOf(name) >= 0) {
                return kerbal
                break
            }
        }
    }

    this.showData = function(tagOutput){
        this.myOutput = "<table id=\"geel\"+><tr><th>Name</th><th>Trait</th><th>State</th><th>Career</th></id></tr>";
        // todo: loop through the list (use a foreach)
        //this.results.forEach(showLine)
        this.myOutput += "<tr>";
        this.myOutput += "<td>"+this.kerbals + "</td>";
        this.myOutput += "</tr>";
        this.myOutput += "</table>";

        //alert("showData : " +myOutput);
        document.getElementById(tagOutput).innerHTML = this.myOutput;
    }
}

function Kerbal(name, trait, state, career) {
    this.name = name
    this.trait = trait
    this.state = state
    this.career = career

    this.addJsonResult = function(jsonObject) {
        this.name = jsonObject.name;
        this.trait = jsonObject.trait;
        this.state = jsonObject.state;
        this.career = jsonObject.career;
    }

    this.getOutputData = function () {
        this.myOutput = "<tr>"
        this.myOutput += "<td>" + this.name + "</td>";
        this.myOutput += "<td>" + this.trait + "</td>";
        this.myOutput += "<td>" + this.state + "</td>";
        this.myOutput += "</tr>";
    }
}

function Career(name, flights, orbit, land) {
    this.flights = flights
    this.orbit = orbit
    this.land = land

    this.getOutputData = function () {
        this.myOutput = "<tr>"
        this.myOutput += "<td>" + this.flights + "</td>";
        this.myOutput += "<td>" + this.orbit + "</td>";
        this.myOutput += "<td>" + this.land + "</td>";
        this.myOutput += "</tr>";
    }
}


// ======================================================================



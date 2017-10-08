// kerbal_client_datamodel.js
// Nico Vermaas - 23 aug 2017
// javascript library that contains the client side kerbal datamodel

function KerbalList() {
    this.kerbals = []

    this.addJsonResult = function(jsonResult) {

        this.result = jsonResult;
        // console.log("this.result[0].title: "+this.result[0].title);
        // console.log("isArray? :"+Array.isArray(this.result))
        console.log("this.results.length = "+this.result.length);

        for (i = 0; i < this.result.length; i++) {
            kerbal = new Kerbal();
            kerbal.addJsonResult(this.result[i]);
            this.kerbals.push(kerbal);
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

        this.myOutput += "<tr>";
        var myKerbal = this.kerbals[0]
        for (i = 0; i < this.kerbals.length; i++) {
            var myKerbal = this.kerbals[i]
            this.myOutput += "<tr id=\""+myKerbal.state+"\" >";
            this.myOutput += "<td>"+myKerbal.name+ "</td>";
            this.myOutput += "<td>"+myKerbal.trait+ "</td>";
            this.myOutput += "<td id=\""+myKerbal.state+"\" > "+myKerbal.state+ "</td>";
            this.myOutput += "<td>"+JSON.stringify(myKerbal.career)+ "</td>";
            this.myOutput += "</tr>";
        }
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


    this.showData = function(tagOutput){
        this.myOutput = "<table id=\"blauw\"+><tr><th>Name</th><th>Trait</th><th>State</th><th>Career</th></id></tr>";
        this.myOutput += "<tr id=\""+this.state+"\" >";
        this.myOutput += "<td>"+this.name+ "</td>";
        this.myOutput += "<td>"+this.trait+ "</td>";
        this.myOutput += "<td id=\""+this.state+"\" > "+this.state+ "</td>";
        (this.career)

        //this.myOutput += "<td>"+JSON.stringify(this.career)+ "</td>";
        var s = beautifyCareer(this.career)
        this.myOutput += "<td>"+s+ "</td>";

        this.myOutput += "</tr>";
        this.myOutput += "</table>";
        document.getElementById(tagOutput).innerHTML = this.myOutput;
    }
}

function beautifyList(s) {
    var arr = s.split(" ");

    // count unique occurences
    var counts = {};
    for (var i = 0; i < arr.length; i++) {
        counts[arr[i]] = 1 + (counts[arr[i]] || 0);
    }

    var result = ''
    for(key in counts) {
        if(counts.hasOwnProperty(key)) {
            var value = counts[key];
            if (key!='') {
                result = result + key + ' (' + value + 'x), ';
            }
        }
    }
   return result
}

function beautifyCareer(career) {
    var myOutput = "<tr>"
    myOutput += "<td>- Total flights    : " + career.flights + "</td>";
    //myOutput += "<td>- Orbited   : " + beautifyList(career.orbit) + "</td>";

    s = beautifyList(career.orbit)
    if (s!='') {
        myOutput += "<td>- Orbited : " + s + "</td>";
    } else {
        myOutput += "<td></td>";
    }

    s = beautifyList(career.land)
    if (s!='') {
        myOutput += "<td>- Landed on : " + s + "</td>";
    } else {
        myOutput += "<td></td>";
    }

    s = beautifyList(career.flag)
    if (s!='') {
        myOutput += "<td>- Planted flag on : " + s + "</td>";
    } else {
        myOutput += "<td></td>";
    }
    myOutput += "</tr>";
    return myOutput;
}

function Career(name, flights, orbit, land) {
    this.flights = flights
    this.orbit = orbit
    this.land = land

}

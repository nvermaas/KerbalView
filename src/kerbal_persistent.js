// kerbal_persistent.js
// Nico Vermaas - 23 aug 2017
// node.js program to parse kerbal persistent.sfs file

var dm = require("./kerbal_server_datamodel.js")

const ROSTER = "ROSTER"
const KERBAL = "KERBAL"
const NAME = "name"
const TRAIT = "trait"
const STATE = "state"
const CAREER_LOG = "CAREER_LOG"
const FLIGHT_LOG = "FLIGHT_LOG"

const PART = "PART"
const PART_NAME = "name"
const PART_STATE = "PrtActive"
const VESSEL = "VESSEL"


const LAND = "Land"
const ORBIT = "Orbit"
const PLANT_FLAG = "PlantFlag"
const EXIT_VESSEL = "ExitVessel"

EOL = "\n"

var current_pointer = 0;
var global_data = '';

//========= INTERFACE (public functions) ==========

// Read all the Kerbals from the kerbal persistent.sfs file and return them in a list
exports.readParts = function(data, partName) {
    console.log('readParts('+partName+')')
    global_data = data;

    var myParts = []

    //skipToRoster()

    var part = getNextPart(partName)
    while (part != null) {
        myParts.push(part)
        part = getNextPart(partName)
    }
    return myParts
}

function getNextPart(partName) {
    var name = ''
    var state = ''
    var vessel = ''

    var searchString = PART_NAME +" = " + partName;
    var line = readLine()

    // first read to the finding of the searchString keyword
    while (line.indexOf(searchString) < 0 && line.length > 0) {
        line = readLine()
    }

    // if no 'searchString' is found, then break from this function
    if (line.length == 0) {
        return null
    } else {
        console.log(line)
        name = trimToValue(line)
    }

    // read till next search string, the PART_STATE
    searchString = PART_STATE
    while (line.indexOf(searchString) < 0 && line.length > 0) {
        line = readLine()
    }
    console.log(line)
    state = trimToValue(line)

    // create a new Kerbal object
    var part = new Part(name, state, vessel)
    return part

}

//------------------------------------------------------------

// Read all the Kerbals from the kerbal persistent.sfs file and return them in a list
exports.readKerbals = function(data, state) {
    console.log('readKerbals('+state+')')
    global_data = data;
    if (state == null) {
        state = 'all'
    }

    var myKerbals = []

    skipToRoster()

    var kerbal = getNextKerbal()
    while (kerbal != null) {
        if ((kerbal.state == state) || (state == 'all')) {
            myKerbals.push(kerbal)
        }
        kerbal = getNextKerbal()
    }
    return myKerbals
}

//========= IMPLEMENTATION (private functions) ==========

// kerbal = Nico => Nico
function trimToValue(s,separator) {

    if (separator==null) {
        separator = "="
    }

    var mylist = s.split(separator)
    var value = mylist[1]
    value = value.trim()
    return value
}

function readLine() {
    var line_end = global_data.indexOf(EOL,current_pointer)
    var length = line_end - current_pointer + 1
    var line = global_data.substr(current_pointer,length).trim()
    current_pointer += length;
    return line
}

function skipToRoster() {
    var pos = global_data.indexOf(ROSTER)
    if (pos>0) {
        current_pointer = pos;
    }
}
function getCareer(name, line) {
    var level = 1
    var flights = 0
    var orbit = ''
    var land = ''
    var flag = ''

    // then read the first {
    while (line.indexOf("{") < 0) {
        line = readLine()
    }

    // and continue reading until the correct closing } is read

    while (level > 0) {
        line = readLine()

        // count the curly brackets
        if (line.indexOf("{") >= 0) {
            level = level + 1
        }
        if (line.indexOf("}") >= 0) {
            level = level - 1
        }

        if (line.indexOf("flight =") >= 0) {
            flights = Number(trimToValue(line));
        }

        if ((line.indexOf(LAND) >= 0) && (line.indexOf("Kerbin") < 0)) {
            land = land + " " + trimToValue(line, ",")
        }

        if ((line.indexOf(ORBIT) >= 0) && (line.indexOf("Kerbin") < 0)) {
            orbit = orbit + " " + trimToValue(line, ",")
        }

        if (line.indexOf(PLANT_FLAG) >= 0) {
            flag = flag + " " + trimToValue(line, ",")
        }

    }
    // create a new Career object
    var career = new Career(flights, orbit.trim(), land.trim(), flag.trim())
    return career
}

function addFlightLog(career,line) {
    var level = 1
    var orbit = career.orbit
    var land = career.land
    var flag = career.flag

    // then read the first {
    while (line.indexOf("{") < 0) {
        line = readLine()
    }

    // and continue reading until the correct closing } is read
    while (level > 0) {
        line = readLine()

        // count the curly brackets
        if (line.indexOf("{") >= 0) {
            level = level + 1
        }
        if (line.indexOf("}") >= 0) {
            level = level - 1
        }

        if ((line.indexOf(LAND) >= 0) && (line.indexOf("Kerbin") < 0)) {
            land = land + " " + trimToValue(line, ",")
        }

        if ((line.indexOf(ORBIT) >= 0) && (line.indexOf("Kerbin") < 0)) {
            orbit = orbit + " " + trimToValue(line, ",")
        }

        if (line.indexOf(PLANT_FLAG) >= 0) {
            flag = flag + " " + trimToValue(line, ",")
        }
    }

    // update career object
    career.orbit = orbit.trim()
    career.land = land.trim()
    career.flag = flag.trim()
    return career
}


function getNextKerbal() {
    var line = readLine()

    // first read to the 'KERBAL' keyword
    while (line.indexOf(KERBAL) < 0 && line.length > 0) {
        line = readLine()
    }

    // if no 'KERBAL' is found, then break from this function
    if (line.length == 0) {
        return null
    }

    // then read the first {
    while (line.indexOf("{") < 0) {
        line = readLine()
    }

    // and continue reading until the correct closing } is read
    var level = 1
    var name = ''
    var trait = ''
    var state = ''

    while (level > 0) {
        line = readLine()

        // count the curly brackets
        if (line.indexOf("{") >= 0) {
            level = level + 1
        }
        if (line.indexOf("}") >= 0) {
            level = level - 1
        }

        // read the properties of this Kerbal
        if (line.indexOf(NAME) >= 0) {
            name = trimToValue(line)
        }
        if(line.indexOf(TRAIT) >= 0)
        {
            trait = trimToValue(line)
        }
        if (line.indexOf(STATE) >= 0) {
            state = trimToValue(line)
        }

        // get the career log
        if (line.indexOf(CAREER_LOG) >= 0) {
            career = getCareer(name, line)
        }

        // add the current flight to the career log
        if (line.indexOf(FLIGHT_LOG) >= 0) {

            if (career.flights >= 0) {
                career = addFlightLog(career, line)
            }
        }
    }

    // count the current assigned flight also
    if (state == 'Assigned') {
        career.flights += 1
    }

    // create a new Kerbal object
    var kerbal = new Kerbal(name, trait, state, career)
    return kerbal

}


#!/usr/bin/python

from ksplib.model import Kerbal, Career

# constants

ROSTER = "ROSTER"
KERBAL = "KERBAL"
NAME = "name"
TRAIT = "trait"
STATE = "state"
CAREER_LOG = "CAREER_LOG"
FLIGHT_LOG = "FLIGHT_LOG"

#global line
line=""

# general helper functions
def trimToValue(s,separator="="):

    mylist = s.split(separator)
    value = mylist[1]
    value = value.strip()
    return value


# business logic functions
def skipToRoster(f):
    """Skip to 'ROSTER' in the kerbal save file"""

    line = f.readline()

    while line.find(ROSTER) < 0:
        line = f.readline()
    return


def getCareer(f,line):
    level = 1
    flights = 0
    orbit = ''
    land = ''

    # read the first {
    while line.find("{") < 0:
        line = f.readline()
    # and continue reading until the correct closing } is read

    while level > 0:
        line = f.readline()

        # count the curly brackets
        if line.find("{") >= 0:
            level = level + 1

        if line.find("}") >= 0:
            level = level - 1

        # read the properties of this Kerbal
        if line.find("flight =") >= 0:
            flights = int(trimToValue(line));


        if line.find("Land,") >= 0 and line.find("Kerbin") < 0:
        # skip Kerbin
            land = land + " " + trimToValue(line,",")

        if line.find("Orbit,") >= 0 and line.find("Kerbin") < 0:
        # skip Kerbin
            orbit = orbit + " " + trimToValue(line,",")

    # create a new Career object
    career = Career(flights, orbit, land)
    return career


def addFlightLog(f, line, career):
    level = 1
    orbit = career.orbit
    land = career.land

    # read the first {
    while line.find("{") < 0:
        line = f.readline()
    # and continue reading until the correct closing } is read

    while level > 0:
        line = f.readline()

        # count the curly brackets
        if line.find("{") >= 0:
            level = level + 1

        if line.find("}") >= 0:
            level = level - 1

        # read the properties of this Flight Log

        if line.find("Land,") >= 0:
            # skip Kerbin
            if line.find("Kerbin") < 0:
                land = land + " " + trimToValue(line,",")

        if line.find("Orbit,") >= 0:
            # skip Kerbin
            if line.find("Kerbin") < 0:
                orbit = orbit + " " + trimToValue(line,",")

    # create a new Career object
    career.orbit = orbit
    career.land = land
    return career

def getNextKerbal(f):
    """Read next Kerbal from kerbal save file"""
    line = f.readline()

    # first read to the 'KERBAL' keyword
    while line.find(KERBAL) < 0 and len(line) > 0:
        line = f.readline()

    # if no 'KERBAL' is found, then break from this function
    if len(line) == 0:
        return None

    # then read the first {
    while line.find("{") < 0:
        line = f.readline()

    # and continue reading until the correct closing } is read
    level = 1
    name = ''
    trait = ''
    state = ''

    while level > 0:
        line = f.readline()

        # count the curly brackets
        if line.find("{") >= 0:
            level = level + 1

        if line.find("}") >= 0:
            level = level - 1

        # read the properties of this Kerbal
        if line.find(NAME) >= 0:
            name = trimToValue(line)

        if line.find(TRAIT) >= 0:
            trait = trimToValue(line)

        if line.find(STATE) >= 0:
            state = trimToValue(line)

        # get the career log
        if line.find(CAREER_LOG) >= 0:
            career = getCareer(f, line)

        # add the current flight to the career log
        if line.find(FLIGHT_LOG) >= 0:
            if career.flights>0:
                career = addFlightLog(f, line, career)

    # create a new Kerbal object
    kerbal = Kerbal(name, trait, state, career)
    return kerbal


def readKerbals(filename):
    """Read all the Kerbals from the kerbal persistent.sfs file and return them in a list"""
    myKerbals = []
    # open save file, called 'persistent.sfs' in Kerbal.
    with open(filename, 'r') as f:
        # skip to 'ROSTER'
        skipToRoster(f)

        kerbal = getNextKerbal(f)

        while not kerbal == None:
            myKerbals.append(kerbal)
            kerbal = getNextKerbal(f)

    # close file
    f.close()

    return myKerbals

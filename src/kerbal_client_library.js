// kerbal_client_library.js
// Nico Vermaas - 22 aug 2017
// javascript library that contains mostly communication functions that can be called from the html file.

window.onload = function(){
    // initialisation
    // the onload makes sure that all functions in this script file are loaded before the html is rendered
 }

var my_default_host = "http://uilennest.net/KerbalView/api";
var my_default_state = "all";

// === INTERFACE (public functions) - called from HTML ===
// read the selected host from a list of radio buttons
function getHost(hosts) {
    var rates = document.getElementsByName('rate');
    var host;
    for(var i = 0; i < hosts.length; i++){
        if(hosts[i].checked){
            host = hosts[i].value;
        }
    }
    if (host == null) {
        host = my_default_host
    }
    return host
}

// read the selected state from a list of radio buttons
function getState(states) {
    console.log('getStates()')
    var states = document.getElementsByName('state');
    var state;
    for(var i = 0; i < states.length; i++){
        if(states[i].checked){
            state = states[i].value;
            console.log('*** state = '+state)
        }
    }
    if (state == null) {
        state = my_default_state
    }
    return state
}

//--- get kerballist through asynchronous REST API ----
function getKerbalList(hosts, states) {
    var myHost = getHost(hosts)
    var myState = getState(states)
    console.log("getKerbalList("+myHost+","+myState+")");
    callKerbaListAPI(myHost,myState);
}

function getKerbal(hosts, name) {
    var myHost = getHost(hosts)
    console.log("getKerbal("+name+")");
    callKerbalAPI(myHost, name);
}

function getKerbalCurrentHost(name) {
    console.log("getKerbalCurrentHost("+name+")");
    console.log("current_host = "+current_host)
    callKerbalAPI(current_host, name);
}

// === IMPLEMENTATION (private functions) - called from this JavaScript file only===

// strange... chrome gives a CORS error, while firefox works
// asynchronous ajax call to kerbal list
function callKerbaListAPI(myHost, state) {
    console.log("callKerbaListAPI("+state+")")

    var my_url = myHost+"/kerbals?state="+state;
    var html_url = "<a href = \"" + my_url + "\">" + my_url + "</a>";
    document.getElementById("url").innerHTML = html_url;

    // execute an asynchronous GET to the REST API,
    // and execute 'myCallbackFunction' when the results come back.
    $.ajax({
        url: my_url,
        type: 'GET',
        crossDomain: true,
        success: function() { console.log('GET completed'); }
    }).done( myKerbalListCallbackFunction );
}

// the callback function for the ajax call
function myKerbalListCallbackFunction(my_result) {
    console.log("myKerbalListCallbackFunction()");

    var kerbalList = new KerbalList();
    kerbalList.addJsonResult(my_result);
    kerbalList.showData("kerbal_list");
}

//--------------------------------------------------------------------------
// asynchronous ajax call to single kerbal
function callKerbalAPI(myHost, name) {
    console.log("callKerbalAPI("+name+")")
    var my_url = myHost+"/kerbal?name="+name;
    var html_url = "<a href = \"" + my_url + "\">" + my_url + "</a>";
    document.getElementById("url").innerHTML = html_url;

    // execute an asynchronous GET to the REST API,
    // and execute 'myKerbalCallbackFunction' when the results come back.
    $.ajax({
        url: my_url,
        type: 'GET',
        success: function() { console.log('GET completed'); }
    }).done( myKerbalCallbackFunction );
}

// the callback function for the ajax call
function myKerbalCallbackFunction(my_result) {
    var kerbal = new Kerbal();
    kerbal.addJsonResult(my_result);
    //kerbal.showData("kerbal")
    kerbal.showData("kerbal_list")
}


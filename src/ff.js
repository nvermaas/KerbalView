
    // split list into array
    var s = "mun mun duna mun ike"


    // ==================================================================
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
            result = result + key + '(' + value + 'x) ';
        }
    }




    // ==================================================================
    console.log(result)
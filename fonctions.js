/**
 * Take a vtt file and return a array of the content line by line 
 *
 * @param {file} - the path the to file
 * @return {array}
 */
function ReadAsArray(file) {
    var result = null;
    $.ajax({
           url: file,
           type: 'get',
           dataType: 'html',
           async: false,
           success: function(data) {
                var items = data.split('\n\r');
                $.each(items, function(index, value) {
                       var item = items[index].split('\n');
                       result = $.map(item, function(value, index) {
                                      return [value];
                        });
                });
           }
    });
    return result;
}

/**
 * Take a time and a activity to log on the server and send it to send.php
 *
 * @param {file} - the path the to file
 * @return {array}
 */
 function SendActivity(activity,data){
    var full_data = activity + ";" + data + "\n"
            $.ajax({
                url: 'send.php', 
                type: 'post',
                data: {'data': full_data}, 
                success: function( data, textStatus, jQxhr ){
                    console.log('success');
                },
                error: function( jqXhr, textStatus, errorThrown ){
                    console.log( errorThrown );
                }
            })
}


String.prototype.isEmpty = function() {
    return (this.length == 0 || !this.trim());
}; 

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

/**
 * Takes a vtt array in imputs and returns an array of time (min, max, index)
 *
 * @param {data} array - the vtt array
 * @return {array}
 */
function ExtractTime(data){
    var result = new Array();
    var line = 0;
    console.log(typeof data);
    for(i = 0;i < Object.size(data);i++){
        line = data[i];
        if(line.match(/\d\d:\d\d:\d\d.\d\d\d --> \d\d:\d\d:\d\d.\d\d\d/)){
            line = line.replace(" --> ", ".");
            line = line.replace(" ", "");
            var tmp = line.split(/[:.]/);
            var min = (((+tmp[0]) * 60  + (+tmp[1])) * 60 + (+tmp[2]));
            var max = (((+tmp[4]) * 60 + (+tmp[5])) * 60 + (+tmp[6]));
            var newEl = new time(min, max, i);
            result.push(newEl); 
        }
    }
    return result;
    
}



/**
 * Takes a vtt array and returns an array of string close to Currentime (call to Cleanwanted)
 *
 * @param {number} CurrentTime - time
 * @param {array} VTTArray - array of all vtt
 * @param {array} TIMEArray - array of time and index
 * @return {array}
 */
function CurrentContent(CurrentTime, VTTArray, TIMEArray ){
    var tmp = VTTArray.slice(); 
    CurrentTime = Math.floor(CurrentTime);
    var time_min = CurrentTime - 10;
    var time_max = parseInt(CurrentTime) + 10;
    var index_min = FindTime(time_min, TIMEArray, 1);
    var index_max = FindTime(time_max, TIMEArray, 2);
    tmp = tmp.slice(index_min, index_max);
    console.log(tmp);
    return cleanCurrentContent(tmp);
}

/**
 * Takes a vtt array and returns vtt array with out non wanted line (ie number - blank..) 
 *
 * @param {array} VTTArray - array from CurrentContent
 * @return {array}
 */
function cleanCurrentContent(CurrentContent){
    var result = CurrentContent.slice(); 
    var line;
    var reg = /^\d+$/;
    for (i = 0; i < Object.size(result); i++){
        if (Object.size(result[i]) == 0 || result[i].match(/\d\d:\d\d:\d\d.\d\d\d --> \d\d:\d\d:\d\d.\d\d/)){
            result.splice(i, 1);
        }
        else if (Object.size(result[i].match(reg))){
            }

        else {
            result[i-1] = result[i-1].removeStopWords();
            result[i] = result[i].removeStopWords();
        }

    }
    return VTT_to_String_Array(result);
    
}

/**
 * Takes a vtt array and returns string array 
 *
 * @param {array} data - array from CleanCurrentContent
 * @return {array}
 */
function VTT_to_String_Array(data){
    var result = new Array(); 
    var line; 
    for(i = 0; i < Object.size(data); i++){
        var tmp = new Array(); 
        line = data[i]; 
        tmp = line.split(' '); 
        for (j = 0; j < Object.size(tmp); j++){
          result.push(tmp[j]); 
        }
    }
    return result; 
}



/**
 * Takes a string array and return string in key_words array
 *
 * @param {array} data - array from string
 * @return {string} - string separated by +
 */
function Find_Key_Word(data){
    var url = '';
    Key = intersect(data, key_words);
    for(i = 0; i < Object.size(Key); i++){
        console.log(Key[i]); 
        url+="+"+Key[i]; 
    }
    return url; 
}

/**
 * Check if a string is in a array return -1 if not otherwise retrun index of the string 
 *
 * @param {array} array - 
 * @param {string} string to test
 * @return {booleen}
 */
function stringInArray(array, string) {
    var index = array.indexOf(string.toLowerCase()); 
    if(index > -1){
        return index; 
    } else {
        return -1; 
    }
}

/**
 * return the index of the vtt array coresponding to the the given time
 *
 * @param {number} given time 
 * @param {array} TIMEArray
 * @param {passage} first or seconde passage
 * @return {number} index in vtt array
 */
function FindTime(time, TIMEArray, passage) {
    for (j = 0; j < Object.size(TIMEArray); j++) {
        if (time >= TIMEArray[j].min && time <= TIMEArray[j].max || time <= TIMEArray[j].min) {
            if(passage == 2){
                j++;
            }
            return TIMEArray[j].index;       
        }
    }    
}


/**
 * compute the intersection of the array
 *
 * @param {array} first array
 * @param {array} second array
 * @return {array} element in both array
 */
function intersect(a, b){
  var ai=0, bi=0;
  var result = new Array();

  for(i = 0; i < Object.size(a); i++){
    if(b.includes(a[i]) & !result.includes(a[i])){
        result.push(a[i]);
    }
  }
  return result;
}



/*
 *Set up the configuaration of the Helper - And log the activity 
 * 
 */
function diri(){
            var choix = document.config.choice.selectedIndex;
            switch (choix){
            case 1:
                //Configuration Help
                //document.getElementById("help").style.display = "initial";
                configPause = 0; 
                configHelp = 1; 
                if(interval =! null){
                    clearInterval(interval); 
                }
                if (intervalCurrentTime =! null){
                    clearInterval(intervalCurrentTime); 
                }
                break;
            case 2:
                //Configuration Pause
                //document.getElementById("help").style.display = "none";
                configPause = 1; 
                configHelp = 0; 
                if(interval =! null){
                    clearInterval(interval); 
                }
                var intervalCurrentTime = setInterval(updateCurrentTime, 1000);
                break;
            case 3: 
                //Configuration Time
                //document.getElementById("help").style.display = "none";
                configPause = 0; 
                configHelp = 0; 
                interval = setInterval(checkTime, 100);
                if (intervalCurrentTime =! null){
                    clearInterval(intervalCurrentTime); 
                }
                break;
            default:
                console.log("default"); 
                configPause = 0; 
                if(interval =! null){
                    clearInterval(interval); 
                }
                if (intervalCurrentTime =! null){
                    clearInterval(intervalCurrentTime); 
                }
                //document.getElementById("help").style.display = "none";
                break;
            }
            SendActivity(choix + 4, player.currentTime()); // 5 is an offset for the db 
            if(configHelp == 1){
                overlay[0]["start"] = 0; 
                overlay[0]["end"] = player.duration(); 
            } else {
                overlay[0]["start"] = timeDisplayHelp; 
                overlay[0]["end"] = timeDisplayHelp; 
            }
            for(i = 1; i < 5;  i++){
                overlay[i]["content"] = "";
                overlay[i]["title"] = "";
                overlay[i]["end"] = 0; 
            }
            player.currentTime(timeDisplay-0.001);
                player.overlay({
                   overlays: overlay,
                });
                player.currentTime(timeDisplay);
            
            console.log(choix, "config Pause = ", configPause); 
        }


function ChangeOverlay(index, url, title){
            overlay[index]["title"] = url; 
            overlay[index]["start"] = 0; 
            overlay[index]["end"] = timeDisplay + 3; 
            var win = '<button onclick="display('+index+')">'+title+'</button>'
            overlay[index]["content"] = win; 
        }

/**
 * This function open url in new tab - and call SendActivity() to log activity 
 *
 * @param {index} the index of the overlay
 */
 function display(index){
            url = overlay[index]['title']
            var win = window.open(url, '_blank');
            url = url.replace("http://stackoverflow.com/questions/", ''); 
            SendActivity('8', player.currentTime()+';'+url); 
        }





var language = "scala";
var title = "tail-recursion";
var url = "http://stackoverflow.com/search?q="; 

var key_words = new Array(
 'functions',
 'recursion', 
 'arguments', 
 'substitution',
 'algorythm', 
 'GCD', 
 'modular',
 'reduction',
 'factorial',
 'recursive',
 'stack'
 ); 


/**
 * open a window to make a query direct on stackoverflow
 *
 *
 */
function queryStackOverflow(){
    var url = "http://stackoverflow.com/search?q="; 
    var data = ""; 
    var query = ""; 
    var tmp = new Array(); 
    data = prompt("enter your query", "Example: scala function"); 
    console.log(data); 
    tmp = data.split(' ');
    for(i = 0;i < Object.size(tmp);i++){
        query = query+"+"+tmp[i]; 
        if (stringInArray(key_words, tmp[i]) == -1){
            key_words.push(tmp[i]);
            console.log(key_words); 
            console.log("add a word in key_word :", tmp[i]);  
        }
    }
    query = query.substr(1); 
    var win = window.open(url+query, '_blank');
    win.focus();
}

/**
 * Takes a number and returns its square value
 *
 * @param {number} num - The number for squaring
 * @return {number}
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
 * Takes a time (float) and returns its seconde value
 *
 * @param {number} num - time
 * @return {number}
 */
function concatSeconde(CurrentTime){
    console.log(CurrentTime); 
    var tmp = CurrentTime.toString().split(".");
    console.log(tmp); 
    return tmp[0];
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
    CurrentTime = concatSeconde(CurrentTime);
    var time_min = CurrentTime - 5;
    var time_max = parseInt(CurrentTime) + 5;
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

//not used
function Made_URL(data){
    console.log("ON PASSE ICI !!!!!!!!!!!"); 
    var url = "http://stackoverflow.com/search?q="; 
    url = url+"+"+language+"+"+title; 
    Key = intersect(data, key_words);
    console.log(Object.size(Key)); 
    for(i = 0; i < Object.size(Key); i++){
        console.log(Key[i]); 
        url+="+"+Key[i]; 
    }
    return url; 
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


//not used 
function Counter(VTTArray){
	var result = new Array();
	var double = new Array();
	var tmp = new Array();
	var size_res = 0; 
	var size_tmp = 0; 
	var line = 0; 
    for(j = 0; j < Object.size(VTTArray); j++){
		line = VTTArray[j]; 
		if(line.match(/^\d+$/)){
			console.log("enfin"); 
		} else {
			tmp = line.split('\n\r'); 
			size_tmp = Object.size(tmp); 
			size_res = Object.size(result); 
			for (i = 0; i < size_tmp; i++){
				for(k = 0; k < size_result; k++){
					if (tmp[i] == result[k]){
						double.push(tmp[i]); 
					}
					result.push(tmp[i]); 
				}
			}
		}
	}
	console.log(double); 
	return double; 
}

/**
 * change the href and text of html balise 
 *
 * @param {number} id of the balise 
 * @param {string} href of the balise
 * @param {stngri} text to print 
 */
function ChangeURL(id, url, text){
        document.getElementById(id).removeAttribute("href");
        document.getElementById(id).setAttribute("href",url);
        document.getElementById(id).innerHTML = text;
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






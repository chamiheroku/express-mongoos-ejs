// questa funzione prende in ingresso i tempi e gli strasforma in mondo da inserire su database

var intervallo = function async(hour,min, sec){
    if(isNaN(hour)){
    // se non è un numero assegna uno zero
        hour = 0 ;
    }
    else {
       // hor = 0 ;
        if(hour == '') { hour = 0 ;}
        if(hour == ' ') {  hour = 0 ;}
        hour = hour * 3600000 ;
    }
    
    if(isNaN(min)){
       // se non è un numero assegna uno zero
        min = 0 ;
        console.log(min)
    }
    else {
    
        if(min == '') {  min = 0 ;}
        if(min == ' ') {  min = 0 ;}
        min = min * 60000 ;
    }

    if(isNaN(sec)){
     // se non è un numero assegna uno zero

    sec = 0 ;
    }
    else {
      
        if(sec == '') { sec = 0 ;}
        if(sec == ' ') { sec = 0}
            sec = sec * 10000 ;
    }

   // console.log("hour : " + hour + " min : "+ min + " sec : "+ sec)
    var tot = hour + min + sec ;
    if(tot === 0 ){
        tot = 10000 ;
    }
    return tot ;
}


var x = NaN;
var y = 4 ;
isNaN(x);        // true
Number.isNaN(x); // true
x !== x;         // truels

//console.log(Number('rwe3'));

//console.log("tot : " + respIntvallo(0,0,0) );
module.exports.intervallo = intervallo ;
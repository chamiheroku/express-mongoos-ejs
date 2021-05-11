const express = require("express");
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');
const intvallo = require('./timeset/intervallo')


const app = express();
const path = require('path');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
// variabili per index.jes
var get_Max ;
var get_Min ;
var rawLength ;
var time_interval ;
var settInter ;
var set_sec ;
var set_min ;
var set_hour ;
var get_sec ;
var get_min ;
var get_hour ;



const { intervallo } = require("./timeset/intervallo");
;

const port = process.env.PORT || 3000 ;
// connect to the db and start the express server
let db;
rilevazioni_1 = {
  "_id" : 1, 
  "temperatura" : 44,
  "dataOra" : 43
}
// set Templating Enging
app.set('view engine','ejs');

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });


const url = 'mongodb+srv://chami123:chami123@temperature.tomlr.mongodb.net/temperatura?retryWrites=true&w=majority';

//const client = new MongoClient(url,{useUnifiedTopology:true});
mongoose.connect(url)
.then(() => console.log("Mongodb Connected by mongoose"))
.catch(err => console.log(err)) ;

const rilevaSchema = {
  _id : String,
  tempe_rilevata : String,
  dataOra : Date,
  id_senzore : String
};

const timeSchema = {
  _id: String,
  title:String,
  oraInserimento:Date,
  intervallo:Number,
  hour:String,
  min:String,
  sec:String,
  tempe_rilevata : String,
  dataOra : Date,
  id_senzore : String
}

const timeSchama = mongoose.model('rilevazioni_1',timeSchema);
//const rilevSchama = mongoose.model('rilevazioni_1',rilevaSchema);

// Navigation
app.get('/',async(req,res) =>{
  await  timeSchama.find({title:"settime"}, async function(err,rilevazioni_1){
    rilevazioni_1.forEach(doc => {
      settInter =  doc.intervallo;
        get_hour = doc.hour ;
        get_min = doc.min;
        get_sec = doc.sec ;
    })
  });
// calcolo la temperatura Minima
  timeSchama.find({})
 .sort({tempe_rilevata : 1})
 .exec( function (err,goods){
  rawLength = goods.length ;
   for(var i = 0 ; i < goods.length ; i++){
     if (isNaN(goods[i].tempe_rilevata)!= true){
       console.log(goods[i].tempe_rilevata)
       get_Min = goods[i].tempe_rilevata ;
break ;
     }
    }
   }
)
// calcolo la temperatura Massima
timeSchama.find({})
.sort({tempe_rilevata : -1})
.exec( function (err,goods){
 //rawLength = goods.length ;
  for(var i = 0 ; i < goods.length ; i++){
    if (isNaN(goods[i].tempe_rilevata)!= true){
      console.log(goods[i].tempe_rilevata)
      get_Max = goods[i].tempe_rilevata ;
break ;
    }
   }
  }
)
/** 
 * 
 await  timeSchama.find({id_senzore: 'rasp-1'}, async function(err,rilevazioni_1){
   console.log("rilevazioni length : " + rilevazioni_1.length)
   rawLength = rilevazioni_1.length ;
   rilevazioni_1.forEach(doc => {
     console.log("rilevazioni size : " + doc)
    })
    */
  await timeSchama.find({id_senzore:"rasp-1"})
 .sort({dataOra : -1 })
 .limit(10)
 .exec(function (err,rilevazioni_1){
   rilevazioni_1.forEach(doc => {
     console.log(doc)
   })
    res.render('index',{
      rileList:rilevazioni_1, max:get_Max , min:get_Min, righe:rawLength,settime:settInter,  g_hour:get_hour, g_min:get_min, g_sec:get_sec
    })
  })
});

app.get('/settime',(req,res) => {
  res.render('settime' );
});


app.post('/settime', urlencodedParser,async(req,res) =>{
  
  var _sec = req.body.sec
  var _min = req.body.min
  var _hour = req.body.hour

   console.log('input : ' + _hour);
   console.log('input : ' + _min);
   console.log('input : ' +_sec);
   await time_verifica(_hour,_min,_sec)
   
   console.log('output : ' + _hour);
   console.log('output : ' + _min);
   console.log('output : ' +_sec);
   
   //const total = intervallo(req.body.hour,req.body.min,req.body.sec);
   const total = await intervallo(set_hour,set_min,set_sec);
   
   await  timeSchama.findOneAndUpdate({title:"settime"},{oraInserimento:new Date(),intervallo:total,
    hour:set_hour,min:set_min,sec:set_sec},(err, data) =>{
      if(err){
        console.log(err);
      }else{
        // console.log(data.intervallo)
        console.log('min' + set_min)
      }
    })
    
    await  timeSchama.find({title:"settime"}, async function(err,rilevazioni_1){
      rawLength = rilevazioni_1.length ;
      rilevazioni_1.forEach(doc => {
    settInter = doc.intervallo;
    get_hour = doc.hour ;
    get_min = doc.min;
    get_sec = doc.sec ;
  })
});

// calcolo la temperatura Minima
timeSchama.find({})
.sort({tempe_rilevata : 1})
.exec( function (err,goods){
 rawLength = goods.length ;
  for(var i = 0 ; i < goods.length ; i++){
    if (isNaN(goods[i].tempe_rilevata)!= true){
      console.log(goods[i].tempe_rilevata)
      get_Min = goods[i].tempe_rilevata ;
break ;
    }
   }
  }
)
// calcolo la temperatura Massima
timeSchama.find({})
.sort({tempe_rilevata : -1})
.exec( function (err,goods){
//rawLength = goods.length ;
 for(var i = 0 ; i < goods.length ; i++){
   if (isNaN(goods[i].tempe_rilevata)!= true){
     console.log(goods[i].tempe_rilevata)
     get_Max = goods[i].tempe_rilevata ;
break ;
   }
  }
 }
)



await timeSchama.find({id_senzore: 'rasp-1'})
  .sort({dataOra : -1 })
 .limit(10)
 .exec(function (err,rilevazioni_1){
   rilevazioni_1.forEach(doc => {
     console.log(doc)
   })
    res.render('index',{ rileList : rilevazioni_1, max:get_Max , min:get_Min, righe :rawLength,settime:settInter,
     g_hour:get_hour, g_min:get_min, g_sec:get_sec
    })
  })
});

   app.listen(port, () => {
     console.log(`listening on ${port}`)}) ;


     var time_verifica = function async (hour,min,sec){

      console.log('hour ' + hour)
      console.log('min ' + min)
      console.log('sec ' + sec)

      // la funzione time_verifica 
      // se hour,min e sec sono apici assegna 0 e la somma totale dei secondi non deve essere infiriore a 10
       if(hour === '')
       {
         set_hour = 0 ;
         console.log("apici " + set_hour)
        }else {
          set_hour = hour
          console.log('numero ' + hour)
        }
        if(min === '')
        {
          set_min = 0 ;
          console.log("apici " + set_min)
        }else {
          set_min = min
          console.log('numero ' + set_min)
        }
        if(sec === '')
        {
          set_sec = 0 ;
          if(hour === '' || hour === 0)
          {
            set_hour = 0 ;
          }
          if(min === '' || min === 0)
          {
            set_min = 0 ;
          }
         if(set_min === 0 && set_hour === 0  ){
           set_sec = 10 ;
         }
          console.log("set_sec "+ set_sec)
        }else {
                if(hour === '' || hour === 0)
          {
            set_hour = 0 ;
          }else{ }
    
          if(min === '' || min === 0)
          {
            set_min = 0 ;
          }
          if(set_min === 0 && set_hour === 0 && sec <= 10 ){
            set_sec = 10 ;
          }else {
            if(set_min === 0 && set_hour === 0 && sec >= 10 ){
              set_sec = sec ;
            }
            else {
              if((set_min > 0 || set_hour > 0) && sec  >0 ){
                 set_sec = sec ;
               }
             }
          }
          console.log('set_Sec ' + set_sec)
        }
  }
  

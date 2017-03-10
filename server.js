const express = require('express');
const app = express();
//const bodyParser = require('body-parser');
const request = require('request');
const fs = require('fs');
const config = require('./config.json');

const port = 3030;
const apiCachePath = './Local/weatherCache.json';


var logTime=function(req,res,next){
    var date = new Date();
    console.log(date.toUTCString() + '' + req.connection.remoteAddress + ' ' + JSON.stringify(req.headers));
    next();
};

//app.use(logTime);
app.use('/static',express.static('/Public'));

// set headers  - lets just go ahead and let in the world
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.route('/',function(err,req,res){

});

app.get('/',function(req,res){
    res.send("Hello, you probably shouldn't be here");
});


app.get('/weather',function(req,res){
    var data = '';
    fs.createReadStream(apiCachePath)
        .on('data',function(chunk){
            data+=chunk;
        })
        .on('close',function(){
           res.send(data);
        });
});

app.get('/weather/:location',function(req,res){
    console.log(req.params);
    request.get('https://api.darksky.net/forecast/'+config.api.accessKey+'/'+req.params.location)
        .on('error',function(err){
            console.log(err);
        })
        .on('response',function(resp){
            console.log(resp.statusCode);
        })
        .pipe(fs.createWriteStream('./Local/weatherCache.json'));
});


app.listen(port,function(){
   console.log('server running on port: ' + port);
});

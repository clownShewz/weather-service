'use strict';

console.log('Loading function');

const express = require('express');
const app = express();
//const bodyParser = require('body-parser');
const request = require('request');
const fs = require('fs');
const config = require('./config.json');
const apiCachePath = './Local/weatherCache.json';

    var logTime=function(req,res,next){
        var date = new Date();
        console.log(date.toUTCString() + '' + req.connection.remoteAddress + ' ' + JSON.stringify(req.headers));
        next();
    };

    app.use(logTime);
    app.use('/static',express.static('/Public'));

    // set headers  - lets just go ahead and let in the world
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });


    app.get('/weather/:location',function(req,res){
        console.log('getting weather');
        console.log(req.params.location);
        request.get('https://api.darksky.net/forecast/'+config.api.accessKey+'/'+req.params.location).pipe(res);
    });


   //TODO: FINISH THE CACHE REQUEST  -- ADD TIME CHECK FOR API CALLS
    app.get('/weather_cache',function(req,res){
        var data = '';
        fs.createReadStream(apiCachePath)
            .on('data',function(chunk){
                data+=chunk;
            })
            .on('close',function(){
                res.send(data);
            });
    });


module.exports = app;
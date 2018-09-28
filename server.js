const express = require('express');
const  bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const mysql = require('mysql');
let expressWs = require('express-ws');

var connection=[];
////////////DB CONFIGURATION/////////////////////////
const mc = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_clashofcodes'
});
mc.connect();
////////////ROUTER CONFIGURATION/////////////////////////
expressWs = expressWs(express());
const app = expressWs.app;
app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const router = express.Router();
const port = 3000
/////// websocket utilitiy method //////////
var socketControl=module.exports = {
  removeSocket: function(api,socket){
    connection= connection.filter(function(it){
      return !(it.api == api && it.connectedSocket == socket);
    });
  },
  sendToConnectedSocket: function(channel,jsonString) {
    var con= connection.filter(function(it){
     return it.api == channel;
   });
   for(var x in con){
     try{
       con[x].connectedSocket.send(jsonString);
     }catch(e){}
   }
  }
};
////////////REST API///////////////////////////////////
var shop = require('./shopAPI');
shop.foo(router, connection,mc,socketControl);

/////////////////////////////////////////////////
app.use("/api", router);
app.listen(port, '0.0.0.0', function() {
    console.log('Listening to port:  ' + 3000);
});

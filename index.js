var axios = require("axios");
var bodyParser = require("body-parser");
var express = require("express");
var path = require('path');
var Connection = require('tedious').Connection;
var sql = require('sequelize');
var fs = require('fs')
var handlers = require("./routelist.js");
var mongodb = require("mongodb");
const MongoClient = require('mongodb').MongoClient;
var ObjectID = mongodb.ObjectID;
require("dotenv").config();

var TICKETS_COLLECTION = "tickets";

//---------- app setup ---------- //
// create express app
const app = express();

// Set cors headers
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// Tell the application to use body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// Host the following directory to access application
app.use(express.static(path.join(__dirname, '/public')));
//------------------------------------//


//---------- sql connection ----------//
// server config
var config = {
  host: process.env.DB_SERVER,
  port: "1433",
  dialect: "mssql",
  userName: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DB
};
// create sql connection to database
var connection = new sql(config.database, config.userName, config.password, config);
//------------------------------------//


// ---------- Mongo Setup ---------- //
var db;

mongodb.MongoClient.connect(process.env.MONGO, function(err, client) {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  db = client.db('ssl-tool-2');
  console.log("Database connection ready");
    var server = app.listen(process.env.PORT || 8000, function() {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});
//------------------------------------//


//---------- Use Middleware ----------//
app.use(function(req, res, next) {
  req.$scope = {};
  req.db = db;
  req.collection = TICKETS_COLLECTION;
  req.object_id = ObjectID;
  req.connection = connection;
  req.axios = axios;
  return next();
});
//------------------------------------//

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({
    "error": message
  });
}
// ---------- Routes ---------- //

// primary route
app.get('/', function (req, res){
  res.render('/public/index')
})

// tickets
// Get all tickets
app.get("/tickets", handlers.getTickets);
// Create a new ticket
app.post("/tickets", handlers.createTicket);
// Get a ticket by Id
app.get("/tickets/:id", handlers.getSingleTicket);
// Get a ticket by accountname
app.get("/tickets/account/:accountname", handlers.getSingleTicketAccount)
// modify a ticket by ID
app.put("/tickets/:id", handlers.patchTicket);
// delete a ticket by id
app.delete("/tickets/:id", handlers.deleteTicket);

//customers who need ssl renewed
// get list of customers whose ssl needs to be renewed
app.get('/customers', handlers.getCustomers);

//zendesk api calls
// get a zendesk ticket by id
app.get('/zendesk/:id', handlers.getSingleZendesk);
// create a new zendesk ticket
app.post('/zendesk', handlers.createTicketZendesk);
//------------------------------------//

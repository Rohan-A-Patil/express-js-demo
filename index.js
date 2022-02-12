const express = require('express');
const mysql = require('mysql');
// Create global app object
var app = express();

app.use(express.json()); // Specifying input & output format

// Create a connection to the database
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root'
});

//Interceptor(Middleware functions) - Simple request time logger
app.use(function (req, res, next) {
    console.log("A new request received at " + Date.now());
    //This function call is very important. It tells that more processing is
    //required for the current request and is in the next middleware
    next();
});

/* app.get(route, callback):
      This function tells what to do when a get request at the given route is called. 
      The callback function has 2 parameters, request(req) and response(res). 
      The request object(req) represents the HTTP request and has properties for the request query string, parameters, 4
      body, HTTP headers, etc. Similarly, the response object represents the HTTP response that the Express app sends
      when it receives an HTTP request.
*/
app.get('/test', function (req, res) {
    console.log("Inside GET /test")
    connection.query('select * from user_db.user', function (err, rows, fields) {
        if (err) throw err
        res.json({ value: rows});
    })
});

app.post('/test', (req, res) => {
    console.log("Inside POST /test")
    const query =`insert into user_db.user (id,name,age,address)  values (${req.body.id},'${req.body.name}',${req.body.age},'${req.body.address}')`;
    console.log(query);
    connection.query(query, function (err, rows, fields) {
        if (err) throw err
        res.json({value: req.body}) 
    })
})

//open the MySQL connection
connection.connect(error => {
    if (error) {
        console.log("A error has been occurred "+ "while connecting to database.");
        throw error;
    }

    /*app.listen(port, [host], [backlog], [callback]]):
        This function binds and listens for connections on the specified host and port. Port is the only required parameter here.
        Params:
        1. port : A port number on which the server should accept incoming requests.
        2. host : Name of the domain. You need to set it when you deploy your apps to the cloud.
        3. backlog: The maximum number of queued pending connections. The default is 511.
        4. callback:  An asynchronous function that is called when the server starts listening for requests.
   */
    //If Everything goes correct, Then start Express Server
    app.listen(3000, () => {
        console.log("Database connection is Ready and "
            + "Server is Listening on Port ", 3000);
    })
});
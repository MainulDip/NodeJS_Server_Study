const express = require("express");
const fs = require("fs");
const app = express();

// GET Request Route
// test it `curl -X "GET" -s http://localhost:8081/listUsers`
app.get('/listUsers', (req, res) => {
    fs.readFile(__dirname + "/" + "users.json", 'utf8', (err, data) => {
        console.log(data)
        res.end(data)
    })
})

const user = {
    "user4": {
        "name": "mohit",
        "password": "password4",
        "profession": "teacher",
        "id": 4
    }
}


// Post Request Route
// test it `curl -X "POST" -s http://localhost:8081/addUser`
app.post('/addUser', (req, res) => {
    fs.readFile(__dirname + "/" + "users.json", 'utf8', (err, data) => {
        let users = JSON.parse(data);
        let allUsers = {...users, ...user}

        res.writeHead(200, { 'Content-Type': 'application/json' }); // this is important
        // res.end(JSON.stringify(allUsers)); // Not good, `end` should call after sending
        // res.send(allUser); // good approach, string conversion optional
        res.write(JSON.stringify(allUsers)); // another good approach, after `writeHead`, only `write` and `end` will work
        res.end(()=>{
            console.log("Finished Processing")
        })        
    });
});

// GET :id Request Route
// test it `curl -X "GET" -s http://localhost:8081/user/3`
app.get('/user/:id', function (req, res) {
    // First read existing users.
    fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
       var users = JSON.parse( data );
       var user = users["user" + req.params.id] 
       console.log( user );
       // res.writeHead(200, { 'Content-Type': 'application/json' }); // `send` will not with `writeHead`
       res.send(user);
       res.end();
    });
 })

 // DELETE a user with :id
 // test it `curl -X "DELETE" -s http://localhost:8081/deleteUser/3`
 app.delete('/deleteUser/:id', function (req, res) {
    // First read existing users.
    fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
       data = JSON.parse( data );
       delete data["user" + req.params.id];
        
       console.log( data );
       res.writeHead(200, { 'Content-Type': 'application/json' });
       res.end( JSON.stringify(data));
    });
 });

const server = app.listen(8081, () => {
    // the outer variable `server` is already available inside the callback at this point
    var host = server.address().address;
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
});
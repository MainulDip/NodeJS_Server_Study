var express = require('express');
var cookieParser = require('cookie-parser');
var app = express();

app.use(cookieParser());

const cookieName = "cookieFoo"

app.get('/', function (req, res) {
    console.log(req.cookies); // print all cookies in server console
    res.cookie(cookieName, 'express', { expire: 360000 + Date.now() }) //Sets name = express
        .send('cookie set');
});

app.get('/clear_cookie_foo', function (req, res) {
    console.log(req.cookies); // print all cookies in server console
    res.clearCookie(cookieName);
    res.send('cookie foo cleared');
});

app.listen(3000);
const express = require("express")
const app = express();

app.get('/', (req, res) => {
    res.send("hello world")
})

const server = app.listen(8081, () => {
    // the outer variable `server` is already available inside the callback at this point
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
});
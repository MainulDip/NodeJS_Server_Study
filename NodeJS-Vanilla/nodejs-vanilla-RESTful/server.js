const http = require("http");
const router = require("./router");

const PORT = process.env.PORT || 8000;

const server = http.createServer((req, res) => {
    router(req, res);
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
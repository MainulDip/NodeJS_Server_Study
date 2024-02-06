const http = require("http");
const router = require("./routes/blogRoutes");

const PORT = process.env.PORT || 6000;

const server = http.createServer((req, res) => {
  router(req, res);
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
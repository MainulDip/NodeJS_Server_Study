const express = require("express");
const {graphqlHTTP} = require("express-graphql");
const {buildSchema} = require("graphql");

const app = express();

const schema = buildSchema(`
    type Book {
        title: String!
        author: String!
    }

    type Query {
        books: [Book]
    }
`);

const rootValue = {
    books: [
        {title: "The name of the wind", author: "Patric Rothfuss"},
        {title: "The wise man", author: "Patric Rothfuss"},
    ]
}

app.use(graphqlHTTP({schema, rootValue}))

app.listen(3000, () => console.log("Server started on port 8080"));
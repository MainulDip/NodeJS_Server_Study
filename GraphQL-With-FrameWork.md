### Overviews:
This markdown covers quick start personalized guide for running graphql with express and using `express-graphql` (deprecated, use `graphql-http`), `graphql` and With full featured Apollo Framework

### Express + Graphql (no apollo):
```js
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

app.listen(3000, () => console.log("Server started on port 3000"));

// curl -X POST -H "Content-Type: application/json" -d '{"query": "{ books {title, author } }"}' http://localhost:3000/

/* same using multiline shell command
curl -X POST \
-H "Content-Type: application/json" \
-d '{"query": "{ books { title, author } }"}' \
http://localhost:3000/
*/

// this curl command will return books array with title and author properties
```

### Graphql Server Using `graphql-http` and `argument passing` from client's request-payload query:
Graphql server accepts query that is in `query` field. Using `variables` field after query in the client's payload and using `$query_param` when building query, server can response dynamically.

note: Payload is the message data that you send over the internet.

```js
// form client
var dice = 3
var sides = 6
var query = `query RollDice($dice: Int!, $sides: Int) {
  rollDice(numDice: $dice, numSides: $sides)
}`

fetch("/graphql", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  body: JSON.stringify({
    query,
    variables: { dice, sides },
  }),
})
  .then(r => r.json())
  .then(data => console.log("data returned:", data))
```

```js
// graphql server using graphql-http
const express = require("express");
const {createHandler} = require("graphql-http/lib/use/express");
const {buildSchema} = require("graphql");
const {ruruHTML} = require("ruru/server");

# // note: buildSchema can have only one query field, every query option should inside it.
var schema = buildSchema (`
    type Query {
        hello: String
        rollDice(numDice: Int!, numSides: Int): [Int]
    }
`)

var root = {
    hello: () => {
        return "Hello World"
    },

    rollDice: args => {
        var output = []
        for (var i = 0; i < args.numDice; i++) {
          output.push(1 + Math.floor(Math.random() * (args.numSides || 6)))
        }
        return output
    },
}

var app = express();

app.all("/graphql", createHandler({schema, rootValue: root}));

app.get("/", (_req, res) => {
    res.type("html");
    res.end(ruruHTML({endpoint: "/graphql"}));
})

app.listen(3000, () => {
    console.log("Running a GraphQL API server at http://localhost:3000/graphql")
})
```
### Graphql Types (`String`, `Int`, `Float`, `Boolean`, `ID`) and Nullability:
By default, every type is nullable - it's legitimate to return null as any of the scalar types. Use an exclamation point to indicate a type cannot be nullable, so `String!` is a non-nullable string.

To use a list type, surround the type in square brackets, so [Int] is a list of integers.

```js
// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    quoteOfTheDay: String
    random: Float!
    rollThreeDice: [Int]
  }
`)

// The root provides a resolver function for each API endpoint
var root = {
  quoteOfTheDay: () => {
    return Math.random() < 0.5 ? "Take it easy" : "Salvation lies within"
  },
  random: () => {
    return Math.random()
  },
  rollThreeDice: () => {
    return [1, 2, 3].map(_ => 1 + Math.floor(Math.random() * 6))
  },
}
```

### Next 
=> https://graphql.org/graphql-js/running-an-express-graphql-server/ || Follow full official instruction with Authentication
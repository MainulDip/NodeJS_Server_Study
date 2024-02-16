const express = require("express");
const {createHandler} = require("graphql-http/lib/use/express");
const {buildSchema} = require("graphql");
const {ruruHTML} = require("ruru/server");

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


/*

curl -X POST \
-H "Content-Type: application/json" \
-d '{"query": "{ hello }"}' \
http://localhost:3000/graphql

//or from browser console

var p = await fetch("/graphql", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  body: JSON.stringify({ query: "{ hello }" }),
})
  .then(r => r.json())
  .then(data => data)

  console.log(p.data)


// Query rollDice

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

*/
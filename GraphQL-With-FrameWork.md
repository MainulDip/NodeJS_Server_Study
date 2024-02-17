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
* Server impl => graphql server using graphql-http

Note: When a resolver takes arguments, they are passed as one “args” object, as the first argument to the function. Destructuring can be also used.
Note: buildSchema can have only one `query` field, every `query` option should inside it

```js
const express = require("express");
const {createHandler} = require("graphql-http/lib/use/express");
const {buildSchema} = require("graphql");
const {ruruHTML} = require("ruru/server");

// note: buildSchema can have only one `query` field, every `query` option should inside it.
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

    // When a resolver takes arguments, they are passed as one “args” object, as the first argument to the function
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

// The root here provides resolver functions for each API endpoint
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
### Object Type
This can be defined with `ES6 class`, where the resolvers are instance methods
```js
var schema = buildSchema(`
  type RandomDie {
    numSides: Int!
    rollOnce: Int!
    roll(numRolls: Int!): [Int]
  }

  type Query {
    getDie(numSides: Int): RandomDie
  }
`)

// This class implements the RandomDie GraphQL type

class RandomDie {
  constructor(numSides) {
    this.numSides = numSides
  }

  rollOnce() {
    return 1 + Math.floor(Math.random() * this.numSides)
  }

  roll({ numRolls }) {
    var output = []
    for (var i = 0; i < numRolls; i++) {
      output.push(this.rollOnce())
    }
    return output
  }
}

var root = {
  getDie: ({ numSides }) => {
    return new RandomDie(numSides || 6)
  },
}
```

### Mutations and Input Types:
`mutation ...` is required in the graphql query field to mutate data. When defining schema, type `Mutation` and `Input` are also available along with `Query`.

`Query` for data fetching and `Input` type is for using inside mutation function's parameter type

```js
// Note: ID is a type in graphql like, String or Int
var schema = buildSchema(`
    input MessageInput {
        content: String
        author: String
    }

    type Message {
        id: ID!
        content: String
        author: String
    }

    type Query {
        getMessage(id: ID!): Message
    }

    type Mutation {
        createMessage(input: MessageInput): Message
        updateMessage(id: ID!, input: MessageInput): Message
    }
`)

class Message {
    constructor(id, { content, author }) {
        this.id = id
        this.content = content
        this.author = author
    }
}

var fakeDatabase = {};

var root = {
    getMessage: ({ id }) => {
        if (!fakeDatabase[id]) {
            throw new Error("no message exists with id " + id)
        }
        return new Message(id, fakeDatabase[id])
    },
    createMessage: ({ input }) => {
        // Create a random id for our "database".
        var id = crypto.randomBytes(10).toString("hex")

        fakeDatabase[id] = input
        return new Message(id, input)
    },
    updateMessage: ({ id, input }) => {
        if (!fakeDatabase[id]) {
            throw new Error("no message exists with id " + id)
        }
        // This replaces all old data, but some apps might want partial update.
        fakeDatabase[id] = input
        return new Message(id, input)
    },
}
```

* Query the data

```js
var author = "andy"
var content = "hope is a good thing"
var query = `mutation CreateMessage($input: MessageInput) {
  createMessage(input: $input) {
    id // request for id field
    content // request for content field
  }
}`

fetch("/graphql", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  body: JSON.stringify({
    query,
    variables: {
      input: {
        author,
        content,
      },
    },
  }),
})
  .then(r => r.json())
  .then(data => console.log("data returned:", data))
```

### Authentication:
Authentication and Authorization work same way as RESTful server. Modules like Passport, express-jwt, and express-session can be used with `graphql-http`.


### Docs 
=> https://graphql.org/graphql-js/running-an-express-graphql-server/ || Follow full official instruction with Authentication
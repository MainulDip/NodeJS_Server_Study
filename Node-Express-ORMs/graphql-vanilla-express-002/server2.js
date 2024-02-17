var express = require("express")
var { createHandler } = require("graphql-http/lib/use/express")
var { buildSchema } = require("graphql")
var crypto = require("crypto"); // native module

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

var app = express()
app.all(
  "/graphql",
  createHandler({
    schema: schema,
    rootValue: root,
  })
)
app.listen(3000, () => {
  console.log("Running a GraphQL API server at localhost:3000/graphql")
})

/*

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

*/
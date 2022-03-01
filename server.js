const express = require('express')
const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLNonNull, GraphQLInt } = require('graphql')
const app = express()
const expressGraphQL = require('express-graphql').graphqlHTTP

const authors = [
    { id: 1, name: "ahmad" }
]
const books = [
    { id: 1, name: "b1", authorId: 1 },
    {id: 2, name: 'b2', authorId: 2 }
]

const AuthorType = new GraphQLObjectType({
    name: "authos",
    description: "this is list of author",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name:  { type: GraphQLNonNull(GraphQLString) },
        book: {
            type: BookType,
            resolve: (author) => {
                return books.find(book => book.authorId === author.id)
            } 
        }
    })
})

const BookType = new GraphQLObjectType({
    name: "books",
    description: "this is represent books",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLInt) },
        author: {
            type: AuthorType,
            resolve: (book) => {
                return authors.find(author => author.id === book.authorId)
            }
        }
    })
})

const RootQuerySchema = new GraphQLObjectType({
    name: "RootQuery",
    description: "This is root query",
    fields: () => ({
        books: {
            type: GraphQLList(BookType),
            description: "book type",
            resolve: () => books
        },
        authors: {
            type: GraphQLList(AuthorType),
            description: "this is represent authors",
            resolve: () => authors
        },
        Book: {
            type: BookType,
            description: "single book",
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => {
                return books.find(book => book.id === args.id)
            }
        },
        Author: {
            type: AuthorType,
            description: 'single author',
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => {
                return authors.find(author => author.id == args.id)
            }
        }
    })
})

const RootMutation = new GraphQLObjectType({
    name: "RootMutation",
    description: "root mutation",
    fields: () => ({
        AddBook: {
            type: BookType,
            description: "adding a book",
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                authorId: { type: GraphQLNonNull(GraphQLInt) }
            },
            resolve: (parent, args) => {
                const newBook = { id: books.length + 1, name: args.name, authorId: args.authorId }
                books.push(newBook)
                return newBook
            }
        },
        AddAuthor: {
            type: AuthorType,
            description: "Adding a author",
            args: {
                name: {
                    type: GraphQLNonNull(GraphQLString)
                }
            },
            resolve: (parent, args) => {
                const newAuthor = { id: authors.length+1, name: args.name }
                authors.push(newAuthor)
                return newAuthor
            }
        }
    })
})

const schema = new GraphQLSchema({
    query: RootQuerySchema,
    mutation: RootMutation
})

app.use('/graphql', expressGraphQL({
    schema,
    graphiql: true
}))
app.listen(5000)
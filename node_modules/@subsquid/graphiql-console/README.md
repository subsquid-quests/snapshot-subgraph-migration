This is a fork of https://github.com/OneGraph/graphiql-explorer-example wrapped into 
a standalone docker container.

## Usage

```
docker build . -t graphiql-console
docker run \
    -e APP_TITLE='GraphQL console' \
    -e GRAPHQL_API='http://server/graphql' # GraphQL http endpoint as seen by browser
    -p 8888:80
    graphiql-console
```

Now you can go to `http://localhost:8888` and play with your API.

Alternatively, you can omit environment variables and pass all parameters via url:

```
docker run -p 8888:80 graphiql-console
open http://localhost:8888?graphql_api=http%3A%2F%2Fserver%2Fgraphql
```
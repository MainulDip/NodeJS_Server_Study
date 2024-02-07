### Overviews:
cURL, which stands for `client URL`, is a command line tool that developers use to transfer data to and from a server.

https://www.freecodecamp.org/news/how-to-start-using-curl-and-why-a-hands-on-introduction-ea1c913caaaa/

https://everything.curl.dev/usingcurl/verbose/writeout


### Frequently Used Commands:
`curl http://localhost:8080/` or `curl -s http://localhost:8080/` => Get Request

`curl -o output.txt http://localhost:8080/` or `curl http://localhost:8080/ > output.txt` => Putting GET request response into a file named `output.txt`

`curl --data "name=John&surname=Doe" http://www.dataden.tech` or with JSON data `curl -d '{"name":"John","surname":"Doe"}' \http://www.dataden.tech` or with -X flag (-request) method `curl -X "POST" \-d "name=John&surname=Doe" http://www.example.com` => POST request, PUT/DELETE is also there

`curl -w "\nTotal time it took: %{time_total}\n" -s http://localhost:8081/` => GET request with time calculated (of how much time it took to for the server to response)
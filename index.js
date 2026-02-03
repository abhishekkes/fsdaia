const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {

  if (req.method === "GET" && req.url === "/students") 
    {

    fs.readFile("data.json", "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Unable to read file" }));
        return;
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(data);   // send JSON file content
    });

  } 

 else if(req.method === "POST" && req.url === "/students") 
{
       
    let body = "";
    req.on("data", chunk => {
        body += chunk.toString(); // convert Buffer to string
    });
    req.on("end", () => {
        const newStudent = JSON.parse(body);
        
        fs.readFile("data.json", "utf8", (err, data) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Unable to read file" }));
                return;
            }
            const students = JSON.parse(data);
            students.push(newStudent);
            fs.writeFile("data.json", JSON.stringify(students, null, 2), (err) => {
                if (err) {
                    res.writeHead(500, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "Unable to write file" }));
                    return;
                }
                res.writeHead(201, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "Student created successfully" }));
            });
        });
    });
    }





 else {    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not Found" }));
  }
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});

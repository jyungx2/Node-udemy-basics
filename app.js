const http = require("http"); // global module(without './')
const fs = require("fs"); // file system module
// function rqListener(req, res) {}

// Hey! please look for this function with this name and execute it for every incoming request.
// http.createServer(rqListener);

// createServer Callback function: It's called by Node.js whenever a request reaches our server.
const server = http.createServer((req, res) => {
  console.log(req.url, req.method, req.headers); // request 정보 중에 중요한 정보들만 터미널에 출력해보자. (req.url은 url주소('/', '/test', etc...)에 따라 출력값이 달라진다.)

  // 33. Routing Requests
  const url = req.url;
  const method = req.method;

  if (url === "/") {
    res.write("<html>");
    res.write("<head><title>Enter Message</title></head>");
    // 👍 input의 name속성을 지정해주면 유저가 입력한 값이 request 변수에 자동으로 포함되어 전달되어진다.
    res.write(
      '<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>'
    );
    res.write("</html>");
    return res.end(); // 함수 실행을 멈춤(quit function execution)
  }

  // 34. Redirecting Requests
  if (url === "/message" && method === "POST") {
    fs.writeFileSync("message.txt", "DUMMY");
    // res.writeHead(302, {}); // ✨ THIS allows us to write some meta info in one go.(statusCode & setHeader)
    res.statusCode = 302; // 302는 **"Found" (Temporary Redirect)**를 의미하는 HTTP 상태 코드로, 클라이언트가 다른 URL로 이동해야 함을 나타냄
    res.setHeader("Location", "/"); // Location 헤더를 설정하여 클라이언트가 이동해야 할 주소를 지정 => /(홈페이지)로 리다이렉트하도록 지정
    return res.end(); // 응답을 종료하여 아래 코드가 실행되지 않도록 방지 (즉, 리다이렉트 후 추가적인 응답 처리를 하지 않음)
  }
  // 31. Sending Responses
  // setHeader(): allows us to set a new header
  // ✅ 나중에 express.js 프레임워크로 더 간단하게 하는 방법 배울 예정.
  res.setHeader("Content-Type", "text/html");
  res.write("<html>");
  res.write("<head><title>My First Page</title></head>");
  res.write("<body><h1>Hello from my Node.js Server!</h1></body>");
  res.write("</html>");
  res.end(); // response를 다 만들었으면 end()로 명시적으로 끝내줌.
  // res.write(); // 🚨error: end() 코드 이후로 response 변경 불가능

  // process.exit(); // server 실행을 멈추기 위해 작성해야 하는 코드(=> 웹페이지 동작x, 이 코드 없이 서버는 무한대로 계속해서 실행되는 게 원칙, process.exit()은 말그대로 hard exited our event loop and therefore program shuts down)
});

// listen() is a process where Node.js will not immediately exit our script but where Node.js will instead ✨keep this running to listen for incoming requests.✨
server.listen(3000); // node app.js 를 치면 커서가 그 다음줄에 고정된다 -> app.js파일 실행이 끝나지 않고 계속해서 돌아간다는 뜻.(onging looping process)

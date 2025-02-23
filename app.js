const http = require("http"); // Node.js 내장 http 모듈을 불러옵니다.
const fs = require("fs"); // 파일 시스템 모듈을 불러와 파일 읽기/쓰기를 할 수 있습니다.
// function rqListener(req, res) {}

// Hey! please look for this function with this name and execute it for every incoming request.
// http.createServer(rqListener);

// createServer Callback function: It's called by Node.js whenever a request reaches our server.
const server = http.createServer((req, res) => {
  // ✅ 클라이언트로부터 요청(request) 정보를 터미널에 출력합니다.
  // ✨ req.url: 요청한 URL, req.method: HTTP 메소드(GET, POST 등), req.headers: 요청 헤더 정보
  console.log(req.url, req.method, req.headers); // request 정보 중에 중요한 정보들만 터미널에 출력해보자. (req.url은 url주소('/', '/test', etc...)에 따라 출력값이 달라진다.)

  // 33. Routing Requests
  const url = req.url;
  const method = req.method;

  // 1️⃣ 만약 클라이언트가 루트 경로('/')로 요청을 보냈다면...
  if (url === "/") {
    res.write("<html>");
    res.write("<head><title>Enter Message</title></head>");
    // 👍 input의 name속성을 지정해주면 유저가 입력한 값이 request 변수에 자동으로 포함되어 전달되어진다.
    res.write(
      '<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>'
    );
    // action="/message"는 폼 제출 시 /message 경로로 요청을 보낸다는 의미입니다.
    // method="POST"는 POST 방식으로 데이터를 전송합니다.
    // input의 name 속성(message)이 있어야 폼 데이터를 파싱할 때 key 값으로 사용됩니다.
    res.write("</html>");
    return res.end(); // 응답을 종료하고, 이후 코드 실행을 중단합니다.
  }

  // 2️⃣ 만약 요청 URL이 "/message"이고 HTTP 메소드가 "POST"라면...
  if (url === "/message" && method === "POST") {
    // 34. Redirecting Requests
    /*
    fs.writeFileSync("message.txt", "DUMMY");
    // res.writeHead(302, {}); // ✨ THIS allows us to write some meta info in one go.(statusCode & setHeader)
    res.statusCode = 302; // 302는 **"Found" (Temporary Redirect)**를 의미하는 HTTP 상태 코드로, 클라이언트가 다른 URL로 이동해야 함을 나타냄
    res.setHeader("Location", "/"); // Location 헤더를 설정하여 클라이언트가 이동해야 할 주소를 지정 => /(홈페이지)로 리다이렉트하도록 지정
    return res.end(); // 응답을 종료하여 아래 코드가 실행되지 않도록 방지 (즉, 리다이렉트 후 추가적인 응답 처리를 하지 않음)
    */

    // 35. Parsing Request Bodies
    const body = []; // request body: 요청 본문 데이터를 담을 배열 생성

    // 💡 요청 본문에서 데이터가 전달될 때마다 'data' 이벤트가 발생
    req.on("data", (chunk) => {
      console.log(chunk);
      body.push(chunk); // 각 청크를 배열에 추가합니다.
    });

    // 💡 모든 데이터가 전송 완료되면 'end' 이벤트가 발생
    req.on("end", () => {
      // 배열에 담긴 모든 데이터 청크를 하나의 Buffer로 결합한 후 문자열로 변환합니다.
      const parsedBody = Buffer.concat(body).toString(); // Buffer = bus stop
      // 문자열을 "=" 기준으로 분리하여 두 번째 부분(사용자가 입력한 메시지)을 가져옵니다.
      const message = parsedBody.split("=")[1];
      // 메시지를 "message.txt" 파일에 동기적으로 기록합니다.
      fs.writeFileSync("message.txt", message);

      // 추가적으로 응답을 보내 리다이렉트하는 등의 처리를 할 수 있습니다.
      res.statusCode = 302; // HTTP 상태 코드를 302(임시 리다이렉션)로 설정
      res.setHeader("Location", "/"); // 클라이언트를 루트 경로로 리다이렉트
      return res.end();
    });
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

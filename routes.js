const fs = require("fs"); // 파일 시스템 모듈을 불러와 파일 읽기/쓰기를 할 수 있습니다.

const requestHandler = (req, res) => {
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

    // 💡 요청 데이터가 전달될 때마다 'data' 이벤트가 발생 (As request data arrives, Node.js emits 'data' events.)
    // What is chunk❓ ...사용자가 입력한 값이 서버로 넘어와서 처리될 때, chunk라는 작은 데이터 조각으로 나뉘어 전달되고, 이는 네트워크 상황이나 내부 버퍼의 크기에 따라 임의로 나뉘어진다. 보통 데이터 용량이 클수록 내부적으로 여러개의 Chunk로 분할되어 순차전송된다.

    // () => {}: The callback here is registered to collect incoming data chunks.
    req.on("data", (chunk) => {
      console.log(chunk);
      body.push(chunk); // 각 청크를 배열에 추가합니다.
    });

    // 💡 모든 데이터가 전송 완료되면 'end' 이벤트가 발생 (Once all the data has been received, the 'end' event is emitted.)
    req.on("end", () => {
      // 배열에 담긴 모든 데이터 청크를 하나의 Buffer로 결합한 후 문자열로 변환합니다.
      const parsedBody = Buffer.concat(body).toString(); // Buffer = bus stop
      // 문자열을 "=" 기준으로 분리하여 두 번째 부분(사용자가 입력한 메시지)을 가져옵니다.
      const message = parsedBody.split("=")[1];

      // 메시지를 "message.txt" 파일에 ❌"동기적"❌으로 기록합니다.
      // fs.writeFileSync("message.txt", message);

      // 37. Blocking and Non-Blocking Code
      // => 동기적(synchronous) 방식으로 파일을 작성하여, 파일 작성 작업이 완료될 때까지 코드 실행을 차단(block)하는 치명적인 단점 존재! => 비동기적으로 실행되는 writeFile() 사용해야 함!

      // ✅ 파일 작업에는 두 가지 방식이 있습니다.
      // - 동기 방식: 작업이 완료될 때까지 다음 코드 실행을 멈춥니다.
      // - 비동기 방식: 작업을 운영체제에 위임하고, 완료되면 등록한 콜백 함수를 호출합니다.

      // 수백 메가바이트 이상의 큰 파일을 처리하는 경우 동기적 파일 작업은 서버 전체의 응답 지연을 초래하며, 다른 사용자 요청도 처리하지 못하게 만듭니다. 실무에서는 fs.writeFile()과 같이 비동기 메서드를 사용하여, 파일 경로, 데이터, 그리고 작업 완료 후 실행할 콜백 함수를 전달하는 방식으로 구현하는 것이 좋다. ✨Node.js는 "이벤트 드리븐 아키텍처"를 사용하여, "파일 작업을 운영체제에 위임"하고, "작업 완료 시 해당 콜백 함수를 호출"해 후속 작업(예: 응답 전송)을 수행합니다.✨
      fs.writeFile("message.txt", message, (err) => {
        res.statusCode = 302; // HTTP 상태 코드를 302(임시 리다이렉션)로 설정
        res.setHeader("Location", "/"); // 클라이언트를 루트 경로로 리다이렉트
        return res.end();
      });

      // ⛔️ 여기서 주의할 점:
      // req.on('data')와 req.on('end')로 등록된 콜백 함수는 ✨비동기적✨으로 실행됩니다.
      // 즉, 이 이벤트 리스너 등록 이후에 작성된 코드(🍏)가 즉시 실행될 수 있습니다.
      // 만약 "응답 전송 관련 코드"가 이벤트 리스너 외부에 있다면, 데이터 처리가 완료되기 전에 응답이 전송되어 "헤더를 다시 설정할 수 없음" 등의 에러가 발생할 수 있으므로 주의해야 합니다.
      // ✅ 해결책: "데이터 처리에 의존하는" 응답 코드는 반드시 "이벤트 리스너 내부"에 위치시켜야 합니다. => 아래 세 줄의 코드가 end 이벤트의 콜백함수 안으로 들어온 이유.(37번 강의에서 다시 fs.writeFile의 세번째 매개변수의 콜백함수 내부로 들어감)
      // 추가적으로 응답을 보내 리다이렉트하는 등의 처리를 할 수 있습니다.

      // res.statusCode = 302; // HTTP 상태 코드를 302(임시 리다이렉션)로 설정
      // res.setHeader("Location", "/"); // 클라이언트를 루트 경로로 리다이렉트
      // return res.end();
    });
  }

  // 🍏 31. Sending Responses
  // 3️⃣ 위의 조건에 해당되지 않는 경우, 기본 HTML 응답을 전송합니다.
  // ⛔️ 이 부분은 위의 비동기 이벤트 등록 후 즉시 실행될 수 있으므로,
  // 비동기 작업에 의존하는 응답 코드는 반드시 이벤트 리스너 내부에 위치해야 합니다.

  // * setHeader(): allows us to set a new header
  // 🌟 나중에 express.js 프레임워크로 더 간단하게 하는 방법 배울 예정.
  res.setHeader("Content-Type", "text/html");
  res.write("<html>");
  res.write("<head><title>My First Page</title></head>");
  res.write("<body><h1>Hello from my Node.js Server!</h1></body>");
  res.write("</html>");
  res.end(); // 현재까지 작성한 응답을 클라이언트에 전송하고, 응답 스트림을 종료하는 코드
  // => 하지만 이 동작은 단지 HTTP 응답과 관련된 것으로, 응답 전송 이후에 다시 헤더를 설정하는 등 ❌응답 관련 작업을 시도❌하면 오류가 발생할 있을 뿐, 이미 이벤트 루프에 등록된 비동기 콜백 함수들은 그대로 남아있어, 나중에 적절한 시점에 실행됩니다.

  // res.write(); // 🚨error: end() 코드 이후로 response 변경 불가능
  // ⛔️ 주의: 응답을 다 보낸 후에는 res.write() 등으로 응답을 변경할 수 없습니다.
  // Node.js는 내부 이벤트 루프와 이벤트 리스너 레지스트리를 통해 비동기 콜백을 관리합니다.
  // 이로 인해 코드의 실행 순서는 작성 순서와 다를 수 있으니, 비동기 작업에 의존하는 로직은
  // 반드시 해당 콜백 내에 배치해야 합니다.

  // process.exit(); // server 실행을 멈추기 위해 작성해야 하는 코드(=> 웹페이지 동작x, 이 코드 없이 서버는 무한대로 계속해서 실행되는 게 원칙, process.exit()은 말그대로 hard exited our event loop and therefore program shuts down)
};

// 39. Using the Node Modules System
// 1)
// module.exports = requestHandler;

// 2)
// module.exports = {
//   handler: requestHandler,
//   someText: "Some hard coded text",
// };

// 3)
// module.exports.handler = requestHandler;
// module.exports.someText = "Some hard coded text";

// 4) shortcut
exports.handler = requestHandler;
exports.someText = "Some hard coded text";

const http = require("http"); // global module(without './')

// function rqListener(req, res) {}

// Hey! please look for this function with this name and execute it for every incoming request.
// http.createServer(rqListener);

// createServer Callback function: It's called by Node.js whenever a request reaches our server.
const server = http.createServer((req, res) => {
  console.log(req);
  process.exit(); // server 실행을 멈추기 위해 작성해야 하는 코드(=> 웹페이지 동작x, 이 코드 없이 서버는 무한대로 계속해서 실행되는 게 원칙, process.exit()은 말그대로 hard exited our event loop and therefore program shuts down)
});

// listen() is a process where Node.js will not immediately exit our script but where Node.js will instead ✨keep this running to listen for incoming requests.✨
server.listen(3000); // node app.js 를 치면 커서가 그 다음줄에 고정된다 -> app.js파일 실행이 끝나지 않고 계속해서 돌아간다는 뜻.(onging looping process)

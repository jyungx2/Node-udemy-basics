/*
const http = require("http"); // Node.js 내장 http 모듈을 불러옵니다.
const routes = require("./routes");

// function rqListener(req, res) {}

// Hey! please look for this function with this name and execute it for every incoming request.
// http.createServer(rqListener);

// createServer Callback function: It's called by Node.js whenever a request reaches our server.
const server = http.createServer(routes.handler);
console.log(routes.someText); // we can simply output text from one file.

// listen() is a process where Node.js will not immediately exit our script but where Node.js will instead ✨keep this running to listen for incoming requests.✨
// 🖍️ 서버를 시작하고 포트 3000에서 요청을 대기합니다. Node.js의 이벤트 루프는 비동기 이벤트(예: req.on('data'), req.on('end'))를 관리합니다.
server.listen(3000); // node app.js 를 치면 커서가 그 다음줄에 고정된다 -> app.js파일 실행이 끝나지 않고 계속해서 돌아간다는 뜻.(onging looping process)
*/

// 60. Installing Express.js
const express = require("express");
const app = express();

app.use("/", (req, res, next) => {
  console.log("This will always run");
  next();
});

app.use("/add-product", (req, res, next) => {
  console.log("add product!");
  res.send("<h1>The 'Add Product' Page</h1>");
});

app.use("/", (req, res, next) => {
  console.log("In another middleware!");
  res.send("<h1>Hello from Express!</h1>");
});

app.listen(3000);

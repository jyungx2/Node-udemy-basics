const express = require("express");
const bodyParser = require("body-parser"); // 💾 "npm install --save body-parser"

const app = express();

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));

// adminRoutes내의 모든 미들웨어의 path는 기본적으로 무조건 '/admin'로 시작하도록 설정
app.use("/admin", adminRoutes);
app.use(shopRoutes);

// 📌 '/'에 대한 응답처리 미들웨어가 app.get()으로 바뀌면서 라우터 파일 내 지정하지 않은 주소창으로 들어올 때 표시할 페이지 추가할 필요 있음..
app.use((req, res, next) => {
  // send()를 부르기 전까지 chain method로 여러 다른 메소드 호출 가능!
  res.status(404).send("<h1>Page not found</h1>");
});

app.listen(3000);

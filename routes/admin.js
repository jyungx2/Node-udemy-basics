const express = require("express");

const router = express.Router();

// /admin/add-product => GET
router.get("/add-product", (req, res, next) => {
  console.log("add product!");
  res.send(
    '<form action="/add-product" method="POST"><input type="text" name="title"><button type="submit">Add Product</button></form>'
  );
});

// /admin/add-product => POST
// 📌 app.get/post(): Only will fire for incoming get/post request.
// > get: /product 에 접속하면 실행되는 요청 & 그에 대한 응답
// > post: add-product로 접속하여 form(method: POST)을 제출하면 실행되는 요청 & 응답 -> 이 경우에만 아래 코드가 실행되며, 그냥 직접적으로 /prdocut로 접속할 때는 실행되지 않고 '/' 주소의 응답처리를 담당하는 미들웨어만 실행.
router.post("/add-product", (req, res, next) => {
  console.log(req.body); // undefined -> we need another middleware(=body-parser lib 설치)!
  // body-parser 미들웨어 코드 작성 후, {title: 'Book'}이라고 뜨는 것을 확인 ✅
  res.redirect("/");
});

module.exports = router;

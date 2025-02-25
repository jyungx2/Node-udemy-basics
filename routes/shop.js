const path = require("path");
const express = require("express");
const router = express.Router();

// use -> get으로 바꾸면, 1️⃣ 미들웨어는 더 이상 포함여부를 넘어서 exact match를 하기 때문에,
// '/sdakdjlqw'와 같이 /를 포함하는 주소로 접속했을 때는 CANNOT GET / 창이 로드됨!
// 2️⃣ app.js에서 app.use(adminRoutes) & app.use(shopRoutes)의 코드 순서를 바꿔 썼을 때도 /add-product로 접속했을 시, Hello from Express창이 뜨지 않는 이유.. /add-product은 /을 포함할 뿐, 정확한 '/'주소가 아니니까.
router.get("/", (req, res, next) => {
  // res.sendFile("/views/shop.html");
  res.sendFile(path.join(__dirname, "../", "views", "shop.html"));
});

module.exports = router;

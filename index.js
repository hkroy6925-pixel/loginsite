const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 3000;
const SECRET = "secret_key";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --------------------
// DB 설정
// --------------------
const db = new sqlite3.Database("users.db");

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )`);
});

// --------------------
// HTML 페이지
// --------------------
app.get("/", (req, res) => {
  res.send(`
    <h1>로그인 / 회원가입</h1>
    <h2>회원가입</h2>
    <form action="/register" method="POST">
      <input name="username" placeholder="아이디" required />
      <input name="password" type="password" placeholder="비밀번호" required />
      <button type="submit">회원가입</button>
    </form>

    <h2>로그인</h2>
    <form action="/login" method="POST">
      <input name="username" placeholder="아이디" required />
      <input name="password" type="password" placeholder="비밀번호" required />
      <button type="submit">로그인</button>
    </form>
  `);
});

// --------------------
// 회원가입
// --------------------
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  db.run(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, hashed],
    function (err) {
      if (err) {
        return res.send("회원가입 실패 (이미 존재하는 아이디)");
      }
      res.send("회원가입 성공!");
    }
  );
});

// --------------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`서버 실행: ${PORT}`);
});

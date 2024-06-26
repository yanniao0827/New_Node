// console.log(process.env.DB_HOST);
// console.log(process.env.DB_USER);
import jwt from "jsonwebtoken";
import express from "express";
import multer from "multer";
import upload from "./utils/upload-img.js";
import admin2Router from './routes/admin2.js'; //匯入後相當於一個middleware
import session from "express-session";
import moment from "moment-timezone";
import db from "./utils/connect-mysql.js"
import abRouter from "./routes/address-book.js";
import cors from "cors";
import mysql_session from "express-mysql-session";
import bcrypt from "bcrypt";
// const upload =multer({dest:"tmp/uploads"}); 

const app =express();

// 設定ejs，要在路由的前面
app.set("view engine","ejs");

// 在進入路由之前先解析
// 只會解析 application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}));

// 只會解析 application/json
app.use(express.json());

const corsOptions={
  credentials:true,
  origin:(origin,cb)=>{
    console.log({origin});
    cb(null,true);
  }
}
app.use(cors(corsOptions));

const MysqlStore=mysql_session(session);
const sessionStore=new MysqlStore({},db);

app.use(session({
  saveUninitialized:false,
  resave:false,
  // 加密用的字串
  secret:"ancefrgyks",
  store:sessionStore,
  // cookie:{
  //   maxAge:180_000
  // }
}))

// 自訂頂層middleware，因為沒有設定路徑，所以任何東西都會經過這個
app.use((req,res,next)=>{
  res.locals.title="LEA web"
  res.locals.session=req.session;

  const auth = req.get("Authorization"); // 先拿到檔頭的 Authorization 項目值
  if (auth && auth.indexOf("Bearer ") === 0) {
    const token = auth.slice(7);
    try {
      req.my_jwt = jwt.verify(token, process.env.JWT_KEY);
    } catch (ex) {}
  }
  next(); //代表送到下一個middleware
});

// 設定路由，只能用GET方法
app.get("/", (req, res) => {
    // res.send(`<h2>哈囉</h2>`);
    res.render("home", { name: "LEA" });
  });

app.use("/address-book",abRouter);

  app.get("/json-sales", (req, res) => {
    const sales = [
      {
        name: "Bill",
        age: 28,
        id: "A001",
      },
      {
        name: "Peter",
        age: 32,
        id: "A002",
      },
      {
        name: "Carl",
        age: 29,
        id: "A003",
      },
    ];
    res.render("json-sales", { sales });
  });
  
  // 查看query string
  app.get("/try-qs", (req, res) => {
    res.json(req.query); // 查看 query string
  });

  app.get("/try-post-form", (req, res) => {
    res.render("try-post-form");
  });

  // urlencodedParser是一種middleware，把特定格式的資料解析放進req.body中，由 res.json把資料轉成json格式
  // const urlencodedParser=express.urlencoded({extended:true});
  app.post("/try-post-form", (req, res) => {
    res.render("try-post-form", req.body);
  });
  
  app.post("/try-post", upload.none(), (req, res) => {
    res.json(req.body);
  });

  //上傳單張照片 
  app.post("/try-upload", upload.single('avatar'), (req, res) => {
    res.json({
      body: req.body,
      file: req.file,
    });
  });
  // 上傳多張照片，如果不上傳，postman都是空的，狀態是undefined
  app.post("/try-uploads", upload.array('photos'), (req, res) => {
    res.json( (req.files)
    );
  });

  app.get("/my-params1/:action/:id", (req, res) => {
    res.json( (req.params));
  });
  app.get("/products/:pid", (req, res) => {
    res.json( (req.params.pid));
  });
// regular expression
  app.get(/^\/m\/09\d{2}-?\d{3}-?\d{3}$/i, (req, res) => {
    let u=req.url.slice(3);
    u=u.split('?')[0];
    u=u.split('-').join('');
    res.json({u});
  });

  // 紀錄刷新網頁次數
app.get("/try-sess",(req,res)=>{
  req.session.myNum ||=0; //如果是falsy就設定為1
  req.session.myNum++;
  res.json(req.session);
});

app.get("/try-moment",(req,res)=>{
  const fm="YYY-MM-DD HH-mm-ss";
  const m1=moment(); //當下時間的moment
  const m2=moment(new Date());
  const m3=moment("2023-08-27");

  res.json({
    m1:m1.format(fm), //表示想要顯示的格式是YYY-MM-DD HH-mm-ss
    m1b:m1.tz("Europe/London").format(fm), //自行指定時區
    m2a:m2.format(fm), 
    m2b:m2.tz("Europe/London").format(fm),
    m3a:m3.format(fm), 
    m3b:m3.tz("Europe/London").format(fm)
  })
});

app.get("/try-moment2",(req,res)=>{
  const fm="YYY-MM-DD HH-mm-ss";
  const m1=moment("2024-02-29");
  const m2=moment("2024-05-35");
  const m3=moment("2023-02-29");

  res.json([
    m1.format(fm),
    m1.isValid(),
    m2.format(fm),
    m2.isValid(),
    m3.format(fm),
    m3.isValid()
  ]
  )
});

app.get("/try-db",async(req,res)=>{
const sql="SELECT * FROM address_book LIMIT 3";
const [results,fields] = await db.query(sql);
res.json({results,fields});
});

app.use("/admin2",admin2Router);

app.get("/yahoo", async (req, res) => {
  const r = await fetch('https://tw.yahoo.com/');
  const txt = await r.text();
  res.send(txt);
});

app.get("/login",async (req,res)=>{
  res.render("login");
})
app.post("/login",upload.none(),async(req,res)=>{
  const output={
    success:false,
    code:0,
    body:req.body,
  };

  const sql="SELECT * FROM members WHERE email=?";
  const [rows]=await db.query(sql,[req.body.email]);

  if(!rows.length){
    //帳號錯誤
    output.code=400;
    return res.json(output);
  }

  const result =await bcrypt.compare(req.body.password,rows[0].password);
  if(!result){
    //密碼錯誤
    output.code=420;
    return res.json(output);
  }
  output.success=true;

  req.session.admin = {
    id: rows[0].id,
    email: rows[0].email,
    nickname: rows[0].nickname,
  }
  res.json(output);
});

app.get("/logout", (req, res) => {
  delete req.session.admin;
  res.redirect("/");
});

app.post("/login-jwt", async (req, res) => {
  const output = {
    success: false,
    code: 0,
    body: req.body,
    data: {
      sid: 0,
      email: "",
      nickname: "",
      token: "",
    },
  };
  const sql = "SELECT * FROM members WHERE email=?";
  const [rows] = await db.query(sql, [req.body.email]);
  if (!rows.length) {
    // 帳號是錯的
    output.code = 400;
    return res.json(output);
  }
  const result = await bcrypt.compare(req.body.password, rows[0].password);
  if (!result) {
    // 密碼是錯的
    output.code = 420;
    return res.json(output);
  }
  output.success = true;
  // 沒有要記錄登入狀態, 打包 JWT
  const payload = {
    id: rows[0].id,
    email: rows[0].email,
  };
  const token = jwt.sign(payload, process.env.JWT_KEY);
  output.data = {
    id: rows[0].id,
    email: rows[0].email,
    nickname: rows[0].nickname,
    token,
  };
  res.json(output);
});

app.get("/jwt-data",(req,res)=>{
  res.json(req.my_jwt)
})

app.get("/jwt1",(req,res)=>{
const info={
  id:6,
  account:"Leana"
}

const token=jwt.sign(info,process.env.JWT_KEY);
res.send(token);
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiYWNjb3VudCI6IkxlYW5hIiwiaWF0IjoxNzE5MTkzNTYyfQ.glS7xe-0_AEoHq-Y2pZwybwa-NL-gONS75fQpnSOXCI
})

app.get("/jwt2",(req,res)=>{
const token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiYWNjb3VudCI6IkxlYW5hIiwiaWF0IjoxNzE5MTkzNTYyfQ.glS7xe-0_AEoHq-Y2pZwybwa-NL-gONS75fQpnSOXCI';
let payload={};
try{
  payload=jwt.verify(token,process.env.JWT_KEY);
}catch(ex){
  payload={ex};
};
res.send(payload);
  // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiYWNjb3VudCI6IkxlYW5hIiwiaWF0IjoxNzE5MTkzNTYyfQ.glS7xe-0_AEoHq-Y2pZwybwa-NL-gONS75fQpnSOXCI
  })
  

// 設定靜態內容資料夾，要放在404前面，前面的路由都沒有經過時才經過這裡
app.use(express.static("public"));
app.use("/bootstrap", express.static("node_modules/bootstrap/dist"));

// 設定404介面，一定要放在路由之後，放在路由前面會直接判定是404狀態，就不會再往後判斷
app.use((req,res)=>{
    res.type("text/plain");
    res.status(404);
    res.send("餔餔");
})

// 如果有設定就是3001，沒有就是3002
const port =process.env.WEB_PORT || 3002;
app.listen(port,()=>{
    console.log(`Server start:port ${port}`)
})
// console.log(process.env.DB_HOST);
// console.log(process.env.DB_USER);

import express from "express";
import multer from "multer";
import upload from "./utils/upload-img.js";
import admin2Router from './routes/admin2.js'; //匯入後相當於一個middleware
import session from "express-session";
// const upload =multer({dest:"tmp/uploads"}); 

const app =express();

// 設定ejs，要在路由的前面
app.set("view engine","ejs");

// 在進入路由之前先解析
// 只會解析 application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}));

// 只會解析 application/json
app.use(express.json());

app.use(session({
  saveUninitialized:false,
  resave:false,
  // 加密用的字串
  secret:"ancefrgyks",
  // cookie:{
  //   maxAge:180_000
  // }
}))

// 自訂頂層middleware，因為沒有設定路徑，所以任何東西都會經過這個
app.use((req,res,next)=>{
  res.locals.title="LEA web"
  next(); //代表送到下一個middleware
});

// 設定路由，只能用GET方法
app.get("/", (req, res) => {
    // res.send(`<h2>哈囉</h2>`);
    res.render("home", { name: "LEA" });
  });

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

app.use("/admin2",admin2Router);

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
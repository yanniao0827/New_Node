// console.log(process.env.DB_HOST);
// console.log(process.env.DB_USER);

import express from "express";

const app =express();

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

  const urlencodedParser=express.urlencoded({extended:true});
  app.post("/try-post-form", urlencodedParser,(req, res) => {
    res.json(req.body);
  });

// 設定ejs，要在路由的前面
app.set("view engine","ejs");

// 設定靜態內容資料夾，要放在404前面
app.use(express.static("public"));
app.use("/bootstrap", express.static("node_modules/bootstrap/dist"));

// 設定404介面，一定要放在路由之後，放在路由前面會直接判定是404狀態，就不會再往後判斷
app.use((req,res)=>{
    res.type("text/plain");
    res.status(404);
    res.send("餔餔");
})

// 如果有設定就是3002，沒有就是3001
const port =process.env.WEB_PORT || 3002;
app.listen(port,()=>{
    console.log(`Server start:port ${port}`)
})
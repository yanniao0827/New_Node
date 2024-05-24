// console.log(process.env.DB_HOST);
// console.log(process.env.DB_USER);

import express from "express";

const app =express();

// 設定路由，只能用GET方法
app.get('/',(req,res)=>{
    res.send(`<h2>晚安</h2>`)
});

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
// console.log(process.env.DB_HOST);
// console.log(process.env.DB_USER);

import express from "express";

const app =express();

// 設定路由，只能用GET方法
app.get('/',(req,res)=>{
    res.send(`<h2>晚安</h2>`)
});

// 如果有設定就是3002，沒有ˋ就是3001
const port =process.env.WEB_PORT || 3002;
app.listen(port,()=>{
    console.log(`Server start:port ${port}`)
})
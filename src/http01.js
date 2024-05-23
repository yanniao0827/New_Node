import http from "node:http"; //告知我們使用的是node的環境
    // req代表用什麼樣的路徑來拜訪的
const server=http.createServer((req,res)=>{
    //設定檔頭
    res.writeHead(200,{
        "Content-Type": "text/html; charset=utf-8",
    });
     //用字串來回應
     res.end(`<h2>哈囉你好</h2>
     <p>${req.url}</p>`
 );
})

server.listen(3000)

// 終端機執行後不會馬上有結果，要去瀏覽器手動輸入localhost:3000，3000是我們上面設定的數字
// 如果有更改程式碼內容，不會即時顯示，要ctl C終止server再重新執行
// 如果不想每次都要重製，可以安裝nodemon，可以去偵測程式碼的改變，只需要刷新頁面就可以顯示結果
// 或者也可以安裝pm2，但是pm2是背景執行，不太適合在開發時候用
import http from "node:http"; //告知我們使用的是node的環境
import fs from "node:fs/promises";
// req代表用什麼樣的路徑來拜訪的
const server=http.createServer(async(req,res)=>{
    const jsonSTR=JSON.stringify(req.headers,null,4);
    fs.writeFile("headers.txt",jsonSTR);
    try{
        await fs.writeFile("headers.txt",jsonSTR);
    }catch(ex){
        res.end("寫入失敗");
    }
    res.end(jsonSTR);
});

server.listen(3000)

// 終端機執行後不會馬上有結果，要去瀏覽器手動輸入localhost:3000，3000是我們上面設定的數字
// 如果有更改程式碼內容，不會即時顯示，要ctl C終止server再重新執行
// 如果不想每次都要重製，可以安裝nodemon，可以去偵測程式碼的改變，只需要刷新頁面就可以顯示結果
// 或者也可以安裝pm2，但是pm2是背景執行，不太適合在開發時候用
import express from "express";
import db from "./../utils/connect-mysql.js";
// 建立路由器，在router身上定義方法
const router =express.Router();

router.get("/",async(req,res)=>{
    let success=false;
    const perPage=25; //每頁最多25筆
    let page=parseInt(req.query.page)||1; //由query string取得page的值
    // 頁數<1就跳轉到第一頁 
    if(page<1){
        return res.redirect("?page=1");
    }

    const t_sql="SELECT COUNT(1) AS totalRows FROM address_book";
    const [[{totalRows}]] =await db.query(t_sql);
    let totalPages=0; //總頁數預設值為0
    let rows=[];
    // 取得分頁資料
    if(totalRows){
        totalPages=Math.ceil(totalRows / perPage);
        if(page>totalPages){
            return res.redirect(`?page=${totalPages}`);
        }
        const sql=`SELECT * FROM \`address_book\`LIMIT ${(page-1)*perPage},${perPage}`;
        
        [rows]=await db.query(sql);
        }
    // res.json({success,perPage,page,totalRows,rows});
    res.render("address-book/list",{success,perPage,page,totalRows,rows});
});


export default router;
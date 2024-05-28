import express from "express";
// 建立路由器，在router身上定義方法
const router =express.Router();

router.get("/",(req,res)=>{
    res.json(req.originalUrl);
});


export default router;
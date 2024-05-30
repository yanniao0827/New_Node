import express from "express";
import moment from "moment-timezone";
import db from "./../utils/connect-mysql.js";
import upload from "./../utils/upload-img.js";

const dateFormat = "YYYY-MM-DD";
const router = express.Router();

const getListData = async (req) => {
  let success = false;
  let redirect = "";

  const perPage = 25; // 每頁最多有幾筆資料
  let page = parseInt(req.query.page) || 1; // 從 query string 最得 page 的值
  if (page < 1) {
    redirect = "?page=1";
    return { success, redirect };
  }

// 設定keyword的值，沒有輸入就設定成空字串
  let keyword=req.query.keyword || '';
  let birth_begin=req.query.birth_begin || '';
  let birth_end=req.query.birth_end || '';

  let where =' WHERE 1 ';
// 如果有輸入keyword，在where後面加上模糊搜尋，就是我們輸入的關鍵字
  if(keyword){
    // where += ` AND \`name\` LIKE '%${keyword}%' `; //沒有處理sql injection
    const keyword2= db.escape(`%${keyword}%`); //把輸入的關鍵字轉成字串後再做跳脫
    console.log({ keyword2});
    where += ` AND \`name\` LIKE ${keyword2} ` //如果使用者不小心在名字之間輸入其罐的符號，搜尋結果就是空的，不會造成crash
  }
  if(birth_begin){
    // 用moment去處理
    const m= moment(birth_begin);
    // 如果日期符合格式，就把AND的條件加上去
    if(m.isValid()){
      where += ` AND birthday >= '${m.format(dateFormat)}' `;
    }
  }
  if(birth_end){
   // 用moment去處理
   const m= moment(birth_end);
   // 如果日期符合格式，就把AND的條件加上去
   if(m.isValid()){
     where += ` AND birthday <= '${m.format(dateFormat)}' `;
   }
  }

// 在select後面加上我們輸入的關鍵字，可以跑出我們想要的資料
  const t_sql = `SELECT COUNT(1) totalRows FROM address_book ${where}`;
  const [[{ totalRows }]] = await db.query(t_sql);
  let totalPages = 0; // 總頁數, 預設值
  let rows = []; // 分頁資料
  if (totalRows) {
    totalPages = Math.ceil(totalRows / perPage);
    if (page > totalPages) {
      redirect = `?page=${totalPages}`;
      return { success, redirect };
    }
    // 取得分頁資料
    const sql = `SELECT * FROM \`address_book\` ${where} LIMIT ${
      (page - 1) * perPage
    },${perPage}`;

    [rows] = await db.query(sql);
    rows.forEach((el) => {
      el.birthday = moment(el.birthday).format(dateFormat);
    });
  }
  success = true;
  return {
    success,
    perPage,
    page,
    totalRows,
    totalPages,
    rows,
    qs:req.query
  };
};

router.get("/", async (req, res) => {
  res.locals.title="通訊錄列表 | "+res.locals.title;
  res.locals.pageName="ab_list";
  const data = await getListData(req);
  if (data.redirect) {
    return res.redirect(data.redirect);
  }
  if (data.success) {
    res.render("address-book/list", data);
  }
});

router.get("/api", async (req, res) => {
  const data = await getListData(req);
  res.json(data);
});

router.get("/add", async (req, res) => {
  res.locals.title="新增通訊錄 | "+res.locals.title;
  res.locals.pageName="ab_add";
  res.render("address-book/add");
});

// 雖然沒有要上傳檔案，但是import upload-img的middleware來解析表單資料，不然表單送出的東西是multipart/form-data
// router.post("/add", [upload.none()], async (req, res) => {
//   res.json(req.body);
// });

router.post("/add", async (req, res) => {
  res.json(req.body);
});

export default router;

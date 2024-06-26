import multer from "multer";
import { v4 } from "uuid";

// 決定能上傳的檔案
const extMap = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

// 如果檔案不符，把錯誤訊息丟到null的欄位裡面
const fileFilter = (req, file, callback) => {
  callback(null, !!extMap[file.mimetype]);
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "public/img");
  },
  filename: (req, file, callback) => {
    const f = v4() + extMap[file.mimetype];
    callback(null, f);
  },
});

export default multer({ fileFilter, storage });
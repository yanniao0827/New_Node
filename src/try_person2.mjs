//mjs的匯入要加上副檔名 
//在mjs中要改名，直接使用as更改  
 import person2, { PI as MY_CONST } from './person2.mjs';
 const p1=new person2('Lea',22);

//直接輸出物件
console.log(p1);
//轉換成JSON字串
 console.log(p1+"");

 console.log(MY_CONST);

// 在中斷清空畫面，輸入cls
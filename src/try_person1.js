 //cjs的匯入，可以在任何地方做匯入，一律以.開頭，在cjs中可以省去.js 
 //在cjs中，改名字需要使用:
 const { person1, PI: MY_CONST } = require("./person1.cjs");
 const p1=new person1('Lea',22);

//直接輸出物件
console.log(p1);
//轉換成JSON字串
 console.log(p1+'');

 console.log(MY_CONST);

// 在終端清空畫面，輸入cls
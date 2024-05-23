// 附檔名是mjs的時候，就會知道是esm
export default  class person2{
    constructor(name,age){
        this.name=name;
        this.age=age;
    }

    toString(){
        return JSON.stringify(this);
    }
}

export const PI = 3.14;
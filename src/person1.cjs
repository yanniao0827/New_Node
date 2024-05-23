class person1{
    constructor(name,age){
        this.name=name;
        this.age=age;
    }

    toString(){
        return JSON.stringify(this);
    }
}

const PI = 3.14;

// cjs的匯出
module.exports = { person1, PI };
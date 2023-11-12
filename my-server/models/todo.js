///引入套件
const mongoose = require('mongoose');

///該資料表的格式設定
const todoSchema = new mongoose.Schema({
    thing:{ //事項名稱
        type:String, //設定該欄位的格式
        required:true //設定該欄位是否必填
    },
    isDone:{ //是否已完成
        type:Boolean,
        required:true,
        default:false //設定預設值
    },
    createdDate:{ //新增時的時間
        type: Date,
        default: Date.now,
        required:true
    },
})
//匯出該資料表
module.exports = mongoose.model("todo" , todoSchema);
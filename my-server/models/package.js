///引入套件
const mongoose = require('mongoose');

///該資料表的格式設定
const packageSchema = new mongoose.Schema({
    id:{ //package ID
        type:Number, //設定該欄位的格式
        required:true //設定該欄位是否必填
    },
    flight:{ //flight ticket number.
        type:String,
        required:true,
    },
    stay:{ //hotel room
        type: String,
        required:true
    },
    price:{ //price
        type: Number,
        required:true
    },
    quota:{ //quota
        type: Number,
        required:true
    },
    createdDate:{ //新增時的時間
        type: Date,
        default: Date.now,
        required:true
    },
})
//匯出該資料表
module.exports = mongoose.model("package" , packageSchema);
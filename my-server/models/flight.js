///引入套件
const mongoose = require('mongoose');

///該資料表的格式設定
const flightSchema = new mongoose.Schema({
    ticket:{ //flight ticket number.
        type:String,
        required:true,
    },
    email:{ //reserve email
        type: String,
        required:true
    },
    createdDate:{ //新增時的時間
        type: Date,
        default: Date.now,
        required:true
    },
})
//匯出該資料表
module.exports = mongoose.model("flight" , flightSchema);
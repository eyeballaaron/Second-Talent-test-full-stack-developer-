///引入套件
const mongoose = require('mongoose');

///該資料表的格式設定
const orderSchema = new mongoose.Schema({
    id:{ //order uuid.
        type:String,
        required:true,
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
module.exports = mongoose.model("order" , orderSchema);
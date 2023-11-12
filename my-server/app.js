///引入套件
const express = require('express');
const cors = require('cors');
const fs = require("fs");
const app = express();
const mongoose = require("mongoose");
const Package = require("./models/package");

///與資料庫連線
mongoose.connect("mongodb://localhost/user");
const db = mongoose.connection;

///與資料庫連線發生錯誤時
db.on('err',err => console.log(err));

///與資料庫連線成功連線時
db.once('open' , () => console.log('connected to database'));

fs.readFile( __dirname + "/data/package.json", 'utf8', function (err, data) {
    const obj = JSON.parse(data);
    console.log( obj );      
    obj.packages.forEach(async function(item, i) {
        let package;
        console.log(i, item, item.id);
        try {
            package = await Package.findOne({ id: item.id }).exec();
            if (package == undefined) {
                console.log("package undefined !!");
                const package = new Package({
                    id:item.id,
                    flight:item.flight,
                    stay:item.stay,
                    price:item.price,
                    quota:item.quota,
                });
                //使用.save()將資料存進資料庫
                const newpackage = await package.save();
                console.log("newpackage save successful !!", newpackage);
            }else{
                console.log("package already exist !!", package);
            }
        } catch (err) {
            //錯誤訊息發生回傳400 代表使用者傳入錯誤的資訊
            console.log("err:", err);
        }    
    });    
})

///重要!! 要加這行才可以讓req.json讀的到資料
app.use(cors());
app.use(express.json());

///引入Router 一個Router基本上處理一個資料表
const todoRouter = require("./routes/todo");
///此處的/todo代表連線到該Router的基本路徑為 http://localhost:3000/todo
app.use("/todo",todoRouter);

///引入Router 一個Router基本上處理一個資料表
const flightRouter = require("./routes/flight");
///此處的/flight代表連線到該Router的基本路徑為 http://localhost:3000/flight
app.use("/flight",flightRouter);

///引入Router 一個Router基本上處理一個資料表
const roomRouter = require("./routes/room");
///此處的/room代表連線到該Router的基本路徑為 http://localhost:3000/room
app.use("/room",roomRouter);

///引入Router 一個Router基本上處理一個資料表
const packageRouter = require("./routes/package");
///此處的/todo代表連線到該Router的基本路徑為 http://localhost:3000/package
app.use("/package",packageRouter);

///引入Router 一個Router基本上處理一個資料表
const orderRouter = require("./routes/order");
///此處的/order代表連線到該Router的基本路徑為 http://localhost:3000/order
app.use("/order",orderRouter);

///設定Server的Port
app.listen(8081 , () => console.log("server started"))
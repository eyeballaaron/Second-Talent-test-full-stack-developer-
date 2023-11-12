//引入套件
const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const Package = require("../models/package");
const Flight = require("../models/flight");
const Room = require("../models/room");
const uuid = require('uuid');

//取得全部資料
//使用非同步 才能夠等待資料庫回應
router.get("/", async (req, res) => {
    //使用try catch方便Debug的報錯訊息
    try {
        //找出order資料資料表中的全部資料
        const order = await Order.find();
        //將回傳的資訊轉成Json格式後回傳
        res.json(order);
    } catch (err) {
        //如果資料庫出現錯誤時回報 status:500 並回傳錯誤訊息 
        res.status(500).json({ message: err.message })
    }
})

//新增代辦事項
//將Method改為Post
router.post("/", async (req, res) => {
    //從req.body中取出資料
    const order = new Order({
        id:req.body.id,
        email:req.body.email,
    });
    let package, flight, room, reserveStaus = true;
    try {
        package = await Package.findOne({ id: req.body.id }).exec();
        if (package == undefined) {
            return res.status(404).json({ message:"Can't find package" })
        }
        if (package.quota > 0) {
            try {
                //將資訊存入資料庫
                package.quota -= 1;
                const updatepackage = await package.save();
                console.log("updatepackage !!", updatepackage);
            } catch (err) {
                console.log("updatepackage fail !!", updatepackage);
                //資料庫更新錯誤回傳400及錯誤訊息
                // res.status(400).json({ message:"Update package failed" }) //更新失敗
            }
            flight = await Flight.findOne({ email: req.body.email }).exec();
            if ((flight == undefined) || (!(flight.ticket === package.flight))) {
                reserveStaus = false;
                console.log("flight.ticket === package.flight", (flight.ticket === package.flight));
                console.log("reserve flight fail !!", flight);
                // res.status(404).json({ message:"reserve flight fail" })
            } else {
                room = await Room.findOne({ email: req.body.email }).exec();
                if ((room == undefined) || (room.stay != package.stay)) {
                    reserveStaus = false;
                    console.log("reserve room fail !!", room);
                    // res.status(404).json({ message:"reserve room fail" })
                }
            }    
            if (reserveStaus == false) {
                try {
                    //將資訊存入資料庫
                    package.quota += 1;
                    const updatepackage = await package.save();
                    console.log("updatepackage !!", updatepackage);
                } catch (err) {
                    //資料庫更新錯誤回傳400及錯誤訊息
                    // res.status(400).json({ message:"Update package failed" }) //更新失敗
                }                
            }
        } else {
            return res.status(404).json({ message:"package quota runs out" })
        }

        if (reserveStaus == true) {
            //使用.save()將資料存進資料庫
            order.id = uuid.v4();
            order.flight = package.flight;
            order.stay = package.stay;
            order.price = package.price;

            const neworder = await order.save();
            console.log("neworder !!", neworder);
            //回傳status:201代表新增成功 並回傳新增的資料
            res.status(201).json(neworder);
        } else {
            return res.status(404).json({ message:"order package fail" })
        }

    } catch (err) {
        //錯誤訊息發生回傳400 代表使用者傳入錯誤的資訊
        res.status(400).json({ message : err.message })
    }
})

//檢視特定事項
//在網址中傳入id用以查詢
////會先執行getOrder後才繼續裡面的內容
router.get("/:id/:email", getOrder , (req, res) => {
    //取出res.order並回傳
    res.send(res.order);
})

//檢視是否有該代辦事項
async function getOrder(req,res,next) {
    let order;
    try {
        order = await Order.findOne({ id:req.params.id, email: req.params.email }).exec();

        if (order == undefined) {
            return res.status(404).json({ message:"Can't find order" });
        }
    } catch (err) {
        return res.status(500).json({ message:err.message })
    }
    //如果有該事項 則將他加入到res中
    res.order = order
    //在router中執行middleware後需要使用next()才會繼續往下跑
    next();
}

//刪除代辦事項
//先使用getOrder取得該代辦資訊
router.delete("/:id/:email", getOrder, async (req, res) => {
    try {
        //將取出的待辦事項刪除
        await res.order.deleteOne();
        //回傳訊息
        res.json({ message:"Delete order succeed" })
    } catch (err) {
        //資料庫操作錯誤將回傳500及錯誤訊息
        res.status(500).json({ message:"remove order faild" })
    }
})

//Export 該Router
module.exports = router
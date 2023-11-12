//引入套件
const express = require("express");
const router = express.Router();
const Room = require("../models/room");
const Package = require("../models/package");

//取得全部資料
//使用非同步 才能夠等待資料庫回應
router.get("/", async (req, res) => {
    //使用try catch方便Debug的報錯訊息
    try {
        //找出flight資料資料表中的全部資料
        const room = await Room.find();
        //將回傳的資訊轉成Json格式後回傳
        res.json(room);
    } catch (err) {
        //如果資料庫出現錯誤時回報 status:500 並回傳錯誤訊息 
        res.status(500).json({ message: err.message })
    }
})

//新增代辦事項
//將Method改為Post
router.post("/", async (req, res) => {
    //從req.body中取出資料
    const room = new Room({
        stay:req.body.stay,
        email:req.body.email,
    });
    try {
        package = await Package.findOne({ flight: req.body.ticket }).exec();
        if (package == undefined) {
            return res.status(404).json({ message:"Invalid flight ticket number" })
        }

        //使用.save()將資料存進資料庫
        const newroom = await room.save();
        //回傳status:201代表新增成功 並回傳新增的資料
        res.status(201).json(newroom);
    } catch (err) {
        //錯誤訊息發生回傳400 代表使用者傳入錯誤的資訊
        res.status(400).json({ message : err.message })
    }
})

//檢視特定事項
//在網址中傳入id用以查詢
////會先執行getRoom後才繼續裡面的內容
router.get("/:id", getRoom , (req, res) => {
    //取出res.flight並回傳
    res.send(res.room);
})

//檢視是否有該代辦事項
async function getRoom(req,res,next) {
    let room;
    try {
        room = await Room.findOne({ stay: req.params.id }).exec();
        if (room == undefined) {
            return res.status(404).json({ message:"Can't find room" })
        }
    } catch (err) {
        return res.status(500).json({ message:err.message })
    }
    //如果有該事項 則將他加入到res中
    res.room = room
    //在router中執行middleware後需要使用next()才會繼續往下跑
    next();
}

//刪除代辦事項
//先使用getRoom取得該代辦資訊
router.delete("/:id", getRoom, async (req, res) => {
    try {
        //將取出的待辦事項刪除
        await res.room.deleteOne();
        //回傳訊息
        res.json({ message:"Delete room succeed" })
    } catch (err) {
        //資料庫操作錯誤將回傳500及錯誤訊息
        res.status(500).json({ message:"remove room faild" })
    }
})

//Export 該Router
module.exports = router
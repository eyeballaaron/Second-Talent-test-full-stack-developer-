//引入套件
const express = require("express");
const router = express.Router();
const Package = require("../models/package");

//取得全部資料
//使用非同步 才能夠等待資料庫回應
router.get("/", async (req, res) => {
    //使用try catch方便Debug的報錯訊息
    try {
        //找出Package資料資料表中的全部資料
        const package = await Package.find();
        //將回傳的資訊轉成Json格式後回傳
        res.json(package);
    } catch (err) {
        //如果資料庫出現錯誤時回報 status:500 並回傳錯誤訊息 
        res.status(500).json({ message: err.message })
    }
})

//新增代辦事項
//將Method改為Post
router.post("/", async (req, res) => {
    //從req.body中取出資料
    const package = new Package({
        id:req.body.id,
        flight:req.body.flight,
        stay:req.body.stay,
        price:req.body.price,
        quota:req.body.quota,
    });
    try {
        //使用.save()將資料存進資料庫
        const newpackage = await package.save();
        //回傳status:201代表新增成功 並回傳新增的資料
        res.status(201).json(newpackage);
    } catch (err) {
        //錯誤訊息發生回傳400 代表使用者傳入錯誤的資訊
        res.status(400).json({ message : err.message })
    }
})

//檢視特定事項
//在網址中傳入id用以查詢
////會先執行getPackage後才繼續裡面的內容
router.get("/:id", getPackage , (req, res) => {
    //取出res.package並回傳
    res.send(res.package);
})

//檢視是否有該代辦事項
async function getPackage(req,res,next) {
    let package;
    try {
        package = await Package.findById(req.params.id);
        if (package == undefined) {
            return res.status(404).json({ message:"Can't find package" })
        }
    } catch (err) {
        return res.status(500).json({ message:err.message })
    }
    //如果有該事項 則將他加入到res中
    res.package = package
    //在router中執行middleware後需要使用next()才會繼續往下跑
    next();
}

//刪除代辦事項
//先使用getPackage取得該代辦資訊
router.delete("/:id", getPackage, async (req, res) => {
    try {
        //將取出的待辦事項刪除
        await res.package.deleteOne();
        //回傳訊息
        res.json({ message:"Delete package succeed" })
    } catch (err) {
        //資料庫操作錯誤將回傳500及錯誤訊息
        res.status(500).json({ message:"remove package faild" })
    }
})

//更新待辦事項
//先使用getPackage取得資訊
router.patch("/:id", getPackage , async (req, res) => {
    if (req.body.quota != null) {
        res.package.quota = req.body.quota
    }
    try {
        //將資訊存入資料庫
        const updatePackage = await res.package.save();
        //回傳更改後的資料給使用者
        res.json(updatePackage);
    } catch (err) {
        //資料庫更新錯誤回傳400及錯誤訊息
        res.status(400).json({ message:"Update User failed" }) //更新失敗
    }
})

//Export 該Router
module.exports = router
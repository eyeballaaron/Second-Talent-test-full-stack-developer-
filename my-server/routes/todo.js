//引入套件
const express = require("express");
const router = express.Router();
const Todo = require("../models/todo");

//取得全部資料
//使用非同步 才能夠等待資料庫回應
router.get("/", async (req, res) => {
    //使用try catch方便Debug的報錯訊息
    try {
        //找出Todo資料資料表中的全部資料
        const todo = await Todo.find();
        //將回傳的資訊轉成Json格式後回傳
        res.json(todo);
    } catch (err) {
        //如果資料庫出現錯誤時回報 status:500 並回傳錯誤訊息 
        res.status(500).json({ message: err.message })
    }
})

//新增代辦事項
//將Method改為Post
router.post("/", async (req, res) => {
    //從req.body中取出資料
    const todo = new Todo({
        thing:req.body.thing,
        isDone:req.body.isDone,
    });
    try {
        //使用.save()將資料存進資料庫
        const newtodo = await todo.save();
        //回傳status:201代表新增成功 並回傳新增的資料
        res.status(201).json(newtodo);
    } catch (err) {
        //錯誤訊息發生回傳400 代表使用者傳入錯誤的資訊
        res.status(400).json({ message : err.message })
    }
})

//檢視特定事項
//在網址中傳入id用以查詢
////會先執行getTodo後才繼續裡面的內容
router.get("/:id", getTodo , (req, res) => {
    //取出res.todo並回傳
    res.send(res.todo);
})

//檢視是否有該代辦事項
async function getTodo(req,res,next) {
    let todo;
    try {
        todo = await Todo.findById(req.params.id);
        if (todo == undefined) {
            return res.status(404).json({ message:"Can't find todo" })
        }
    } catch (err) {
        return res.status(500).json({ message:err.message })
    }
    //如果有該事項 則將他加入到res中
    res.todo = todo
    //在router中執行middleware後需要使用next()才會繼續往下跑
    next();
}

//刪除代辦事項
//先使用getTodo取得該代辦資訊
router.delete("/:id", getTodo, async (req, res) => {
    try {
        //將取出的待辦事項刪除
        await res.todo.deleteOne();
        //回傳訊息
        res.json({ message:"Delete todo succeed" })
    } catch (err) {
        //資料庫操作錯誤將回傳500及錯誤訊息
        res.status(500).json({ message:"remove todo faild" })
    }
})

//更新待辦事項
//先使用getTodo取得資訊
router.patch("/:id", getTodo , async (req, res) => {
    //檢測使用者是否有傳入事項 有的話則將getTodo回傳的thing改成使用者傳入的thing
    if (req.body.thing != null) {
        res.todo.thing = req.body.thing
    }
    //檢測使用者是否有傳入以完成資訊 有的話則將getTodo回傳的isDone改成使用者傳入的isDone
    if (req.body.isDone != null) {
        res.todo.isDone = req.body.isDone
    }
    try {
        //將資訊存入資料庫
        const updateTodo = await res.todo.save();
        //回傳更改後的資料給使用者
        res.json(updateTodo);
    } catch (err) {
        //資料庫更新錯誤回傳400及錯誤訊息
        res.status(400).json({ message:"Update User failed" }) //更新失敗
    }
})

//Export 該Router
module.exports = router
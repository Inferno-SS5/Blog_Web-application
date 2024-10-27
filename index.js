import express from "express";
import bodyParser from "body-parser";
import { v4 as uuidv4 } from 'uuid';

const app=express();
const port =3000;
let postList=[];

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:true}));

app.get("/",(req,res)=>{
    postList=[];
    res.render("index.ejs",{posts:postList});
});

app.post("/submit",(req,res)=>{
    console.log(req.body);
    const newPost={
        id: uuidv4(),                        //this  import function gives a unique id to each blog messege
        firstName: req.body["fName"],
        lastName: req.body["lName"],
        userName: req.body["username"],
        msg: req.body["message"],
        timestamp: new Date().toLocaleString() 
    };
    postList.unshift(newPost);   //push at the beginning of arary
    res.render("index.ejs",{posts:postList});
    console.log(postList);
});

app.post("/delete",(req,res)=>{
    const postId=req.body.id;
    postList=postList.filter(post=>post.id!==postId);          //removes the id delet button
    res.render("index.ejs",{posts:postList});
});

app.get("/edit", (req, res) => {
    const postId = req.query.id;
    const postToEdit = postList.find(post => post.id === postId);
    res.render("partials/post-edit.ejs", {post: postToEdit});
});

app.post("/update", (req, res) => {
    const postId = req.body.id;
    const updatedPost = {
        id: postId,
        firstName: req.body["fName"],
        lastName: req.body["lName"],
        userName: req.body["username"],
        msg: req.body["message"],
        timestamp: postList.find(post => post.id === postId).timestamp
    };

    postList = postList.map(post => post.id === postId ? updatedPost : post);
    res.render("index.ejs", {posts: postList});
});

app.listen(process.env.PORT || port,()=>{
    console.log(`Listening to ${port}`);
});

//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//Setup mongoose DB
mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser:true});
const articleSchema = {
    title:String,
    content:String
};

const Article = mongoose.model("Article", articleSchema);



//TODO

app.route("/articles")
.get(async(req,res)=>{
    try{
        let articles = await Article.find()
        articles.forEach(article=>{
            console.log(article);
        });
        res.send(articles)
    }
    catch(error){
        res.send(error)
    }
    
})
.post(async (req,res)=>{

    const newArticle = new Article({
        title:req.body.title,
        content:req.body.content
    }); 

    try{
        await newArticle.save();
        res.send("Sent.");
    }catch(err){
        res.send(err);
    }
})
.delete(async (req,res)=>{

    try{
        await Article.deleteMany()
        res.send("Deleted.");
    }catch(err){
        res.send(err);
    }
});

///////////////////////////////////////////////////////////// Specific Article

app.route("/articles/:articleTitle")
.get(async (req,res)=>{
    const nameToFind = req.params.articleTitle
    try{
        const foundArticle = await Article.findOne({title: nameToFind});
        if(foundArticle){
            res.send(foundArticle);
        }
        else{
            res.send("No matching any article.");
        }
    }
    catch(err){
        res.send(err);
    }
    
})

.put(async (req,res)=>{
    const nameToFind = req.params.articleTitle
    try{
        await Article.updateOne(
            {title: nameToFind},
            {title:req.body.title,
            content:req.body.content}
        );
        res.send("Successfuly updated article.");
    }
    catch(err){
        res.send(err);
    }
})

.patch(async (req,res)=>{
    const nameToFind = req.params.articleTitle
    try{
        await Article.updateOne(
            {title: nameToFind},
            {$set: req.body}
        );
        res.send("Successfuly patched article.");
    }
    catch(err){
        res.send(err);
    }
})

.delete(async (req,res)=>{
    const nameToFind = req.params.articleTitle
    try{
        await Article.deleteOne(
            {title: nameToFind}
        );
        res.send("Successfuly deleted article.");
    }
    catch(err){
        res.send(err);
    }
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
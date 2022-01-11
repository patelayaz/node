const express = require('express');
const app = express(); 
const path = require(`path`);
const mongoose = require(`mongoose`);
const methodOverride = require("method-override");
const morgan = require(`morgan`);
const ejsMate = require(`ejs-mate`);
const Joi = require(`joi`);

app.get('/',(req,res)=> {
    res.send("welcome to home page1");

}); 
const  port = process.env.port || 3000;
app.listen(port,()=> {
    console.log("guc");
}); 



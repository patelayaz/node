const express = require('express');
const app = express(); 

// custom middleware
const catchAsync = require(`./utils/catchAsync`);
const ExpressError = require(`./utils/ExpressError`);
// schema validation with JOI
const { propertySchemaJOI, agentSchemaJOI } = require(`./schemas`);

app.get('/',(req,res)=> {
    res.send("welcome to home page1");

}); 
const  port = process.env.port || 3000;
app.listen(port,()=> {
    console.log("guc");
}); 



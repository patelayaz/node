const express = require("express");


// custom middleware
const catchAsync = require(`./utils/catchAsync`);
const ExpressError = require(`./utils/ExpressError`);









// initialize app to express()
const app = express();

// route management
app.get(`/`, (req, res) => {
  res.render(`home`);
});


const  port = process.env.port || 3000;
app.listen(port,()=> {
    console.log("guc");
}); 

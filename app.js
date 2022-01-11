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

// property routes
app.get(
  `/properties`,
  catchAsync(async (req, res) => {
    const properties = await Property.find({});
    const agents = await Agent.find({});
    res.render(`properties/index`, { properties, agents });
  })
);


const  port = process.env.port || 3000;
app.listen(port,()=> {
    console.log("guc");
}); 

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

app.get(`/properties/add/`, (req, res) => {
  // res.send(`GET: /properties/add`);
  res.render(`properties/newPropertyForm`);
});
app.post(
  `/properties/add/`,
  validatePropertyJOI,
  catchAsync(async (req, res, err) => {
    // processing the form submitted data to generate a property object
    const { generatePropertyFromForm } = require("./seeds/helpers");
    const newProperty = new Property({ ...generatePropertyFromForm(req.body) });
    await newProperty.save();
    res.redirect(`/properties/${newProperty._id}/`);
  })
);


const  port = process.env.port || 3000;
app.listen(port,()=> {
    console.log("guc");
}); 

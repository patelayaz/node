const express = require("express");
const mongoose = require(`mongoose`);
const path = require('path')

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


app.get(
  `/properties/generate`,
  catchAsync(async (req, res) => {
    console.log(`In GET: /properties/generate`);
    const { addPropertyGenerator } = require("./seeds/helpers");
    const value = addPropertyGenerator();
    const newProperty = new Property({ ...value });

    await newProperty.save();
    res.redirect(`/properties`);
  })
);
app.get(
  `/properties/:id`,
  catchAsync(async (req, res) => {
    const property = await Property.findById(req.params.id);

    const agent = await Agent.findOne({ agentCode: property.agentCode });

    res.render(`properties/showProperty`, { property, agent });
  })
);
app.delete(
  `/properties/:id`,
  catchAsync(async (req, res) => {
    console.log(`DELETE REQUEST`);
    const { id } = req.params;
    await Property.findByIdAndDelete(id);
    res.redirect(`/properties/`);
  })
);

app.get(
  `/properties/:id/edit/`,
  catchAsync(async (req, res) => {
    const { id } = req.params;

    // getting the property data from the DB
    const property = await Property.findById(id);

    // res.send(`GET: /properties/${id}/edit/`);
    res.render(`properties/editPropertyForm`, { property });
  })
);

// agent routes
app.get(
  `/agents`,
  catchAsync(async (req, res) => {
    const agents = await Agent.find({});
    res.render(`agents/index`, { agents });
  })
);

app.get(
  `/agents/:id`,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const agent = await Agent.findById(id);
    const properties = await Property.find({ agentCode: agent.agentCode });
    res.render(`agents/showAgent`, { agent, properties });
  })
);

// 404 route
app.all(`*`, (req, res, next) => {
  // console.log(`🚀 ✩ In app.all: 404 route `);
  // res.status(404).send("Resource not found");
  next(new ExpressError(`Page not found`, 404));
});

// error handling
app.use((err, req, res, next) => {
  // console.log(`🚀 ✩ In app.use: Error handling `);
  const { statusCode = 500 } = err;
  if (!err.message) err.message = `Something went wrong`;
  console.log(err);
  res.status(statusCode).render(`error`, { err });
  // res.send("Unhandled error occurred!");
});

const  port = process.env.port || 3000;
app.listen(port,()=> {
    console.log("guc");
}); 

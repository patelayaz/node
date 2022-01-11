const express = require("express");
const path = require(`path`);
const mongoose = require(`mongoose`);
const methodOverride = require("method-override");
const morgan = require(`morgan`);
const ejsMate = require(`ejs-mate`);
const Joi = require(`joi`);

// custom middleware
const catchAsync = require(`./utils/catchAsync`);
const ExpressError = require(`./utils/ExpressError`);

// schema validation with JOI
const { propertySchemaJOI, agentSchemaJOI } = require(`./schemas`);

// mongo schemas
const Property = require(`./models/property`);
const Agent = require(`./models/agent`);

// connecting to the localhost mongodb server
mongoose.connect(`mongodb://localhost:27017/propertyApp`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// setting up mongoose to connect to mongodb
const db = mongoose.connection;
db.on(`error`, console.error.bind(console.log(`MongoDB connection error`)));
db.once(`open`, () => {
  console.log(`MongoDB connected`);
});

// initialize app to express()
const app = express();

// using eja-mate engine
app.engine(`ejs`, ejsMate);
// setting ejs template engine and views base folder
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, `views`));

// make /public accessible
const publicDirectoryPath = path.join(__dirname, "./assets");
app.use(express.static(publicDirectoryPath));

// handling JSON and URL encoded form submissions
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// override with POST having ?_method=DELETE/PATCH
app.use(methodOverride("_method"));
// using morgan to log request data
app.use(morgan(`dev`));

// using Joi to validate schema
const validatePropertyJOI = (req, res, next) => {
  const result = propertySchemaJOI.validate(req.body);
  // console.log(`🚀 ✩ catchAsync ✩ result`, result);
  const { error } = result;
  if (error) {
    const msg = error.details.map((el) => el.message).join(`,`);
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

const validateAgentJOI = (req, res, next) => {
  // console.log(`In validateAgentJOI`);
  const result = agentSchemaJOI.validate(req.body);
  // console.log(`🚀 ✩ catchAsync ✩ result`, result);
  const { error } = result;
  if (error) {
    const msg = error.details.map((el) => el.message).join(`,`);
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

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
app.put(
  `/properties/:id`,
  validatePropertyJOI,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const updatedProperty = await Property.findByIdAndUpdate(
      { _id: id },
      { ...req.body }
    );
    res.redirect(`/properties/${id}/`);
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
app.post(`/agents/add`, validateAgentJOI, async (req, res) => {
  console.log(`In POST: /agents/add/`);
  // TODO: create add agent form and then fetch that data from there. Using a dummy object here to test functionality
  const agentObject = {
    agentCode: `testAgent`,
    name: `test`,
    logo: `test`,
    address: `test`,
    phone: `test`,
  };
  const newAgent = new Agent({ ...agentObject });
  await newAgent.save();
  res.redirect(`/agents/${newAgent._id}/`);
});

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

// starting the server
app.listen(3000, () => {
  console.log(`Serving on port 3000`);
});

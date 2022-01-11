const express = require('express');
const app = express(); 

// connecting to the localhost mongodb server
mongoose.connect(`mongodb://localhost:27017/propertyApp`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// custom middleware
const catchAsync = require(`./utils/catchAsync`);
const ExpressError = require(`./utils/ExpressError`);


app.get('/',(req,res)=> {
    res.send("welcome to home page1");

}); 
const  port = process.env.port || 3000;
app.listen(port,()=> {
    console.log("guc");
}); 



const express = require('express');
const app = express();  

app.get('/',(req,res)=> {
    res.send("welcome to home page1");

}); 
const  port = process.env.port || 3000;
app.listen(port,()=> {
    console.log("guc");
}); 



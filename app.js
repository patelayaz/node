const express = require('express');
const app = express();  

app.get('/',(req,res)=> {
    res.send("welcome to home page1");

}); 
app.listen(3000,()=> {
    console.log("guc");
}); 




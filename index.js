const express = require('express');
const app = express();
const https = require('https');

app.set('view engine','ejs');
app.use(express.json());

//route
app.get('/',async (req,res)=>{
    res.render('index');
    >>

});

//port
app.listen(5000,()=>{
    console.log('Listening to port 5000')
});
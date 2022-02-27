const express = require('express');
const app = express();

app.set('view engine','ejs');
app.use(express.json());

//route
app.get('/',(req,res)=>{
    res.render('index');
});

//port
app.listen(5000,()=>{
    console.log('Listening to port 5000')
});
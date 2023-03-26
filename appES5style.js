//creating simple rest api emd points with index and get movie route

const express = require('express');
const axios = require('axios');
const path = require('path');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express();

const port = 6001;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/public',express.static(path.join(__dirname,'public')))
app.set('view engine','ejs');

app.get("/", (req, res) => {
    res.send('welcome to node js day 8 session')
});

// how to retrieve the data from json server based db.json
app.get('/getMovies',(req,res)=>{
    const url = 'http://localhost:3000/movies';
    // axios is returning us a promise
    axios.get(url).then((response)=>{
       const result = response.data;
       const finalResult  = []
       for (let index = 0; index < result.length; index++) {
            const currentDate = new Date();
            const movieDate = new Date(result[index].date);
              //calculate time difference  
            const timeDiff  = currentDate.getTime()- movieDate.getTime();
            const dayDiff = timeDiff/(1000*60*60*24)
            if(dayDiff>3){
                result[index].status = 'expired'
            }else if( dayDiff >=1){
                result[index].status = 'running'
            }else{
                result[index].status = 'just released'
            }
            finalResult.push(result[index])
       }
       res.render('movie-homepage.ejs',{movies:finalResult});
    }).catch((error) => {
        console.log(error);
    })
})

// example of conversion from promise to async await
app.get('/getMovies2', async (req,res)=>{
    const url = 'http://localhost:3000/movies';
    // axios is returning us a promise
    const response = await axios.get(url)
   
       const result = response.data;
       const finalResult  = []
       for (let index = 0; index < result.length; index++) {
            const currentDate = new Date();
            const movieDate = new Date(result[index].date);
              //calculate time difference  
            const timeDiff  = currentDate.getTime()- movieDate.getTime();
            const dayDiff = timeDiff/(1000*60*60*24)
            if(dayDiff>3){
                result[index].status = 'expired'
            }else if( dayDiff >=1){
                result[index].status = 'running'
            }else{
                result[index].status = 'just released'
            }
            finalResult.push(result[index])
       }
       res.render('movie-homepage.ejs',{movies:finalResult});
  
       
})


// how to post the data to json server based db.json
app.post('/postMovies', (req, res) => {
    const date = new Date()
    const url = 'http://localhost:3000/movies';
    req.body.date= date;
    axios.post(url,req.body,{
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(() => {
        res.redirect('/getMovies')
    }).catch((error) => {
        console.log(error);
    })
})



app.post('/sendMail',(req,res)=>{
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'zoie.barton@ethereal.email',
            pass: 'fJZUMWzJRwhMBRbxee'
        }
    });

    const mailOptions ={
        from:'admin@moviebuzz.com',
        to:'zoie.barton@ethereal.email',
        subject:"movie details",
        text:`Movie Name: ${req.body.name} language: ${req.body.language}`
    }
   

    transporter.sendMail(mailOptions,(err,info)=>{
        if(err){
            console.log(err)
        }else{
            console.log("email sent successfully")
            res.send("email sent successfully")
        }
    })
})

app.listen(port, () => {
    console.log(`server started with port number ${port}`);
})
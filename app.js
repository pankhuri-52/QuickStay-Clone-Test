var express = require('express')
var path = require('path')
var app = express()
var session = require('express-session')
var multer = require('multer');
var alert = require('alert-node')
var fs = require('fs');

app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname,'public/uploads')));

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(session({
  secret: "WubbaLubbaDubDub",
  resave: false,
  saveUnintialized: true,
}))

app.use(function (req, res, next) {
  next();
})

var mongoose = require('mongoose');
var userdb = 'mongodb://localhost/quickStay';

mongoose.connect(userdb);

mongoose.connection.on('error',(err) => {
  console.log('DB connection Error');
})

mongoose.connection.on('connected',(err) => {
   useNewUrlParser: true;
  console.log('DB connected');
})

var userSchema = new mongoose.Schema({
    name: String,
    number: String,
    email: String,
    password: String,
})

var user = mongoose.model('users', userSchema);

app.get('/signup',logger,function(req,res)
{
    res.render('signup',{obj : req.session.data , exists:exists});
    exists=0;
})

app.post('/signup',function(req,res)
{
   exists = 0;
    var obj = req.body;
    user.find({
      email: req.body.email,
    })
    .then(data =>
    {
        if(data.length != 0){
          exists = 1;
          res.redirect('/signup')
        }
        else{
            user.create(obj,function(error,result){
                if(error)
                    throw err;
            })
            alert("Congratulations You signed Up successfully");
            res.sendFile(path.join(__dirname + '/public/index.html'));  
        }
    });
});

app.post('/login',function(req,res){
    user.find({
        email: req.body.email,
        password: req.body.password
      })
      .then(data =>
        {
          if(data.length > 0){
            req.session.name = data[0].name
            res.send("1");
          }
          else{
            res.send("-1");
          }
        })
      .catch(err => {
        res.send(err)
      })
});

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var dir = 'uploads/' + req.session.name;
    fs.exists(dir, function(exists){
      if(exists){
        cb(null,dir);
      }
      else{
        fs.mkdir(dir, function(err) {
          if(err) {
            console.log('Error in folder creation');
            cb(null,dir); 
          }  
          cb(null,dir);
        })
      }
   })
  },
  filename: function (req, file, cb) {
    cb(null, req.body.projectName)
  }
})
 
var upload = multer({ storage: storage })

app.post('/uploadProject', upload.single('myFile'), (req, res) => {
  var file = req.file
  if (!file) {
    alert("Atleast Choose A File")
  }
  else{
    alert("File Uploaded Succesfully");
    res.sendFile(path.join(__dirname + '/public/ProjectPage.html'));
  }
})

app.listen(3000,function()					//Server Running Confirmation
{
      console.log("Running on port 3000");
});

//MIDDLEWARE FUNCTIONS
function logger(req,res,next)				//login vaala 
{
  if(req.session.isLogin)
  {
    next();
  }
  else {
      res.redirect('/');
  }
}
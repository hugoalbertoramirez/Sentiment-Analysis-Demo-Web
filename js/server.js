const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
var router = express.Router();  
var fs = require("fs");

var port = process.env.PORT || 8088;     

router.use(function(req, res, next) {
    console.log('Recibo comando');
    next();  
});

app.get('/', function (req, res) {
  res.send('Hello World')
})
 
app.use(fileUpload());
 
var url_client = "http://127.0.0.1:8887";

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST");
  res.header("Access-Control-Allow-Headers", "X-Custom-Header");
  next();
});

app.post('/uploadImage', function(req, res) {
  
  if (req.body.img)
  {
    console.log("good >> " + req.body.img.substring(0, 200));
  }
  else
  {
    console.log("bad >> " + req.body);
  }

  var base64Data = req.body.img.replace(/^data:image\/png;base64,/,""),
  binaryData = new Buffer(base64Data, 'base64').toString('binary');

  fs.writeFile("./out.jpg", binaryData, "binary", function(err) {
      var bitmap = fs.readFileSync("./out.jpg");
      binaryData = new Buffer(bitmap.toString('binary'),'binary');
    
      var api_key ="92fc40808cd442a6a51facd950e65b99";
      var oxfordEmotion = require("node-oxford-emotion")(api_key)
      console.log(binaryData);
      var emotion = oxfordEmotion.recognize("image", binaryData, function(cb) {
        console.log(">>" + cb);
        res.send(cb);
        res.end();
      });
  });
});

app.listen(port);
console.log('Server online en puerto: ' + port);   


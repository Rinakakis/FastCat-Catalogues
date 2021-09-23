var express = require('express');
var app = express();
var fs = require("fs");
var cors = require('cors');

var array = [];
var path = './Template_examples/Crew_List_(Ruoli_di_Equipaggio)-20210912T181226Z-001';
i = 0;
app.use(cors());

app.get('/crew', function (req, res) {
    array = [];
    fs.readdirSync(path)
    .map(name => {
        var file = fs.readFileSync(path+'/'+name, 'utf8');
        var student = JSON.parse(file.trim());
        // if(i++ == 0 ) console.log(student);  
        // file = JSON.parse(file);
        array.push(student);
    });
    res.end(JSON.stringify(array));
})

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})

// function init() {
//     fs.readdirSync(path)
//     .map(name => {
//         var file = fs.readFileSync(path+'/'+name, 'utf8');
//         array.push(file);
//     });

//   }

//   init();
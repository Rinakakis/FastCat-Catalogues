var express = require('express');
var app = express();
var fs = require("fs");
var cors = require('cors');

app.use(cors());

var path = './Template_examples/';

app.get('/record/:name', function (req, res) {
    var record =req.params.name;
    record = record.replaceAll(' ', '_');
    var array = [];
    var fullpath = path + record;
    fs.readdirSync(fullpath)
    .map(name => {
        var file = fs.readFileSync(fullpath+'/'+name, 'utf8');
        var record = JSON.parse(file.trim());
        array.push(record);
    });
    res.end(JSON.stringify(array));
})

app.get('/numberOfrecords', function(req, res){
    array = [];
    array = fs.readdirSync(path)
    .map(name => {
        var dir = path + name;
        var len = fs.readdirSync(dir);
        var record = templates.find(obj => obj.name == name.replaceAll('_', ' '));
        record.count = len.length;
        return record;
    });
    res.end(JSON.stringify(array));
})

var server = app.listen(8081, function () {
   var host = server.address().address;
   var port = server.address().port;
   console.log("Example app listening at http://%s:%s", host, port)
})

const templates = [
    {
       "id":"Accounts book",
       "name":"Accounts book",
       "description":"A description of the template",
       "configuration-filename":"accountsBook.json"
    },
    {
       "id":"Census_LaCiotat",
       "name":"Census La Ciotat",
       "description":"A description of the template",
       "configuration-filename":"censusLaCiotat.json"
    },
    {
       "id":"Crew List",
       "name":"Crew and displacement list (Roll)",
       "description":"A description of the template",
       "configuration-filename":"crewListRoll.json"
    },
    {
       "id":"Crew List_IT",
       "name":"Crew List (Ruoli di Equipaggio)",
       "description":"A description of the template",
       "configuration-filename":"crewListRoll.json"
    }
 ]
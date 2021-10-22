var _ = require('lodash');
var express = require('express');
var app = express();
var fs = require("fs");
var cors = require('cors');
const { format } = require('path/posix');

app.use(cors());

var path = './Template_examples/';

const templates = [
   {
      "id":"Accounts book",
      "name":"Accounts book",
      "description":"A description of the template",
      "configuration":"accountsBook.json"
   },
   {
      "id":"Census_LaCiotat",
      "name":"Census La Ciotat",
      "description":"A description of the template",
      "configuration":"censusLaCiotat.json"
   },
   {
      "id":"Crew List",
      "name":"Crew and displacement list (Roll)",
      "description":"A description of the template",
      "configuration":"mydataRoll.json"
   },
   {
      "id":"Crew List_IT",
      "name":"Crew List (Ruoli di Equipaggio)",
      "description":"A description of the template",
      "configuration":"crewListRuoli_conf.json"
   }
];

var server = app.listen(8081, function () {
   var host = server.address().address;
   var port = server.address().port;
   console.log("Example app listening at http://%s:%s", host, port)
});

app.get('/record/:name', function (req, res) {
   var record =req.params.name;
   record = record.replaceAll(' ', '_');
   var myarray = [];
   var fullpath = path + record;
   myarray = getallRecordFiles(fullpath);
   res.end(JSON.stringify(myarray));
})

app.get('/sourceRecordList/:name/', function (req, res){

   var tableNames = getTableNames(req);
   var config = getConfig(req.params.name);
   var record = templates.find(obj => obj.name == req.params.name);
   var myarray = [];
   var count = [];
   var fullpath = path + req.params.name.replaceAll(' ', '_');
      
   myarray = getallRecordFiles(fullpath);

   
   for (const key in config) {
      const tableconfig = config[key];
      var obj = {'name': key,'count':formatObject(myarray, tableconfig).length}
      count.push(obj);
   }
   
   res.end(JSON.stringify(count));
})

app.get('/sourceRecordTitles/:name/', function (req, res){
   var myarray = [];
   var fullpath = path + req.params.name.replaceAll(' ', '_');
      
   myarray = getallRecordFiles(fullpath);
   var titles = getTitlesofRecords(myarray,req.params.name);
   
   res.end(JSON.stringify(titles));
})

app.get('/numberOfrecords/:name', function(req, res){
   var record = req.params.name;
   var myarray = [];
   myarray = fs.readdirSync(path)
   .map(name => {
      var dir = path + name;
      var len = fs.readdirSync(dir);
      var record = templates.find(obj => obj.name == name.replaceAll('_', ' '));
      record.count = len.length;
      return record;
   });
   // console.log(myarray)
   if(record!='all')
      myarray = myarray.filter(obj => obj.name == record);
   
   res.end(JSON.stringify(myarray));
})

app.get('/tableData', function (req, res) {
      var source = req.query.source;
      var tableName = req.query.tableName;
      var id = req.query.id;
      var myarray = [];
      
      if(id == null){
          myarray = handleSingleTable(source,tableName); 
      }else{
          myarray = handleRecordTables(source,id);
      }

      res.end(JSON.stringify(myarray));
})

function handleRecordTables(source,id){
  var myarray = [];
  var fullpath = path + source.replaceAll(' ', '_');
  var config = getConfig(source);
  
  fs.readdirSync(fullpath)
  .map(name => {
    var file = fs.readFileSync(fullpath+'/'+name, 'utf8');
    var record = JSON.parse(file.trim());
    if(record.docs[0]._id == id)
      myarray.push(record);
  });
  
  var obj = getTitlesofRecords(myarray,source);
  obj = obj[0];
  var data = [];
  for (const tablename in config) {
    const tabeconfig = config[tablename];
    data.push({[tablename]: formatObject(myarray, tabeconfig)});
  }
  obj.data = data;
  var recordconf = templates.find(elem => elem.name == source);
  obj.sourceId = recordconf.id; 
  obj.sourceName = recordconf.name; 

  return obj;
}

function handleSingleTable(source,tableName){
  var myarray = [];
  var fullpath = path + source.replaceAll(' ', '_');
  var config = getConfigEntity(source,tableName);
  
  fs.readdirSync(fullpath)
  .map(name => {
    var file = fs.readFileSync(fullpath+'/'+name, 'utf8');
    var record = JSON.parse(file.trim());
    myarray.push(record);
  });
  
  return formatObject(myarray, config);
}

function getallRecordFiles(fullpath){
   var myarray = [];
   fs.readdirSync(fullpath)
      .map(name => {
        var file = fs.readFileSync(fullpath+'/'+name, 'utf8');
        var record = JSON.parse(file.trim());
        myarray.push(record);
      });
   return myarray;
}

function getConfigEntity(recordName,entity){
   var record = templates.find(obj => obj.name == recordName);
   var config = fs.readFileSync('./examples/parse/'+record.configuration, 'utf8');
   config = JSON.parse(config);
   config = _.get(config,record.name)
   config = _.get(config, entity)

   return config;
}

function getConfig(recordName){
   var record = templates.find(obj => obj.name == recordName);
   var config = fs.readFileSync('./examples/parse/'+record.configuration, 'utf8');
   config = JSON.parse(config);
   config = _.get(config,record.name);
   return config;
}

function getConfigTitle(recordName){
   var record = templates.find(obj => obj.name == recordName);
   var config = fs.readFileSync('./examples/parse/'+record.configuration, 'utf8');
   config = JSON.parse(config);
   config = _.get(config,'Title');
   return config;
}

function getTitlesofRecords(myarray, name){
   var titleConfig = getConfigTitle(name);
   var titlearray = [];
   return myarray.map(record =>{
      titlearray = titleConfig.map(path =>{
         return _.get(record,path);
      });
      
      titlearray[titlearray.length-1] = '#'+titlearray[titlearray.length-1];

      return {'id': record.docs[0]._id,'title':titlearray.join(' ')};
   })
}

function formatObject(data, config){
   // console.log(config);
  
  const mydata = data;
  var objArray = [];
  var mydata2;
  for (let i = 0; i < mydata.length; i++) {
    var fake = JSON.parse(JSON.stringify(config));
    // we dublicate the structure of the parser so we can
    // change the path to actual data
    if(mydata.length == 1)
      mydata2 = mydata[0];
    else
      mydata2 = mydata[i];

    if (config['value-type'] == undefined) {
        for (const column in config) {
          var item = config[column]; // path from parser
          if (item.path != undefined) { // undefined -> links
              var data = _.get(mydata2, item.path);
              fake[column] = data;
          } else if (item.link != undefined) { // we have link
              var data = item.link;
              fake[column].link = data;
              fake[column].Id = _.get(mydata2, item.Id);
          }
        }
    } else {
        for (const column in config) {
          var item = config[column]; // path from parser
          if (item != 'list') {
              if (item.path != undefined) { // undefined -> links
                var ret = addListData(item, mydata2);
                fake[column] = ret;
                fake['lenght'] = ret.length;
              } else if (item.link != undefined) {
                var data = item.link;
                fake[column].link = data;
                fake[column].Id = _.get(mydata2, item.Id);
              }
          }
        }
    }

    // this.mapTitle(mydata[i]);
    objArray.push(fake);
  }
  // this.List = objArray;
  // console.log(objArray);
  if(objArray[0]["value-type"] == 'list')
    objArray = formatList(objArray);
  else
  objArray = removeDuplicates(objArray);

  replaceEmptyValues(objArray);
  
  return objArray;
 }

//  formatRecord(record, config){
//   const mydata: any[] = a;
//   var objArray: any = {};

//   for (const key in mapp) { // for every source type
//     if(key == mydata[0].docs[0].template){ // for now, only for crew list IT
//       var temp = parser[mapp[key]];
//       // console.log(temp)
//       console.log(mydata.length)
//       for (let i = 0; i < mydata.length; i++){
//         var fake = JSON.parse(JSON.stringify(temp));
//         // we dublicate the structure of the parser so we can
//         // change the path to actual data

//         for(const entity in temp){ // entity --> array name e.g. Ship owners
//             var table = temp[entity]; // the table object with columns

//             if(table['value-type'] == undefined){
//               for(const column in table){
//                   var item = table[column]; // path from parser
//                   if(item.path != undefined){ // undefined -> links
//                     var data = _.get(mydata[i], item.path);
//                     fake[entity][column] = data;

//                   }else if(item.link != undefined){
//                     var data = item.link;
//                     fake[entity][column].link = data;
//                     fake[entity][column].Id = _.get(mydata[i], item.Id);
//                   }
//               }
//             }else{
//               for(const column in table){
//                 var item = table[column]; // path from parser
//                 if(item != 'list'){
//                   if(item.path != undefined){ // undefined -> links
//                     var ret: string[] = this.addListData(entity, item, mydata[i]);
//                     fake[entity][column] = ret;
//                     fake[entity]['lenght'] = ret.length;

//                   }else if(item.link != undefined){
//                     var data = item.link;
//                     fake[entity][column].link = data;
//                     fake[entity][column].Id = _.get(mydata[i], item.Id);
//                   }
//                 }
//               }
//             }

//         }
//         objArray[mydata[i].docs[0]._id] = fake;
//       }
//     }
//   }
//   this.List = objArray;
//   // console.log(objArray);
//   return objArray;
// }


 function addListData(item, mydata){
  var index = 0;
  var ar = [];

  if(Array.isArray(item.path)){ // condition for Embarkation/Discharge ports OLD
    var data0 = _.get(mydata, item.path[0].split(".#.")[0]);
    var data1 = _.get(mydata, item.path[1].split(".#.")[0]);
    while(data0[index]!= undefined && !_.isEmpty(data0[index])){
      ar.push(data0[index][item.path[0].split(".#.")[1]] +', '+ data1[index++][item.path[1].split(".#.")[1]]);
    }
    }else{
      var data = _.get(mydata, item.path.split(".#.")[0]);
      while(data[index]!= undefined && !_.isEmpty(data[index])){
        ar.push(data[index++][item.path.split(".#.")[1]]);
    }
  }
   // if(entity == 'Departure ports' || entity == 'Discharge ports' ){
   //   ar = ar.filter(function(item, pos) {
   //     return ar.indexOf(item) == pos;
   //   })
   //   // console.log(ar)
   // }
   // console.log(ar)
   return ar;
 }

 function formatList(temp) {
   var array = [];
   var totalCount = 0;
   if(Array.isArray(temp)){
     temp.forEach((element) => {
       var count = 0;
       while(count<element.lenght){
         var obj = {};
         for (const key in element){
           if(!Array.isArray(element[key])){
             obj[key] = element[key];
           }
           else{
             obj[key] = element[key][count];
           }
         }
         array[totalCount++]= obj;
         count++;
       }
     });
   //   console.log(array);
   }else{
     var element = temp;
     var count = 0;
     while(count<element.lenght){
       var obj = {};
       for (const key in element){
         if(!Array.isArray(element[key])){
           obj[key] = element[key];
         }
         else{
           obj[key] = element[key][count];
         }
       }
       array[totalCount++]= obj;
       count++;
     }
   }
   return removeDuplicates(array);
   // return array;
 }

 function removeDuplicates(data){
   // console.log(data)
   if(Object.values(data[0]).filter(val => typeof val == 'string' && val !='list').length == 1){ //if table has only one value

     var newarray = [];

     var temp = data.map(val =>{
       return Object.values(val).filter(val => typeof val == 'string' && val !='list').join();
     })
     // var temp:any[] = data.map(val =>{
     //   return Object.values(val).join(',').slice(0, -15);
     // })

     // console.log(temp)

     const count = temp.map(function (item, pos) { //bool
       return temp.indexOf(item) == pos;
     })

     // const count: boolean[] = temp.filter(Boolean).length;
     // console.log(temp)
     // var lala = temp.reduce(function (acc, curr) {
     //   return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
     // }, {});
     // console.log(lala)
     // console.log(count)
   //   console.log(count.filter(Boolean).length)
     for (let i = 0; i < data.length; i++){
       var element = data[i];
       if(count[i] == true){
         newarray.push(element)
       }else{
         var name = temp[i];
         var index = findIndexOfName(name,newarray);
         newarray[index] = merge(newarray[index], element);
       }
     }
   //   console.log(newarray)
     return newarray;
   }

   return data;
 }

 function merge(father, element){
   // console.log(father)
   // console.log(element)
   for (const key in father) {
     if(_.isObject(father[key])){
       if(_.isArray(father[key])){
         father[key].push(element[key]);
       }else{
         var temp = [];
         temp.push(father[key],element[key]);
         // console.log('first')
         father[key] = temp;
       }
     }
   }
   return father;
   // console.log(father)
 }

 function findIndexOfName(name, newarray) {
   return newarray.findIndex(data => Object.values(data).filter(val => typeof val == 'string' && val !='list').join() == name )
 }

function replaceEmptyValues(array) {
   array.forEach(obj => {
      Object.keys(obj).forEach(function (key) {
         if (obj[key] === '' || obj[key] == undefined) {
            obj[key] = 'Unknown';
         }
      });
   });
}

function getTableNames(req){
   var recordName = req.params.name;
   var record = templates.find(obj => obj.name == recordName);
   var config = fs.readFileSync('./examples/parse/'+record.configuration, 'utf8');
   config = JSON.parse(config);
   config = _.get(config,record.name);
   return JSON.stringify(Object.keys(config));
}
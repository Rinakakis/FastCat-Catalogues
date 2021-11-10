var _ = require('lodash');
var express = require('express');
var app = express();
var fs = require("fs");
var cors = require('cors');
const { isArray, isObject } = require('lodash');
const { table } = require('console');

app.use(cors());

var path = './Template_examples/';

const templates = [
   {
      "id":"Accounts book",
      "name":"Accounts book",
      "description":"A description of the template",
      "configuration":"accountsbook_conf.json"
   },
   {
      "id":"Census_LaCiotat",
      "name":"Census La Ciotat",
      "description":"A description of the template",
      "configuration":"censuslaciotat_conf.json"
   },
   {
      "id":"Crew List",
      "name":"Crew and displacement list (Roll)",
      "description":"A description of the template",
      "configuration":"crewlistroll_conf.json"
   },
   {
      "id":"Crew List_IT",
      "name":"Crew List (Ruoli di Equipaggio)",
      "description":"A description of the template",
      "configuration":"crewListRuoli_conf.json"
   },
   {
      "id":"Civil Register",
      "name":"Civil Register",
      "description":"A description of the template",
      "configuration":"civilregister_conf.json"
   },
   {
      "id":"Messageries_Maritimes",
      "name":"Employment records, Shipyards of Messageries Maritimes, La Ciotat",
      "description":"A description of the template",
      "configuration":"messageriesmaritimes_conf.json"
   },
   {
      "id":"Messageries_Maritimes",
      "name":"Employment records, Shipyards of Messageries Maritimes, La Ciotat",
      "description":"A description of the template",
      "configuration":"messageriesmaritimes_conf.json"
   },
   {
      "id":"Census Odessa",
      "name":"First national all-Russian census of the Russian Empire",
      "description":"A description of the template",
      "configuration":"censusodessa_conf.json"
   },
   {
      "id":"Crew_List_ES",
      "name":"General Spanish Crew List",
      "description":"A description of the template",
      "configuration":"CrewListES_conf.json"
   },
   {
      "id":"Inscription_Maritime",
      "name":"Inscription Maritime - Maritime Register of the State for La Ciotat",
      "description":"A description of the template",
      "configuration":"Inscription_Maritime_conf.json"
   },
   {
      "id":"Ship_List",
      "name":"List of ships",
      "description":"A description of the template",
      "configuration":"Ship_List_conf.json"
   },
   {
      "id":"Logbook",
      "name":"Logbook",
      "description":"A description of the template",
      "configuration":"Logbook_conf.json"
   },
   {
      "id":"Register_of_Ships",
      "name":"Naval Ship Register List",
      "description":"A description of the template",
      "configuration":"Register_of_Ships_conf.json"
   },
   {
      "id":"Notarial Deeds",
      "name":"Notarial Deeds",
      "description":"A description of the template",
      "configuration":"Notarial_Deeds_conf.json"
   },
   {
      "id":"Payroll",
      "name":"Payroll",
      "description":"A description of the template",
      "configuration":"Payroll_conf.json"
   },
   {
      "id":"Payroll_RU",
      "name":"Payroll of Russian Steam Navigation and Trading Company",
      "description":"A description of the template",
      "configuration":"Payroll_RU_conf.json"
   },
   {
      "id":"Maritime_Register_ES",
      "name":"Register of Maritime personel",
      "description":"A description of the template",
      "configuration":"Maritime_Register_ES_conf.json"
   },
   {
      "id":"Maritime Workers_IT",
      "name":"Register of Maritime workers (Matricole della gente di mare)",
      "description":"A description of the template",
      "configuration":"Maritime Workers_IT_conf.json"
   },
   {
      "id":"Sailors_Register",
      "name":"Sailors register (Libro de registro de marineros)",
      "description":"A description of the template",
      "configuration":"Sailors_Register_conf.json"
   },
   {
      "id":"Seagoing_Personel",
      "name":"Seagoing Personel",
      "description":"A description of the template",
      "configuration":"Seagoing_Personel_conf.json"
   },
   {
      "id":"Students Register",
      "name":"Students Register",
      "description":"A description of the template",
      "configuration":"Students_Register_conf.json"
   },

];

var server = app.listen(8081, function () {
   var host = server.address().address;
   var port = server.address().port;
   console.log("Example app listening at http://%s:%s", host, port)
});

app.get('/record/:name', function (req, res) {
   var record =req.params.name;
   record = record.replAll(' ', '_');
   var myarray = [];
   var fullpath = path + record;
   myarray = getallRecordFiles(fullpath);
   res.end(JSON.stringify(myarray));
})

app.get('/sourceRecordList/:name/', function (req, res){

   var config = getConfig(req.params.name);
   var myarray = [];
   var count = [];
   var fullpath = path + req.params.name.replAll(' ', '_');
      
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
   var fullpath = path + req.params.name.replAll(' ', '_');
      
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
      var record = templates.find(obj => obj.name == name.replAll('_', ' '));
      record.count = len.length;
      return record;
   });
   // console.log(myarray)
   if(record!='all')
      myarray = myarray.filter(obj => obj.name == record);
   
   res.end(JSON.stringify(myarray));
})

app.get('/tableData', function (req, res) {
      var query = JSON.parse(JSON.stringify(req.query));
      var source = req.query.source;
      var tableName = req.query.tableName;
      var id = req.query.id;
      var myarray = [];
      
      if(id == null){
          myarray = handleSingleTable(source,tableName);
          // console.log(myarray);
          delete query['source'];
          delete query['tableName'];
          if(!_.isEmpty(query)){
            // console.log(query)
            myarray = handleQueryTables(source,tableName,query,myarray);
          }
      }else{
          myarray = handleRecordTables(source,id);
      }
      // console.log(myarray);
      res.end(JSON.stringify(myarray));
})

function handleQueryTables(source,tableName,query,myarray){
  // console.log(query)
  var elem = myarray.filter(elem => {
    var obj = JSON.parse(JSON.stringify(elem));
    for (const key in obj) {
      if(_.isObject(obj[key])){
        delete obj[key];               
        delete obj['lenght'];               
        delete obj['value-type'];               
      } 
    }
    if(_.isEqual(obj,query)){
      return elem;
    }
  });
  // console.log(elem)
  // console.log(elem[0]['Ship']);
  // console.log(elem.length);
  if(elem.length > 1){
    var temp = [];
    for (let i = 1; i < elem.length; i++) {
      temp = merge(elem[0],elem[i])
    }
    elem.push(temp);
  }
  
  // console.log('lalala');
  // console.log(elem);
  elem = removeDuplicateLinks(elem[0],source);
  // console.log('lalala2');
  // console.log(elem);
  return getlinkedTables(elem,source);
}

function removeDuplicateLinks(elem,source){

  for (const key in elem){
    var element = elem[key];
    // console.log(element)
    if(isArray(element)){
      var noduplicates = [...new Map(element.map(item => [item.Id, item])).values()]
      elem[key] = noduplicates;
    }
  }
  return elem;
}

function getlinkedTables(elem, source){
  // console.log(elem)
  var linkArray = [];
  for (const key in elem) {
      var element = elem[key];
      if(_.isObject(element)){
        if(_.isArray(element)){
          element.forEach(obj => linkArray.push(obj.Id));
          
          var newtable = element.map(table=>{
            var temp = handleRecordTables(source,table.Id);
            var lala  = temp.data.filter(elem =>{
              if(Object.keys(elem).join() == table.link){
                // if(table.link == 'Crew members')
                //     console.log(elem)
                return elem;

              }
            })
            
            if(Object.values(lala[0])[0].length == 1)
              return Object.values(lala[0])[0][0];
            else
              return Object.values(lala[0])[0];

          });
          newtable = [].concat(...newtable); // make 2d array to 1d array

          elem[key] = removeDuplicates(newtable);

        }else{
          // console.log(element)
          linkArray.push(element.Id);
          var temp = handleRecordTables(source,element.Id);
          var lala = temp.data.filter(obj =>{
            if(Object.keys(obj).join() == element.link)
              return obj;
          })
          elem[key] = Object.values(lala[0])[0]; 
        }
      }
      
    }
    linkArray = linkArray.filter(function(item, pos) {
      return linkArray.indexOf(item) == pos;
    })
    
    var IdsWithTitles = [];
    linkArray.map(id=>{
      var record = getTitleOfId(source,id);
      IdsWithTitles.push({'id':record.id,'title':record.title});
    })

    var recordTemplate = templates.find(obj => obj.name == source);

    elem.FastCat = {'name':recordTemplate.name, 'id':recordTemplate.id, 'data':IdsWithTitles};

  return elem;
}

function handleRecordTables(source,id){
  var myarray = [];
  var fullpath = path + source.replAll(' ', '_');
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
function getTitleOfId(source,id){
  var myarray = [];
  var fullpath = path + source.replAll(' ', '_');
  
  fs.readdirSync(fullpath)
  .map(name => {
    var file = fs.readFileSync(fullpath+'/'+name, 'utf8');
    var record = JSON.parse(file.trim());
    if(record.docs[0]._id == id)
      myarray.push(record);
  });
  
  var obj = getTitlesofRecords(myarray,source);
  return obj[0];
}

function handleSingleTable(source,tableName){
  var myarray = [];
  var fullpath = path + source.replAll(' ', '_');
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
  //  console.log(data)
   if(data.length == 0) return data;
  //  if(Object.values(data[0]).filter(val => typeof val == 'string' && val !='list').length == 1){ //if table has only one value

     var newarray = [];

     var temp = data.map(val =>{
       return Object.values(val).filter(val => typeof val == 'string' && val !='list').join();
     })
    //  console.log(456);
    //  console.log(temp);
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

     for (let i = 0; i < data.length; i++){
       var element = data[i];
       if(count[i] == true){
         newarray.push(element)
       }else{
        //  console.log(element);
         var name = temp[i];
         var index = findIndexOfName(name,newarray);
         newarray[index] = merge(newarray[index], element);
       }
     }
   //   console.log(newarray)
     return newarray;
  //  }

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

String.prototype.replAll = function(search, replacement) {
  var target = this;
  return target.split(search).join(replacement);
};
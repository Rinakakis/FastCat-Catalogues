var _ = require('lodash');
var express = require('express');
var app = express();
var fs = require("fs");
var cors = require('cors');
const { isArray, isObject, isPlainObject } = require('lodash');
const { count } = require('console');
const e = require('express');

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

/** 
 * returns the names of the tables that an
 * entity has and how many of each there is
 */
app.get('/sourceRecordList/:name/', function (req, res){
  var count = [];
  var config = getConfig(req.params.name);
  if(config.length == 0){
    res.status(404).send('Page not found');
    // res.send(config);
  }else{
    var myarray = [];
    var fullpath = path + req.params.name.replAll(' ', '_');
      
    myarray = getallRecordFiles(fullpath); /*get every raw record from an entity*/
    for (const key in config) {
      const tableconfig = config[key];
      if(tableconfig.display == undefined){
        var obj = {'name': key,'count':formatObject(myarray, tableconfig).length}
        count.push(obj);
      }
    }
    res.send(JSON.stringify(count));
  }

  //  console.dir(count, { depth: null });
})

/**
 * returns the titles of the records of an entity
 */
app.get('/sourceRecordTitles/:name/', function (req, res){
  var config = getConfig(req.params.name);
  var titles = [];
  if(config.length == 0){
    res.status(404).send('Page not found');
  }else{
    var myarray = [];
    var fullpath = path + req.params.name.replAll(' ', '_');      
    myarray = getallRecordFiles(fullpath);
    titles = getTitlesofRecords(myarray,req.params.name);
    res.send(JSON.stringify(titles));
  }
})

/**
 * returns an object with the entities and the number of the records for each one
 * or for a single entity
 */
app.get('/numberOfrecords/:name', function(req, res){
  var record = req.params.name;
  var myarray = [];

    var config = getConfig(req.params.name);
    if(config.length == 0 && record !='all'){
      res.status(404).send('Page not found');
      // res.send(config);
      
    }else{
      myarray = fs.readdirSync(path)
      .map(name => {
        var dir = path + name;
        var len = fs.readdirSync(dir);
        var record = templates.find(obj => obj.name == name.replAll('_', ' '));
        record.count = len.length;
        return record;
      });
      if(record!='all')
      myarray = myarray.filter(obj => obj.name == record);
      
      // console.log(myarray)
      res.send(JSON.stringify(myarray));
    }

})


/**
 * returns data for a table of for a record or fo an entity
 */
app.get('/tableData', function (req, res) {
      var query = JSON.parse(JSON.stringify(req.query));
      var source = req.query.source;
      var tableName = req.query.tableName;
      var id = req.query.id;
      var myarray = [];
      // console.log(query)
      if(id == null && Object.keys(query).length == 2){
          myarray = handleSingleTable(source,tableName);
      }else if(id == null && Object.keys(query).length > 2){
          delete query['source'];
          delete query['tableName'];
          myarray = handleSingleTable(source,tableName,true,true);
          myarray = handleQueryTables(source,tableName,query,myarray);

      }else{
          myarray = handleRecordTables(source,id);
      }
      // console.log(myarray);
      filterData(myarray);
      res.send(JSON.stringify(myarray));
})

/**
 * Finds the query and returns its linked tables
 * @param {string} source 
 * @param {string} tableName 
 * @param {object} query 
 * @param {object[]} myarray 
 * @returns returns the linked tables that needs to be shown for the query
 */
function handleQueryTables(source,tableName,query,myarray){
  // console.log(myarray);
  // console.dir(myarray, { depth: null });
  var elem = myarray.filter(elem => {
    var obj = {}
    for (const key in elem) {
      if(!_.isObject(elem[key]) && key != 'listLength' && key != 'value-type' && key != 'display'){
        Object.assign(obj, {[key]: elem[key]});        
      } 
    }
    
    if(_.isEqual(obj,query)){
      // console.log(elem.ids);
      return elem;
    }
  });
  // console.log(elem);
  if(elem.length > 1){
    var temp = [];
    for (let i = 1; i < elem.length; i++) {
      temp = merge(elem[0],elem[i])
    }
    elem.push(temp);
  }
  
  // if(elem['value-type'] != 'nested-list')
  // console.dir(elem, { depth: null });
  
  elem = removeDuplicateLinks(elem[0]);
  elem = mergeDuplicateIdsForLinks(elem);
  
  // console.log('lalala2');
  console.dir(elem, {depth:null});
  // console.log(elem);
  return getlinkedTables(elem,source,tableName);
}

/**
 * Remove links that are duplicate
 * @param {*} elem 
 * @returns The object without the duplicate links
 */
function removeDuplicateLinks(elem){
  // console.log(elem)
  for (const key in elem){
    var element = elem[key];
    if(isArray(element) && key != 'ids'){
      var noduplicates = [...new Map(element.map(item => [item.Id, item])).values()]
      elem[key] = noduplicates;
    }
  }
  return elem;
}
function mergeDuplicateIdsForLinks(elem){
  // console.log(elem)
  var idArray = elem['ids'];
  if (idArray == undefined) return elem;

  for (const key in elem){
    var element = elem[key];
    if(isArray(element) && key != 'ids'){
      element.forEach(linkObj => {
        linkObj['ids'] = idArray.filter(idInfos => idInfos['recordId'] == linkObj['Id']); 
      })
    // }    elem[key] = noduplicates;
    }else if(isPlainObject(element) && key != 'ids'){
      // console.log(idArray);
      element['ids'] = [idArray]; 
    }
  }
  delete elem['ids'];
  return elem;
}
/**
 * Turns links to tables
 * @param {object} elem 
 * @param {string} source 
 * @param {string} tableName 
 * @returns object with the linked tables
 */
function getlinkedTables(elem, source, tableName){
  var linkArray = [];
  for (const key in elem) {
    var element = elem[key];
    if(_.isObject(element)){
      if(_.isArray(element)){
        // console.log(element)
        element.forEach(obj => linkArray.push(obj.Id));          
        
        var newtable = element.map(table=>{
          // if(elem['value-type'] == 'nested-list'){
            console.log('lala0')
            var lala = handleLinks(table,elem,tableName,source);
          // }
          if(Object.values(lala[0])[0].length == 1)
            return Object.values(lala[0])[0][0];
          else
            return Object.values(lala[0]);

        });
        
        newtable = [].concat(...newtable); // make 2d array to 1d array
        
        elem[key] = removeDuplicates(newtable,elem);

      }else{
        linkArray.push(element.Id);
        console.log('lala1')
        var lala = handleLinks(element,elem,tableName,source);
        elem[key] = Object.values(lala[0]); 
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

  elem['FastCat Records'] = {'name':recordTemplate.name, 'id':recordTemplate.id, 'data':IdsWithTitles};

  // console.log('final')
  // console.dir(elem, { depth: null });
  return elem;
}

/**
 * Gets the tables form the links
 * @param {*} table 
 * @param {*} elem 
 * @param {*} tableName 
 * @param {*} source 
 * @returns 
 */
function handleLinks(table, elem, tableName,source){
  var temp;
  if(table.listLink == true)
    temp = handleRecordTables(source,table.Id, false, true);
  else
    temp = handleRecordTables(source,table.Id);
    
    // console.log(temp)
    console.dir('table');
    // console.dir(temp, { depth: null });
    // console.dir(table);
    // console.dir('table');
    // console.dir(elem);
    
    var lala  = [];
    temp.data.forEach(elem2 =>{
    if(Object.keys(elem2).join() == table.link){
      // console.dir(elem2, {depth:null})
      if(table.listLink == true && table['link-type'] == undefined){
        
        var querytables = temp.data.filter(val => Object.keys(val).join() == tableName);
        // console.log(querytables); 
        var hm = [];
        querytables[0][tableName].forEach((crew,index) => {
          var temp1 = Object.values(crew).filter(val => typeof val == 'string' && val !='list' && val !='nested-list').join();
          var temp2 = Object.values(elem).filter(val => typeof val == 'string' && val !='list' && val !='nested-list').join();
          if(_.isEqual(temp1, temp2)){
            hm.push(elem2[table.link][index]);
          }
        });
        lala.push(hm);
      }else if(table.listLink == true && table['link-type'] == 'nl-l'){
        var hm = [];
        table.ids.forEach(idsInfo => {
          hm.push(elem2[table.link][idsInfo.Pid]);
        })
        lala.push(hm);
      }else if(table.listLink == true && table['link-type'] == 'nl-nl'){
        var hm = [];
        table.ids.forEach(idsInfo => {
          hm.push(elem2[table.link][idsInfo.Id]);
        })
        lala.push(hm);
      }else if(table.listLink == true && table['link-type'] == 'l-nl'){
        var hm = [];
        // console.log(table)
        table.ids.forEach(idsInfo => {
          // console.log(elem2[table.link])
          //foreach me pid == pid
          elem2[table.link].forEach(tbl =>{
            if(tbl['ids']['Pid'] == idsInfo.Pid)
              hm.push(tbl);
          })
        })
        lala.push(hm);
      }else{
        lala.push(elem2[table.link]);
      }
    }
  })
  // console.log('lala')
  // console.log(lala)
  return lala;
}

function handleRecordTables(source,id, remv = true, nestedlink = false){
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
    data.push({[tablename]: formatObject(myarray, tabeconfig, remv, nestedlink)});
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

/**
 * Rerurns raw data for one table of an entity
 * @param {string} source  
 * @param {*} tableName 
 * @returns raw data for one table of an entity
 */
function handleSingleTable(source,tableName,remv=true,nestedlink=false){
  var myarray = [];
  var fullpath = path + source.replAll(' ', '_');
  var config = getConfigEntity(source,tableName);
  
  fs.readdirSync(fullpath)
  .map(name => {
    var file = fs.readFileSync(fullpath+'/'+name, 'utf8');
    var record = JSON.parse(file.trim());
    myarray.push(record);
  });
  
  return formatObject(myarray, config, remv, nestedlink);
}

/**
 * Returns all the records from an entity
 * @param {string} fullpath File path of the entity's location  
 * @returns {object[]} Array with raw records in json format 
 */
function getallRecordFiles(fullpath){
   var myarray = [];
   fs.readdirSync(fullpath)
      .map(name => {
        var file = fs.readFileSync(fullpath+'/'+name, 'utf8');
        var record = JSON.parse(file.trim());
        myarray.push(record);
      });
      // console.dir(myarray, { depth: null });
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

/**
 * Returns the configuration file of an entity 
 * @param {string} recordName The name of the entity 
 * @returns {object}  The configuration file of an entity 
 */
function getConfig(recordName){
   var record = templates.find(obj => obj.name == recordName);
   if(record == undefined) return [];

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

/**
 * Gets the title for each record 
 * @param {object[]} myarray reocrd array
 * @param {string} name name of the entity
 * @returns return the title for each record 
 */
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

/**
 * Formats a records according to the configuration file each entity's 
 * @param {object[]} data Array with the records of an entity
 * @param {*} config The configuration file of an entity
 * @param {*} remv Flag to remove the duplicates
 * @returns The formated records of an entity according to the configuration file each entity's
 */
function formatObject(data, config, remv = true, nestedlink = false){
  // console.log(config)
  const mydata = data;
  var objArray = [];
  var mydata2;
  var splitarray = [];
  for (let i = 0; i < mydata.length; i++) {
    var fake = JSON.parse(JSON.stringify(config));
    // we dublicate the structure of the parser so we can
    // change the path to actual data
    if(mydata.length == 1)
      mydata2 = mydata[0];
    else
      mydata2 = mydata[i];

    // console.dir(mydata2, { depth: null });
    if (config['value-type'] == undefined){
        for (const column in config) {
          var item = config[column]; // path from parser
          if (item.path != undefined) { // undefined -> links
              var data = _.get(mydata2, item.path);
              if(data == undefined){
                fake[column] = '';
              }else if(data.includes("\n") && column != 'First planned destinations'){
                var temp = splitData(data);
                fake[column] = temp;                
                fake['value-type'] = 'list';    
                fake['listLength'] = temp.length;
              }else{
                if(data.includes("\n")) data = data.replAll("\n", ", ")
                fake[column] = data;
              }
          } else if (item.link != undefined) { // we have link
              var data = item.link;
              fake[column].link = data;
              fake[column].Id = _.get(mydata2, item.Id);
          }
        }
        if(fake['value-type'] != undefined){
          delete fake['value-type'];
          fake['listLength'];
          // console.log(fake);
          splitarray = formatList(fake);
          // console.log(yes);
        }
    }else if(config['value-type'] == 'list'){
      var count = 0;
      for (const column of Object.keys(config)) {
        var item = config[column]; // path from parser
        // console.log(item)
        if (item != 'list' && column != 'display') {
            fake['ids'];
            if (item.path != undefined) { // undefined -> links
              if(item['value-type'] == undefined){
                var ret = addListData(item, mydata2);
                count = ret.length;
                fake[column] = arrayColumn(ret,0);
                if(nestedlink)
                  fake['ids'] = arrayColumn(ret,1);
                fake['listLength'] = ret.length;
              }else{ // condition when a table that contains list data contains and non list data
                // console.log(count)
                var data = _.get(mydata2, item.path);
                var temp = [];
                for(let i = 0; i<count; i++){
                  temp.push(data);
                }
                // delete fake[column];
                // fake = Object.assign({[column]: temp}, fake); // to put the non list item infont
                fake[column] = temp;
                fake['listLength'] = ret.length;
              }
            } else if (item.link != undefined){ 
              var data = item.link;
              fake[column].link = data;
              fake[column].Id = _.get(mydata2, item.Id);
            }
        }
      } 
    }else{
      fake = addNestedListData(config, mydata2, nestedlink);       
    }

    if(splitarray.length != 0){
      splitarray.forEach(elem=> objArray.push(elem))
      splitarray = [];
    }else{
      if(isArray(fake))
        fake.forEach(element => objArray.push(element));
      else{
        objArray.push(fake);
      }
    }

  }
  // objArray
  
  if(objArray[0]["value-type"] !=  undefined)
  objArray = formatList(objArray);
  
  // console.log('after'); 
  // console.dir(objArray, { depth: null });
  if(remv == true)
    objArray = removeDuplicates(objArray);
  
  replaceEmptyValues(objArray);
  
  return objArray;
 }

/**
 * If the string contains '\n' we split it in string array
 * @param {string} data 
 * @returns string[] with the splited data
 */
function splitData(data) {
  var names = data.split('\n');
  return names.map(val =>{
    if(val == ' ') 
      return '';
    
      return val;
  });

}

/**
 * Takes list data and formats them to an array
 * @param {*} item 
 * @param {*} mydata 
 * @returns list data in an array 
 */
  function addListData(item, mydata){
    var index = 0;
    var ar = [];
      var data = _.get(mydata, item.path.split(".#.")[0]);
      while(data[index]!= undefined && !_.isEmpty(data[index])){
        // console.log(index);
        var data2 = [data[index][item.path.split(".#.")[1]], {'Pid':index,'recordId': _.get(mydata, 'docs[0]._id')}];
        if(data2[0] == undefined) data2[0] = '';
        ar.push(data2);
        index++
        // console.log(data[index]);
      }
    return ar;
  }
  
  function addNestedListData(config,mydata,nestedlink = false) {
    var index = 0;
    var total = 0;
    var fake = JSON.parse(JSON.stringify(config));
    Object.keys(fake).forEach((key)=>{
      if(key !='value-type' && fake[key].link == undefined)
      fake[key] = []; 
    });
    if(nestedlink== true)
      fake['ids'] = [];
    var path = config[Object.keys(config)[1]]['path'].split(".#.")[0];

    var data = _.get(mydata, path);
    while (data[index] != undefined && !_.isEmpty(data[index])) {
      var nest = 0;
      while (data[index][nest] != undefined /*&& !_.isEmpty(data[index][nest])*/) {
        // console.log(data[index][nest]);
        for (const column of Object.keys(config)){
          if(column!= 'value-type'){
            var item = config[column];
            if(item.path!= undefined){
              var data2 = [data[index][nest][item.path.split(".#.")[1]], index];
              if (data2[0] == undefined) data2[0] = '';
                fake[column].push(data2[0]);
            }else{
              fake[column].Id = _.get(mydata, item.Id);
            }
          }
        }
        if(nestedlink == true)
          fake['ids'].push({'Pid': index, 'Id': total, 'recordId': _.get(mydata, 'docs[0]._id')});
        nest++;
        total++;
      }
      index++;
    }
    var first = Object.keys(fake)[1];
    fake['listLength'] = fake[first].length;
    // console.log(fake);
    return fake;  
  }

 /**
  * Returns the n'th column of an array
  * @param {string[]} arr 
  * @param {number} n 
  * @returns The n'th column of an array 
  */
 const arrayColumn = (arr, n) => arr.map(x => x[n]);
 
 /**
  * Takes the list data and formats them form string arrays to on object array
  * @param {*} temp 
  * @returns object array with list data
  */
 function formatList(temp) {
   var array = [];
   var totalCount = 0;
   if(Array.isArray(temp)){
     temp.forEach((element) => {
       var count = 0;
       while(count<element.listLength){
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
     while(count<element.listLength){
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
  //  console.log(array)
   return array;
   // return array;
 }

 /**
  * Removes dublicate objects from an array
  * @param {object[]} data 
  * @returns The Array without dublicate objects  
  */
 function removeDuplicates(data){
  //  console.log(data)
   if(data.length == 0) return data;
     var newarray = [];

     var temp = data.map(val =>{
       return Object.values(val).filter(val => typeof val == 'string' && val !='list').join();
     })

     const count = temp.map(function (item, pos) { //bool
       return temp.indexOf(item) == pos;
     })
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
     return newarray;

  //  return data;
 }

 /**
  * Merges duplicate object (their links)
  * @param {*} father 
  * @param {*} element 
  * @returns merged objects
  */
 function merge(father, element){
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

 /**
  * If a value is empty of undefined replace it with 'None or Unknown' 
  * @param {object[]} array 
  */
function replaceEmptyValues(array) {
   array.forEach(obj => {
      Object.keys(obj).forEach(function (key) {
         if (obj[key] === '' || obj[key] == undefined){
            obj[key] = 'None or Unknown';
         }
      });
   });
}

// function getTableNames(req){
//    var recordName = req.params.name;
//    var record = templates.find(obj => obj.name == recordName);
//    var config = fs.readFileSync('./examples/parse/'+record.configuration, 'utf8');
//    config = JSON.parse(config);
//    config = _.get(config,record.name);
//    return JSON.stringify(Object.keys(config));
// }

/**
 * The replAll() method returns a new string with all matches of a pattern replaced by a replacement
 * @param {string} search 
 * @param {string} replacement 
 * @returns string with all matches of a pattern replaced by a replacement
 */
String.prototype.replAll = function(search, replacement) {
  var target = this;
  return target.split(search).join(replacement);
};

function filterData(myarray){
  if(isArray(myarray)){
    deleteObjects(myarray);
  }else{
    for (const key in myarray) {
      const element = myarray[key];
      if(key == 'data'){
        element.forEach((ar, index)=>{
          var key = Object.keys(ar).join();
          if(ar[key][0].display != undefined)
            delete element[index];
          else
            deleteObjects(ar[key]);

        })
      }else if(isObject(element) && key!='FastCat Records'){
        deleteObjects(element);
      }
    }
  }
}

function deleteObjects(element){
  element.forEach(elem => {
    for (const key in elem) {
      const element2 = elem[key];
      if(typeof element2 != 'string')
        delete elem[key];
    }
  })
}
const express = require('express');
const fs = require("fs");
const cors = require('cors');
const { get } = require('lodash');
const https = require('https');
const {fork} = require("child_process")
var tools = require('./index.js');

const app = express();
app.use(cors());

var appBase = express.Router();
app.use('/sealit-api', appBase);

// const pool = new StaticPool({
//   size: 4,
//   task: "./index.js"
// });

const path = './Data/';

const templates = [
  {
     "category": "Log / Account Books",
     "id":"Accounts book",
     "name":"Accounts book",
     "description":"No source description yet!",
     "configuration":"accountsbook_conf.json"
  },
  {
     "category": "Censuses",
     "id":"Census_LaCiotat",
     "name":"Census La Ciotat",
     "description":"No source description yet!",
     "configuration":"censuslaciotat_conf.json"
  },
  {
     "category": "Crew Lists",
     "id":"Crew List",
     "name":"Crew and displacement list (Roll)",
     "description":"No source description yet!",
     "configuration":"crewlistroll_conf.json"
  },
  {
     "category": "Crew Lists",
     "id":"Crew List_IT",
     "name":"Crew List (Ruoli di Equipaggio)",
     "description":"No source description yet!",
     "configuration":"crewListRuoli_conf.json"
  },
  {
     "category": "Registers / Lists",
     "id":"Civil Register",
     "name":"Civil Register",
     "description":"No source description yet!",
     "configuration":"civilregister_conf.json"
  },
  {
     "category": "Censuses",
     "id":"Census Odessa",
     "name":"First national all-Russian census of the Russian Empire",
     "description":"No source description yet!",
     "configuration":"censusodessa_conf.json"
  },
  {
     "category": "Crew Lists",
     "id":"Crew_List_ES",
     "name":"General Spanish Crew List",
     "description":"No source description yet!",
     "configuration":"CrewListES_conf.json"
  },
  {
     "category": "Registers / Lists",
     "id":"Inscription_Maritime",
     "name":"Inscription Maritime - Maritime Register of the State for La Ciotat",
     "description":"No source description yet!",
     "configuration":"Inscription_Maritime_conf.json"
  },
  {
     "category": "Registers / Lists",
     "id":"Ship_List",
     "name":"List of ships",
     "description":"No source description yet!",
     "configuration":"Ship_List_conf.json"
  },
  {
     "category": "Log / Account Books",
     "id":"Logbook",
     "name":"Logbook",
     "description":"No source description yet!",
     "configuration":"Logbook_conf.json"
  },
  {
     "category": "Registers / Lists",
     "id":"Register_of_Ships",
     "name":"Naval Ship Register List",
     "description":"No source description yet!",
     "configuration":"Register_of_Ships_conf.json"
  },
  {
     "category": "Payroll",
     "id":"Payroll",
     "name":"Payroll",
     "description":"No source description yet!",
     "configuration":"Payroll_conf.json"
  },
  {
     "category": "Payroll",
     "id":"Payroll_RU",
     "name":"Payroll of Russian Steam Navigation and Trading Company",
     "description":"No source description yet!",
     "configuration":"Payroll_RU_conf.json"
  },
  {
     "category": "Registers / Lists",
     "id":"Maritime_Register_ES",
     "name":"Register of Maritime personel",
     "description":"No source description yet!",
     "configuration":"Maritime_Register_ES_conf.json"
  },
  {
     "category": "Registers / Lists",
     "id":"Maritime Workers_IT",
     "name":"Register of Maritime workers (Matricole della gente di mare)",
     "description":"No source description yet!",
     "configuration":"Maritime_Workers_IT_conf.json"
  },
  {
     "category": "Registers / Lists",
     "id":"Sailors_Register",
     "name":"Sailors register (Libro de registro de marineros)",
     "description":"No source description yet!",
     "configuration":"Sailors_Register_conf.json"
  },
  {
     "category": "Registers / Lists",
     "id":"Seagoing_Personel",
     "name":"Seagoing Personel",
     "description":"No source description yet!",
     "configuration":"Seagoing_Personel_conf.json"
  },
  {
     "category": "Registers / Lists",
     "id":"Students Register",
     "name":"Students Register",
     "description":"No source description yet!",
     "configuration":"Students_Register_conf.json"
  },
  {
     "category": "Other Records",
     "id":"Messageries_Maritimes",
     "name":"Employment records, Shipyards of Messageries Maritimes, La Ciotat",
     "description":"No source description yet!",
     "configuration":"messageriesmaritimes_conf.json"
  },
  {
     "category": "Other Records",
     "id":"Notarial Deeds",
     "name":"Notarial Deeds",
     "description":"No source description yet!",
     "configuration":"Notarial_Deeds_conf.json"
  }
];

// https.createServer({
//   key: fs.readFileSync('server.key'),
//   cert: fs.readFileSync('server.cert')
// }, app).listen(8081, () => {
//   console.log('Listening...')
// })


var server = app.listen(8081, function () {
   var host = server.address().address;
   var port = server.address().port;
   console.log("Example app listening at http://%s:%s", host, port)
});

/** 
 * returns the names of the tables that an
 * entity has and how many of each there is
 */
appBase.get('/sourceRecordList/', async (req, res) => {
  const data = req.query.source;
  const childProcess = fork('./index.js');
  childProcess.send({"type":"sourceRecordList","source": data});
  childProcess.on("message", message =>{
    if(message == 'null')
      res.status(404).send('Page not found');
    else
      res.send(message);
  });
})

/**
 * returns the titles of the records of an entity
 */

appBase.get('/sourceRecordTitles/:name/', async (req, res) =>{
  var config = await getConfig(req.params.name);
  var titles = [];
  if(config.length == 0){
    res.status(404).send('Page not found');
  }else{
    var fullpath = path + req.params.name.replAll(' ', '_');      
    var myarray = await getRecordFilesAsync(fullpath);
    titles = await getTitlesofRecords(myarray,req.params.name);
    res.send(JSON.stringify(titles));
  }
})

/**
 * returns an object with the entities and the number of the records for each one
 * or for a single entity
 */
appBase.get('/numberOfrecords/:name', async (req, res) => {
  var record = req.params.name;
  var myarray = [];

  var config = await getConfig(req.params.name);
  if (config.length == 0 && record != 'all') {
    res.status(404).send('Page not found');
  } else {
    var list = await getRecordNamesAsync();
    myarray = list.map(source => {
      var record = templates.find(obj => obj.name == source.name.replAll('_', ' '));
      record.count = source.count;
      return record;
    });
    if (record != 'all')
      myarray = myarray.filter(obj => obj.name == record);

    res.send(JSON.stringify(myarray));
  }
})


/**
 * returns table data for a record of an entity
 */
appBase.get('/tableData', async(req, res) => {
  const childProcess = fork('./index.js');
  childProcess.send({"type":"tableData","query": req.query});
  childProcess.on("message", message =>{
    if(message == 'null')
      res.status(404).send('Page not found');
    else
      res.send(message);
  });
})

/**
 * returns table data for a record from every entity
 */
appBase.get('/exploreAll/:name', async(req, res) => {
  if(req.params.name=='Persons' && tools.CacheExists('Persons')) return res.send(await tools.getCachedList(req.params.name));
  else{
    const childProcess = fork('./index.js');
    childProcess.send({"type":"exploreAll","name": req.params.name});
    childProcess.on("message", message =>{
      // console.log('message')
      if(message == 'null')
        res.status(404).send('Page not found');
      else
        res.send(message);
    });
  }
})



/**
 * Returns all the records from an entity
 * @param {string} fullpath File path of the entity's location  
 * @returns {object[]} Array with raw records in json format 
 */
 async function getRecordFilesAsync(fullpath){
  
  const readDirPr = new Promise( (resolve, reject) => {
    fs.readdir(fullpath, 
      (err, filenames) => (err) ? reject(err) : resolve(filenames))
    });
  
  const filenames_1 = await readDirPr;
  try{
      return Promise.all(filenames_1.map((filename) => {
        return new Promise ( (resolve, reject) => {
          fs.readFile(fullpath +'/'+ filename, 'utf-8',
            (err, content) => (err) ? reject(err) : resolve(JSON.parse(content.trim())));
        });
      }));
  }catch (error) {
      return await Promise.reject(error);
  }
}

async function getRecordNamesAsync(){

  const readDirPr = new Promise( (resolve, reject) => {
    fs.readdir(path, 
      (err, foldernames) => (err) ? reject(err) : resolve(foldernames))
  });

  const foldernames_1 = await readDirPr;
  try {
    return Promise.all(foldernames_1.map((foldername) => {
      return new Promise((resolve_1, reject_1) => {
        fs.readdir(path + foldername,
          (err_1, content) => (err_1) ? reject_1(err_1) : resolve_1({ name: foldername, 'count': content.length }));
      });
    }));
  } catch (error) {
    return await Promise.reject(error);
  }
}


/**
 * Returns the configuration file of an source 
 * @param {string} source The name of the entity 
 * @returns {object}  The configuration file of an entity 
 */
async function getConfig(source) {
  // console.log(source)
  var sourceinfo = templates.find(obj => obj.name == source);
  if (sourceinfo == undefined) return [];

  var config = await fs.promises.readFile('./ConfigFiles/' + sourceinfo.configuration, 'utf8');
  // console.log(config)
  config = JSON.parse(config.trim());
  config = get(config, sourceinfo.name);
  return config;
}

 async function getConfigTitle(source){
  var sourceinfo = templates.find(obj => obj.name == source);
  var config = await fs.promises.readFile('./ConfigFiles/'+sourceinfo.configuration, 'utf8');
  config = JSON.parse(config);
  config = get(config,'Title');
  return config;
}

/**
 * Gets the title for each record 
 * @param {object[]} myarray reocrd array
 * @param {string} name name of the entity
 * @returns return the title for each record 
 */
 async function getTitlesofRecords(myarray, name){
   var titleConfig = await getConfigTitle(name);
   var titlearray = [];
   return myarray.map(record =>{
      titlearray = titleConfig.map(path =>{
         return get(record,path);
      });
      
      titlearray[titlearray.length-1] = '#'+titlearray[titlearray.length-1];

      return {'id': record.docs[0]._id,'title':titlearray.join(' ')};
   })
}


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
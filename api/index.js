const fs = require("fs");
const { get, isArray, isObject, isPlainObject, isEqual, isEmpty } = require('lodash');


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

const NumColumns = [
  'Age',
  'Age (Years)',
  'House Number',
  'Year of Birth',
  'Construction Date',
  'Registry Folio',
  'Registry List',
  'Registry Number',
  'Birth Date (Year)', // Crew List (Ruoli di Equipaggio)
  'Serial Number',
  'Months',
  'Days',
  'Total Crew Number (Captain Included)',
  'Date of Birth (Year)', // Employment records, Shipyards of Messageries Maritimes, La Ciotat
  'Tonnage', 
  'Tonnage (Value)', 
  'Year of Reagistry',
  'Year of Constraction',
  'Nominal Power',
  'Indicated Power',
  'Gross Tonnage (In Kg)',
  'Length (In Meter)',
  'Width (In Meter)',
  'Depth (In Meter)',
  'Year',
  'Refrence Number',
  'Total Days',
  'Days at Sea',
  'Days at Port',
  'Overall Total Wages (Value)',
  'Overall Pension Fund (Value)',
  'Overall Net Wages (Value)',
  'Salary per Month (Value)',
  'Net Wage (Value)',
  'Registration Number',
  'Semester',
  'From',
  'To',
  'Total Number of Students',
];

process.on("message", async (message) => {
    if(message.type == 'sourceRecordList')
        var jsonResponse = await handleSourceRecordList(message.source);
    else if(message.type == 'tableData')
        var jsonResponse = await handleTableData(message.query);
    else 
        var jsonResponse = await handleExploreAll(message.name);
    process.send(JSON.stringify(jsonResponse));
    process.exit();
})

async function handleExploreAll(name){
  var config;
  if(name == 'all'){
    config = await getConfig('explore_all');
    for (const category of Object.keys(config)) {
      var categoryObj = config[category];
      if(categoryObj['sub'] != undefined)
        config[category] = Object.keys(categoryObj['sub']);
      else
      config[category] = [];
    }
    return config;
  }

  config  = await getConfigEntity(null, name);
  // return config['sub'];
  if(Object.keys(config).length == 1 && Object.keys(config).join() == 'sub'){
    config = config['sub'];
    // console.log(config)
    for(tableName of Object.keys(config)){
      var tableConfig = config[tableName];
      await getExploreAllTables(tableConfig);
    }
  }else{
    config = await getExploreAllTables(config);
  }

  return config;
}

async function getExploreAllTables(config){
  for (const source of Object.keys(config)){
    var tableName = Object.keys(config[source]).join();
    
    var myarray = await handleSingleTable(source, tableName);
    filterData(myarray);
    config[source] = myarray; 
  }
  return config;
}

async function handleTableData(query) {
    var source = query.source;
    var tableName = query.tableName;
    var id = query.id;
    var myarray = [];
    var query = JSON.parse(JSON.stringify(query));
    var recordId = '';
    if (query.recordId != null) {
        recordId = JSON.parse(JSON.stringify(query['recordId']));
        delete query['recordId'];
    }
    if (id == null && Object.keys(query).length == 2) {
        myarray = await handleSingleTable(source, tableName);
    } else if (id == null && Object.keys(query).length > 2) {
        delete query['source'];
        delete query['tableName'];
        if (query.recordId != null) {
            myarray = await handleSingleTable(source, tableName, true, true, recordId);
        } else {
            myarray = await handleSingleTable(source, tableName, true, true);
        }
        myarray = await handleQueryTables(source, tableName, query, myarray);
    } else {
        myarray = await handleRecordTables(source, id);
    }
    filterData(myarray);
    return myarray;
}

async function handleSourceRecordList(source) {
    var count = [];

    var config = await getConfig(source);
    if (config.length == 0) {
        return null;
    } else {
        if (source == 'Employment records, Shipyards of Messageries Maritimes, La Ciotat' && CacheExists('messageriesmaritimes_list')) {
            return await getCachedList('messageriesmaritimes_list');
        } else {
            var fullpath = path + source.replAll(' ', '_');
            var myarray = await getRecordFilesAsync(fullpath);
            for (const key in config) {
                const tableconfig = config[key];
                if (tableconfig.display == undefined) {
                    var obj = { 'name': key, 'count': formatObject(myarray, tableconfig).length }
                    count.push(obj);
                }
            }
            if (source == 'Employment records, Shipyards of Messageries Maritimes, La Ciotat') {
              await saveToCache('messageriesmaritimes_list', count);
            }
            return count;
            
        }

    }
}

/**
 * Finds the query and returns its linked tables
 * @param {string} source 
 * @param {string} tableName 
 * @param {object} query 
 * @param {object[]} myarray 
 * @returns returns the linked tables that needs to be shown for the query
 */
 async function handleQueryTables(source,tableName,query,myarray){
    for (const key in query) {
      query[key] = isNum(query[key], key);
    }
    var elem = myarray.filter(el => {
      var obj = {}
      for (const key in el) {
        if(!isObject(el[key]) && key != 'listLength' && key != 'value-type' && key != 'display'){
          Object.assign(obj, {[key]: el[key]});        
        } 
      }
      if(isEqual(obj,query)){
        return el;
      }
    });
  
    // console.dir(elem, { depth: null });
    
    if(elem.length > 1){
    // console.log('mpika');
      var temp = [];
      for (let i = 1; i < elem.length; i++) {
        temp = merge(elem[0],elem[i])
      }
      elem.push(temp);
    }

    elem = removeDuplicateLinks(elem[0]);
    elem = mergeDuplicateIdsForLinks(elem);

    var result = await getlinkedTables(elem,source,tableName);

    return result;
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
      }else if(isPlainObject(element) && key != 'ids'){
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
   * @returns object with the linked tables
   */
  async function getlinkedTables(elem, source){
    var linkArray = [];
  
    // console.log(elem)
    for (const key in elem) {
      var element = elem[key];
      if(isObject(element)){
        if(isArray(element)){
          // console.log(element)
          element.forEach(obj => linkArray.push(obj.Id));          
          
          var newtable = await Promise.all(element.map(async(table)=>{
            var dataFromLinksArray = await handleLinks(table,source);
            if(Object.values(dataFromLinksArray).length == 0){
              return [];  
            }else{
              return Object.values(dataFromLinksArray);
            }
          }));
          
          newtable = [].concat(...newtable); // make 2d array to 1d array
          elem[key] = removeDuplicates(newtable);
        }else{
          linkArray.push(element.Id);
          var dataFromLinksArray = await handleLinks(element,source);
          elem[key] = removeDuplicates(Object.values(dataFromLinksArray));
        }
      }
      if(elem[key].length == 0)
        delete elem[key];
        
    }
    linkArray = linkArray.filter(function(item, pos){
      return linkArray.indexOf(item) == pos;
    })
    
    var IdsWithTitles = await Promise.all(linkArray.map(async(id)=>{
      var record = await getTitleOfId(source,id);
      // console.log(record)
      return {'id':record.id,'title':record.title};
    }))
  
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
  async function handleLinks(table, source) {
    // console.log(table.Id)
    // if(table.Id == undefined) return [];
    var temp;
    if (table.listLink == true)
      temp = await handleRecordTables(source, table.Id, false, true);
    else
      temp = await handleRecordTables(source, table.Id);
  
    // console.dir(temp.data);
    // console.dir(table, { depth: null });
    var dataFromLinksArray = [];
    var elem2 = temp.data.find(element => Object.keys(element).join() == table.link);
  
    if (table.listLink == true && table['link-type'] == undefined) {
      
      table.ids.forEach(idsInfo => {
        if (idsInfo.Mid != undefined) { // an uparxei to mid sto query vale ola ta \n pou exoyn to idio id kai mid me auto h an den uparxei to mid vale ola ta \n
          var rowsWithSameId = elem2[table.link].filter(elm => elm.ids.Id == idsInfo.Id);
          // console.log(idsInfo)
          // console.log(rowsWithSameId)
          rowsWithSameId.forEach(data => {
            if (data.ids.Mid == idsInfo.Mid || data.ids.Mid == undefined) {
              dataFromLinksArray.push(data);
            }
          });
        } else { // an den uparxei to mid sto query vale ola ta \n 
          // console.log(elem2[table.link]);  
          var rowsWithSameId = elem2[table.link].filter(elm => elm.ids.Id == idsInfo.Id);
          rowsWithSameId.forEach(data => {
            dataFromLinksArray.push(data);
          });
        }
      })
      // dataFromLinksArray.push(hm);
    } else if (table.listLink == true && table['link-type'] == 'nl-l') {
      table.ids.forEach(idsInfo => {
        var matchedData = elem2[table.link].filter(dataElem => dataElem.ids.Id == idsInfo.Pid);
        dataFromLinksArray.push(...matchedData);
        // hm.push(elem2[table.link][idsInfo.Pid]);
      })
      // dataFromLinksArray.push(hm);
    } else if (table.listLink == true && table['link-type'] == 'nl-nl') {
      // console.log(table)
      table.ids.forEach(idsInfo => {
        // console.log(idsInfo)
        if (idsInfo.Mid != undefined) { // an uparxei to mid sto query vale ola ta \n pou exoyn to idio id kai mid me auto h an den uparxei to mid vale ola ta \n
          var rowsWithSameId = elem2[table.link].filter(elm => elm.ids.Id == idsInfo.Id && elm.ids.Pid == idsInfo.Pid);
          rowsWithSameId.forEach(data => {
            if (data.ids.Mid == idsInfo.Mid || data.ids.Mid == undefined) {
              dataFromLinksArray.push(data);
            }
          });
        } else { // an den uparxei to mid sto query vale ola ta \n 
          var rowsWithSameId = elem2[table.link].filter(elm => elm.ids.Id == idsInfo.Id && elm.ids.Pid == idsInfo.Pid);
          // console.log(rowsWithSameId);  
          rowsWithSameId.forEach(data => {
            dataFromLinksArray.push(data);
          });
        }
      })
      // dataFromLinksArray.push(hm);
    } else if (table.listLink == true && table['link-type'] == 'l-nl') {
      table.ids.forEach(idsInfo => {
        elem2[table.link].forEach(tbl => {
          if (tbl['ids']['Pid'] == idsInfo.Id) {
            // console.log(tbl)
            dataFromLinksArray.push(tbl);
          }
        })
      })
      // dataFromLinksArray.push(hm);
    } else {
      // console.log(dataFromLinksArray)
      elem2[table.link].forEach(tbl=>{
        dataFromLinksArray.push(tbl);
      })
    }
    return dataFromLinksArray;
  }
  
  async function handleRecordTables(source,id, remv = true, nestedlink = false){
    var myarray = [];
    var fullpath = path + source.replAll(' ', '_');
    var config = await getConfig(source);
  
    myarray = await getRecordWithIdAsync(fullpath, id);
    var obj = await getTitlesofRecords(myarray,source);
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
  
  async function getTitleOfId(source,id){
    var myarray = [];
    var fullpath = path + source.replAll(' ', '_');
    
    myarray = await getRecordWithIdAsync(fullpath, id);
    
    var obj = await getTitlesofRecords(myarray,source);
    return obj[0];
  }
  
  
  /**
   * Rerurns raw data for one table of an entity
   * id id is provided then it returns only for that record
   * @param {string} source  
   * @param {*} tableName 
   * @returns raw data for one table of an entity
   */
  async function handleSingleTable(source,tableName,remv=true,nestedlink=false, id = null){
    var myarray = [];
    var fullpath = path + source.replAll(' ', '_');
    var config = await getConfigEntity(source,tableName);
    var data;
    if(id!= null){
      // console.log('myarray')
      // myarray = getRecordWithId(fullpath, id);
      myarray = await getRecordWithIdAsync(fullpath, id);
      data = formatObject(myarray, config, remv, nestedlink);
      return data;
    }else{
      if(source == 'Employment records, Shipyards of Messageries Maritimes, La Ciotat' && tableName == 'Workers' && CacheExists('messageriesmaritimes_workers') && remv == true && nestedlink == false){
        return getCachedList('messageriesmaritimes_workers');    
      }else{
        myarray = await  getRecordFilesAsync(fullpath);//.then(myarray =>{
        data = formatObject(myarray, config, remv, nestedlink);
        if(source == 'Employment records, Shipyards of Messageries Maritimes, La Ciotat' && tableName == 'Workers' && remv == true && nestedlink == false){
            await saveToCache('messageriesmaritimes_workers',data);
        }
        return data;
        // })
      }
    }  
    // return data;
  }
  
  /**
   * Returns all the records from an entity
   * @param {string} fullpath File path of the entity's location  
   * @returns {object[]} Array with raw records in json format 
   */
  function getRecordFiles(fullpath){
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
      
      // return myarray;
  }
  
  function getRecordNamesAsync(){
  
    const readDirPr = new Promise( (resolve, reject) => {
      fs.readdir(path, 
        (err, foldernames) => (err) ? reject(err) : resolve(foldernames))
    });
  
    return readDirPr.then( foldernames => Promise.all(foldernames.map((foldername) => {
      return new Promise ( (resolve, reject) => {
        fs.readdir(path + foldername,
          (err, content) => (err) ? reject(err) : resolve({ name: foldername, 'count':content.length}));
      })
    })).catch( error => Promise.reject(error)))
      
      // return myarray;
  }
  
  async function getRecordWithIdAsync(fullpath, id){
    var data = await getRecordFilesAsync(fullpath);//.then(data =>{
    return data.filter(record=> record.docs[0]._id == id);
    //})
  }
  
async function getConfigEntity(recordName, entity) {
  var record = {};
  if (recordName == null)
    record.configuration = 'explore_all_conf.json';
  else
    record = templates.find(obj => obj.name == recordName);
  // console.log(record)
  var config = await fs.promises.readFile('./ConfigFiles/' + record.configuration, 'utf8');
  config = JSON.parse(config);

  if (recordName != null)
    config = get(config, record.name);

  config = get(config, entity);
  // if(config == undefined && recordName == null)
  //   config = get(config, entity);

  return config;
}
  
  /**
   * Returns the configuration file of an entity 
   * @param {string} recordName The name of the entity 
   * @returns {object}  The configuration file of an entity 
   */
  async function getConfig(recordName) {
    var record = {};
    if (recordName == 'explore_all')
      record.configuration = 'explore_all.json';
    else
      record = templates.find(obj => obj.name == recordName);

    if (record == undefined) return [];
    var config = await fs.promises.readFile('./ConfigFiles/' + record.configuration, 'utf8');
    config = JSON.parse(config.trim());
    
    if (recordName != 'explore_all')
      config = get(config, record.name);
    return config;
  }
  
   async function getConfigTitle(recordName){
    var record = templates.find(obj => obj.name == recordName);
    var config = await fs.promises.readFile('./ConfigFiles/'+record.configuration, 'utf8');
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
   * Formats a records according to the configuration file each entity's 
   * @param {object[]} data Array with the records of an entity
   * @param {*} config The configuration file of an entity
   * @param {*} remv Flag to remove the duplicates
   * @returns The formated records of an entity according to the configuration file each entity's
   */
  function formatObject(data, config, remv = true, nestedlink = false){
    // console.log(data)
    const mydata = data;
    var objArray = [];
    var mydata2;
    var splitarray = [];
    for (let i = 0; i < mydata.length; i++) {
      var fake = JSON.parse(JSON.stringify(config));
      // we dublicate the structure of the parser so we can
      // change the path to actual data
      if(mydata.length == 1){
        // console.log('1')
        mydata2 = mydata[0];
      }
      else{
        // console.log('2')
        mydata2 = mydata[i];
      }
  
      // console.dir(mydata2, { depth: null });
      if (config['value-type'] == undefined){
          for (const column in config) {
            var item = config[column]; // path from parser
            if (item.path != undefined) { // undefined -> links
                var data = get(mydata2, item.path);
                if(data == undefined){
                  fake[column] = '';
                }else if(data.includes("\n") && column != 'First planned destinations'){
                  var temp = splitData(data, column);
                  fake[column] = temp;                
                  fake['value-type'] = 'list';    
                  fake['listLength'] = temp.length;
                }else{
                  if(data.includes("\n")) 
                    data = data.replAll("\n", ", ")
                  
                  fake[column] = isNum(data, column);
                }
            } else if (item.link != undefined) { // we have link
                var data = item.link;
                fake[column].link = data;
                fake[column].Id = get(mydata2, item.Id);
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
        fake = addListData(config, mydata2,nestedlink);
      }else{
        fake = addNestedListData(config, mydata2, nestedlink);       
      }
      // console.log(fake)
      if(splitarray.length != 0){
        splitarray.forEach(elem=> objArray.push(elem))
        splitarray = [];
      }else{
        if(isArray(fake)){
          fake.forEach(element => objArray.push(element));
          // console.log('lala')
        }
        else{
          objArray.push(fake);
        }
      }
  
    }

    if(objArray[0]["value-type"] !=  undefined)
      objArray = formatList(objArray);
    
    // console.log('after'); 
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
  function splitData(data, column) {
    var names = data.split('\n');
    return names.map(val =>{
      if(val == ' ') 
        return '';
      
        return isNum(val, column);
    });
  }
  
  /**
   * Takes list data and formats them to an array
   * @param {*} item 
   * @param {*} mydata 
   * @returns list data in an array 
   */
    function addListData(config, mydata2, nestedlink) {
      var count = 0;
      var fake = JSON.parse(JSON.stringify(config));
      for (const column of Object.keys(config)) {
        var item = config[column]; // path from parser
        // console.log(item)
        if (column!= 'value-type' && column != 'display') {
          fake['ids'];
          if (item.path != undefined) { // undefined -> links
            if (item['value-type'] == undefined) {
              var index = 0;
              var ar = [];
              var newLineCount = 0;
              var data = get(mydata2, item.path.split(".#.")[0]);
              while (data[index] != undefined) {
                if(!isEmpty(data[index])){
                  var recordId =  get(mydata2, 'docs[0]._id');
                  var data2 = data[index][item.path.split(".#.")[1]];
                  if (data2 == undefined || data2 == ' ') data2 = '';
                  if (data2.includes("\n")) {
                    var arraydata2 = splitData(data2, column);
                    newLineCount = arraydata2.length;
                    for (let i = 0; i < newLineCount; i++) {
                      ar.push([isNum(arraydata2[i], column), { 'Id': index, 'Mid': i, 'recordId': recordId }]);
                    }
                    newLineCount = 0;
                  } else {
                    ar.push([isNum(data2,column), { 'Id': index, 'recordId': recordId }]);
                  }
                }
                index++
              }
              count = ar.length;
              fake[column] = arrayColumn(ar, 0);
              if (nestedlink)
                fake['ids'] = arrayColumn(ar, 1);
              fake['listLength'] = ar.length;
  
              // console.log(fake['ids'])
            }else { // condition when a table that contains list data contains and non list data
              // console.log(count)
              var data = get(mydata2, item.path);
              var temp = [];
              for (let i = 0; i < count; i++) {
                temp.push(isNum(data, column)); 
              }
              // delete fake[column];
              // fake = Object.assign({[column]: temp}, fake); // to put the non list item infont
              fake[column] = temp;
              fake['listLength'] = count;
            }
          } else if (item.link != undefined) {
            var data = item.link;
            fake[column].link = data;
            fake[column].Id = get(mydata2, item.Id);
          }
        }
        previusColumn = column;
      }
      return fake;
    }
    
    function addNestedListData(config,mydata,nestedlink = false) {
      var index = 0;
      var i = 0;
      var total = 0;
      var newLineCount = 0;
      var nest = 0;
      var fake = JSON.parse(JSON.stringify(config));
      Object.keys(fake).forEach((key)=>{
        if(key !='value-type' && fake[key].link == undefined)
        fake[key] = []; 
      });
      if(nestedlink== true)
        fake['ids'] = [];
  
      if(config[Object.keys(config)[1]]['path'] != undefined)
      var path = config[Object.keys(config)[1]]['path'].split(".#.")[0];
      else // in case we have display no the first value is on the 3rd index  
      var path = config[Object.keys(config)[2]]['path'].split(".#.")[0];
        
      // console.log(path)
      var data = get(mydata, path);
      // in case that the nested table doesn't start form index 1
      // occurs in Messageries_Maritimes
      var indexes = Object.keys(data);
      // console.log(indexes)  
      index = indexes[0];
      while (data[index] != undefined && !isEmpty(data[index])){
        while (data[index][nest] != undefined /*&& !isEmpty(data[index][nest])*/) {
          // console.log(data[index][nest]);
          if(!isEmpty(data[index][nest])){
            var previusColumn = '';
            for (const column of Object.keys(config)){
              if(column!= 'value-type' && column != 'display'){
                var item = config[column];
                if(item.path!= undefined){
                  if(item['value-type']== undefined)
                    var data2 = data[index][nest][item.path.split(".#.")[1]];
                  else{
                    var data2 = get(mydata, item.path.replace('#',index));
                    // console.log(Listdata)
                    // var data2 = [data[index][item.path.split(".#.")[1]], index];
                  }
  
                  if (data2 == undefined || data2 == ' ') data2 = '';
                  if(data2.includes("\n") && item.path!= 'docs[0].data.nominative_list_of_occupants.#.person_name'){ //second condition beacause there's a \n in a colunm that takes single values. for First national all-Russian census of the Russian Empire
                    var arraydata2 = splitData(data2, column);
                    newLineCount = arraydata2.length; 
                    arraydata2.forEach(element => {
                      fake[column].push(element);
                    });
                    if(previusColumn != ''){ // case for when a table that has \n has a data without \n. in that case we need to dublicate the data newLineCount-1 times. occured in Contracting Parties, Notarial Deeds
                      for(let i = 0; i < newLineCount-1; i++){
                        fake[previusColumn].push(fake[previusColumn][fake[previusColumn].length-1]);  
                      }
                      previusColumn = '';
                    }
                  }else{
                    fake[column].push(isNum(data2, column));
                    previusColumn = column;
                  }
                }else{
                  fake[column].Id = get(mydata, item.Id);
                }
  
              }
            }
            if(nestedlink == true){
              if(newLineCount == 0){
                fake['ids'].push({'Pid': Number(index), 'Id': nest , 'recordId': get(mydata, 'docs[0]._id')});            
              }else{
                for (let i = 0; i < newLineCount; i++){
                  fake['ids'].push({'Pid': Number(index), 'Id': nest ,'Mid': i , 'recordId': get(mydata, 'docs[0]._id')});            
                }
              }
            }
          }
          nest++;
          // total = total + newLineCount + 1;
          total++;
          newLineCount = 0;
        }
        nest = 0;
        index = indexes[++i];
      }
      var first = Object.keys(fake)[1];
  
      if(first == 'display' || first == 'value-type')
        first = Object.keys(fake)[2];
  
      fake['listLength'] = fake[first].length;
      // console.log(fake)
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
    //  console.log(temp)
    var array = [];
    var totalCount = 0;
    if (Array.isArray(temp)) {
      temp.forEach((element) => {
        var count = 0;
        while (count < element.listLength) {
          var obj = {};
          for (const key in element) {
            if (!Array.isArray(element[key])) {
              obj[key] = element[key];
            }
            else {
              obj[key] = element[key][count];
            }
          }
          array[totalCount++] = obj;
          count++;
        }
      });
      //   console.log(array);
    } else {
      var element = temp;
      var count = 0;
      while (count < element.listLength) {
        var obj = {};
        for (const key in element) {
          if (!Array.isArray(element[key])) {
            obj[key] = element[key];
          }
          else {
            obj[key] = element[key][count];
          }
        }
        array[totalCount++] = obj;
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
       if(isObject(father[key])){
         if(isArray(father[key])){
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
        Object.keys(obj).forEach(key => {
           if (obj[key] === '' || obj[key] == undefined || obj[key] == ' '){
              obj[key] = 'None or Unfilled';
           }
        });
        
     });
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
  
  function filterData(myarray){
    // console.log(myarray)
    if(isArray(myarray)){
      deleteObjects(myarray);
    }else{
      for (const key in myarray) {
        const element = myarray[key];
        if(key == 'data'){
          element.forEach((ar, index)=>{
            var key2 = Object.keys(ar).join();
            // console.log(ar[key2])
            if(ar[key2].length !=0){
              if(ar[key2][0]['display'] != undefined)
                delete element[index];
              else
                deleteObjects(ar[key2]);
            }
          })
        }else if(key == 'Dummy'){
          delete myarray[key];
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
        if((typeof element2 != 'string' && typeof element2 != 'number') || (key == 'listLength' || key == 'value-type'))
          delete elem[key];
      }
    })
  }
  
  function isNum(val, column){
  
    if(val == 'None or Unfilled') return val;
  
    if(NumColumns.includes(column) && (val!= '' && val!= undefined && val!= ' ') ){
      if(val.includes(',') && val.includes('.'))
        return parseFloat(val.replace(/,/g, ''));
      else if(val.includes(','))
        return parseFloat(val.replace(/,/g, '.'));
      else if(!isNaN(val))
        return parseFloat(val);
      else 
       return val.toLowerCase();
    }
    
    return val.toLowerCase();
  }
  
  function CacheExists(fileName){
    var fileExists = fs.existsSync('./Cache/'+fileName+'.json');
    // console.log(fileExists)
    return fileExists
  }
  
  async function getCachedList(fileName){
    var list = await fs.promises.readFile('./Cache/'+fileName+'.json', 'utf8');
    list = JSON.parse(list);
    return list;
  }
  
  async function saveToCache(fileName,count){
    let data = JSON.stringify(count);
    await fs.promises.writeFile('./Cache/'+fileName+'.json', data);
  }
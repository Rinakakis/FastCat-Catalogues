const fs = require("fs");
var gracefulFs = require('graceful-fs');
const { get, isArray, isObject, isPlainObject, isEmpty, omit } = require('lodash');
var equal = require('fast-deep-equal');
const {templates, NumColumns, mapp} = require('./globalVars')
gracefulFs.gracefulify(fs);

module.exports = {
  CacheExists: CacheExists,
  getCachedList: getCachedList
};

const path = './Data/';

/**
 * handler function for the child process
 */
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


/**
 * handler for the explore all requests
 * @param {string} name name of the entity
 * @returns {object} the data for the entity as well the titles for the columns and a hash with the sources
 */
async function handleExploreAll(name){
  var config;
  var retObj = {};
  if(name == 'all'){
    if(CacheExists('explore_all')) return await getCachedList('explore_all');

    config = await getConfig('explore_all');
    for (const category of Object.keys(config)) {
      var categoryObj = config[category];
      if(categoryObj['sub'] != undefined){
        // config[category] = Object.keys(categoryObj['sub']);
        var categories = Object.keys(categoryObj['sub']);
        config[category].sub = [];
        retObj = await handleExploreAll(category);
        config[category].count = retObj.arrayWithSources.length;
        for (const subCategory of categories) {
          // console.log(subCategory)

          retObj = await handleExploreAll(subCategory);
          // console.log(subCategory)
          // console.log(retObj)
          config[category].sub.push({name: subCategory, count: retObj.arrayWithSources.length})
        }
      }
      else{
        retObj = await handleExploreAll(category);
        config[category] = retObj.arrayWithSources.length;
      }
    }
    await saveToCache('explore_all', config);
    return config;
  }

  if(name=='Persons' && CacheExists('Persons')) return await getCachedList(name);
  if(name=='Locations' && CacheExists('Locations')) return await getCachedList(name);

  config = await getConfigEntity(null, name);
  if(config == undefined) return null;

  if(Object.keys(config).length == 1 && Object.keys(config).join() == 'sub'){
    config = config['sub'];
    for(tableName of Object.keys(config)){
      // console.log(tableName)
      var tableConfig = config[tableName];
      retObj = await getExploreAllTables(tableConfig, retObj, tableName);
    }
  }else{
    // console.log(config)
    retObj = await getExploreAllTables(config,undefined, name);
  }
  if(name =='Persons' || name=='Locations') await saveToCache(name, retObj);
  return retObj;
}


/**
 *  helper function for the explore all. it takes the entities and the tables and constructs the object
 * @param {*} config the explore all config
 * @param {*} prevArray the previus object if we need to merge entities
 * @param {*} ListName the name of the table
 * @returns the data for the entity as well the titles for the columns and a hash with the sources
 */
async function getExploreAllTables(config, prevArray, ListName) {
  var arrayWithData = { data: [], titles: [], arrayWithSources: []};
  var previusTitles = [];
  
  // var arrayWithSources = [];
  if (prevArray != undefined && Object.keys(prevArray).length != 0) {
    arrayWithData = prevArray;
    previusTitles.push(prevArray.titles);
  }
  for (const source of Object.keys(config)) {
    var tableNames = Object.keys(config[source]);
    for (const tableName of tableNames) {
      // console.log(tableName)
      var myarray = await handleSingleTable(source, tableName, true, false, null, ListName);
      filterData(myarray);

      for (const key of Object.keys(myarray[0])) {
        if (!arrayWithData.titles.includes(key))
          arrayWithData.titles.push(key);
      }

      if (arrayWithData.data.length == 0) {
        for (const data of myarray) {
          arrayWithData.arrayWithSources.push([{ 'source': source, 'table': tableName }]);
          arrayWithData.data.push(data);
        }
        // arrayWithData.previusTitlesHash.push([0,myarray.length]);
      } else {
        var titles = Object.keys(myarray[0]);
        var res;
        var compare = checkIfComperationIsNeeded(previusTitles, titles);
        // console.log(compare)
        for (const data of myarray) {
          if (compare) res = containsObject(arrayWithData.data, data);
          else res = false;
          if (res === false) {
            arrayWithData.data.push(data);
            arrayWithData.arrayWithSources.push([{ 'source': source, 'table': tableName }]);
          } else {
            arrayWithData.arrayWithSources[res].push({ 'source': source, 'table': tableName });
          }
        }
      }
      previusTitles.push(Object.keys(myarray[0]));
    }
  }
  return arrayWithData;
}

/**
 * checks if the current titles exists in the previus object 
 * @param {string} previusTitles 
 * @param {string} currTitles 
 * @returns true of false
 */
function checkIfComperationIsNeeded(previusTitles, currTitles){
  // console.log(previusTitles)
  for (let i = 0; i < previusTitles.length; i++) {
    // console.log(previusTitles[i])

    // console.log('curr')
    // console.log(currTitles)
    const titles = previusTitles[i];
    if(currTitles.every(title=> titles.includes(title))) return true;  
  }
  // if(currTitles.every(title=> [].concat(...previusTitles).includes(title))) return true;

  return false;
}

/**
 * checks if an object array contains an object
 * @param {*} arr 
 * @param {*} obj 
 * @returns if it contains the object we return the position of not we return false
 */
function containsObject(arr, obj){
  for (const [i,row] of arr.entries()) {
    if(equal(row,obj))
      return i;
  }
  return false;
}

/**
 * handler for the "explore by source" table data and queries
 * @param {*} query the get request query
 * @returns an object with the data
 */
async function handleTableData(query) {
    var source = query.source;
    var tableName = query.tableName;
    var id = query.id;
    var myarray = [];
    var query = JSON.parse(JSON.stringify(query));
    var recordId = null;
    if (query.recordId != null) {
        recordId = JSON.parse(JSON.stringify(query['recordId']));
        delete query['recordId'];
    }
    if (id == null && Object.keys(query).length == 2) {
        myarray = await handleSingleTable(source, tableName);
    } else if (id == null && Object.keys(query).length > 2) {
        delete query['source'];
        delete query['tableName'];
        if (recordId != null) {
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

/**
 * handles the requests for the list of each source 
 * @param {*} source 
 * @returns an array with the names of the tables and the count of the datat for each table
 */
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
    // console.log(myarray)
    var elem = myarray.filter(el => {
      var obj = {}
      for (const key in el) {
        if(!isObject(el[key]) && key != 'listLength' && key != 'value-type' && key != 'display'){
          Object.assign(obj, {[key]: el[key]});        
        } 
      }
      if(equal(obj,query)){
        return el;
      }
    });
  
    // console.dir(elem, { depth: null });
  //  console.log(query)
    if(elem.length > 1){
    // console.log('mpika');
      var temp = [];
      for (let i = 1; i < elem.length; i++) {
        temp = merge(elem[0],elem[i])
      }
      elem.push(temp);
    }else if(elem.length == 0){
      return null; //query does not exist
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
  
  /**
   * handles the request for the tablers for one record
   * @param {*} source source of the record
   * @param {*} id id of the record
   * @param {*} remv Flag to remove the duplicates
   * @param {*} nestedlink flag to see if we need to calculate the links
   * @returns the datat for the record, the sourceId and the sourceName
   */
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
   * @param {*} nestedlink flag to see if we need to calculate the links
   * @returns raw data for one table of an entity
   */
  async function handleSingleTable(source,tableName,remv=true,nestedlink=false, id = null, exploreAllName){
    var myarray = [];
    var fullpath = path + source.replAll(' ', '_');
    var config = await getConfigEntity(source,tableName);
    var data;
    if(exploreAllName != undefined) 
      config = ChangeConfigKeys(source,tableName, config);

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
        myarray = await getRecordFilesAsync(fullpath);
        data = formatObject(myarray, config, remv, nestedlink);
        // console.log(data)
        if(source == 'Employment records, Shipyards of Messageries Maritimes, La Ciotat' && tableName == 'Workers' && remv == true && nestedlink == false){
            await saveToCache('messageriesmaritimes_workers',data);
        }
        return data;
      }
    }  
    // return data;
  }
  
  /**
   * it changes the keys from the connfig files if needed "explore all"
   * @param {*} source 
   * @param {*} tableName 
   * @param {*} config 
   * @returns config file with kayes changes
   */
  function ChangeConfigKeys(source, tableName, config){
    if(config['display']) delete config['display'];
    if(mapp[source] == undefined || mapp[source][tableName] == undefined) return config;
    // var keys = Object.keys(config);
    for (const key of Object.keys(config)) {
      var newKey = mapp[source][tableName][key];
      if(newKey != undefined){
        config = Object.keys(config).reduce((a, key2) => ({
          ...a,
          [key2 === key ? newKey : key2]: config[key2],
        }), {});
      }
      // if(key == 'display') delete config[key];
    }
    return config;
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
  
  // function getRecordNamesAsync(){
  
  //   const readDirPr = new Promise( (resolve, reject) => {
  //     fs.readdir(path, 
  //       (err, foldernames) => (err) ? reject(err) : resolve(foldernames))
  //   });
  
  //   return readDirPr.then( foldernames => Promise.all(foldernames.map((foldername) => {
  //     return new Promise ( (resolve, reject) => {
  //       fs.readdir(path + foldername,
  //         (err, content) => (err) ? reject(err) : resolve({ name: foldername, 'count':content.length}));
  //     })
  //   })).catch( error => Promise.reject(error)))
      
  //     // return myarray;
  // }
  
  async function getRecordWithIdAsync(fullpath, id){
    var data = await getRecordFilesAsync(fullpath);//.then(data =>{
    return data.filter(record=> record.docs[0]._id == id);
    //})
  }
/**
 * Returns the configuration file of an entity in a specific source
 * @param {string} source The name of the source 
 * @returns {object}  The configuration file of an entity in a specific source
 */
async function getConfigEntity(source, entity) {
  var sourceInfo = {};
  if (source == null)
    sourceInfo.configuration = 'explore_all_conf.json';
  else
    sourceInfo = templates.find(obj => obj.name == source);
  // console.log(record)
  var config = await fs.promises.readFile('./ConfigFiles/' + sourceInfo.configuration, 'utf8');
  config = JSON.parse(config);

  if (source != null)
    config = get(config, sourceInfo.name);

  config = get(config, entity);
  // if(config == undefined && recordName == null)
  //   config = get(config, entity);

  return config;
}
  
  /**
   * Returns the configuration file of an source 
   * @param {string} source The name of the source 
   * @returns {object}  The configuration file of an source 
   */
  async function getConfig(source) {
    var sourceInfo = {};
    if (source == 'explore_all')
    sourceInfo.configuration = 'explore_all.json';
    else
    sourceInfo = templates.find(obj => obj.name == source);

    if (sourceInfo == undefined) return [];
    var config = await fs.promises.readFile('./ConfigFiles/' + sourceInfo.configuration, 'utf8');
    config = JSON.parse(config.trim());
    
    if (source != 'explore_all')
      config = get(config, sourceInfo.name);
    return config;
  }
  
   async function getConfigTitle(source){
    var sourceInfo = templates.find(obj => obj.name == source);
    var config = await fs.promises.readFile('./ConfigFiles/'+sourceInfo.configuration, 'utf8');
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
   * @param {*} nestedlink flag to see if we need to calculate the links 
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
        // console.log(splitarray)
        splitarray.forEach(elem=> objArray.push(elem))
        splitarray = [];
      }else{
        if(isArray(fake)){
          fake.forEach(element => objArray.push(element));
          // console.log('lala')
        }
        else{
          // console.log(fake)
          objArray.push(fake);
        }
      }
  
    }
    
    if(objArray[0]["value-type"] !=  undefined)
      objArray = formatList(objArray);
    // console.log(objArray)
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
    /**
   * formats the nested-list data and creates the right links if nestedlink is true
   * @param {*} config the config file of the entity
   * @param {*} mydata the array with the record data
   * @param {*} nestedlink flag to see if we need to calculate the links
   * @returns list data in an array 
   */
    function addNestedListData(config,mydata,nestedlink = false) {
      // console.log(mydata)
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
      // console.log(fake)
      if(first == 'display' || first == 'value-type')
        first = Object.keys(fake)[2]; 
      // if(!isArray(first))
      //   first = Object.keys(fake)[3];
      
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
  function removeDuplicates(data) {
    //  console.log(data)

    if (data.length == 0) return data;

    var newarray = [];

    // var dataWithoutListLength = omit(data)

    var temp = data.map(val => {
      var val2;
      if(val['listLength'] != undefined) delete val['listLength'];
      // else val2 = val;
      return Object.values(val).filter(el => (typeof el == 'string' || typeof el == 'number' ) && (el != 'list' && el != 'nested-list')).join();
    })
    // console.log(temp)
    const count = temp.map(function (item, pos) { //bool
      return temp.indexOf(item) == pos;
    })
    // console.log(data)
    for (let i = 0; i < data.length; i++) {
      var element = data[i];
      if (count[i] == true) {
        newarray.push(element)
      } else {
        var name = temp[i];
        var index = findIndexOfName(name, newarray);
        
        // console.log('merge')
        // console.log(element)
        // console.log(element)
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
    //  console.log(name)
    //  console.log(newarray)
     return newarray.findIndex(data => Object.values(data).filter(el => (typeof el == 'string' || typeof el == 'number' ) && (el != 'list' && el != 'nested-list')).join() == name )
   }
  
   /**
    * If a value is empty of undefined replace it with 'None or Unknown' 
    * @param {object[]} array 
    */
  function replaceEmptyValues(array) {
     array.forEach(obj => {
        Object.keys(obj).forEach(key => {
           if (obj[key] === '' || obj[key] == undefined || obj[key] == ' ' || obj[key] == '&nbsp;'){
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
  
  /**
   * filters arrays or objects from unwanted data
   * @param {*} myarray 
   */
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
  
  /**
   * deletes properties that are not strings and numbers or they have the key listLength or value-type from an object array
   * @param {*} element 
   */
  function deleteObjects(element){
    element.forEach(elem => {
      for (const key in elem) {
        const element2 = elem[key];
        if((typeof element2 != 'string' && typeof element2 != 'number') || (key == 'listLength' || key == 'value-type'))
          delete elem[key];
      }
    })
  }
  
  /**
   * converts string numbers to numbers
   * @param {*} val the values
   * @param {*} column the column of the value in the array
   * @returns string numbers to numbers
   */
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
    
    return val.toLowerCase().trim();
  }
  
  /**
   * looks if the file exists in the cache
   * @param {string} fileName 
   * @returns 
   */
  function CacheExists(fileName){
    var fileExists = fs.existsSync('./Cache/'+fileName+'.json');
    // console.log(fileExists)
    return fileExists;
  }
  
  /**
   * reads file from the cache folder
   * @param {string} fileName 
   * @returns the cached data
   */
  async function getCachedList(fileName){
    var list = await fs.promises.readFile('./Cache/'+fileName+'.json', 'utf8');
    list = JSON.parse(list);
    return list;
  }
  
  /**
   * saves json files to the cache folder
   * @param {*} fileName 
   * @param {*} data 
   */
  async function saveToCache(fileName,data){
    let strdata = JSON.stringify(data);
    await fs.promises.writeFile('./Cache/'+fileName+'.json', strdata);
  }
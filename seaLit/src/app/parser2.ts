export const PARSER: any = {
    "Crew List (Ruoli di Equipaggio)":{
       "Ship":{
          "Name":{
             "path":"docs[0].data.ship_records.ship_name"
          },
          "Type":{
             "path":"docs[0].data.ship_records.ship_type"
          },
          "Construction location":{
             "link":"Ship construction locations"
          },
          "Construction date":{
             "path":"docs[0].data.ship_records.construction_location_date"
          },
          "Registry number":{
             "path":"docs[0].data.ship_records.registry_number"
          },
          "Ship owners":{
             "link":"Ship owners"
          },
          "Crew members":{
             "link":"Crew members"
          }
       },
       "Ship owners":{
          "Owner name":{
             "path":"docs[0].data.ship_records.owner_name"
          },
          "Owner surname":{
             "path":"docs[0].data.ship_records.owner_surname"
          },
          "Owner fathers name":{
             "path":"docs[0].data.ship_records.owner_fathers_name"
          },
          "Ships":{
             "link":"Ship"
          }
       },
       "Registry ports":{
          "Registry port":{
             "path":"docs[0].data.ship_records.registry_port"
          },
          "Ships":{
             "link":"Ship"
          }
       },
       "Ship construction locations":{
          "Construction location":{
             "path":"docs[0].data.ship_records.construction_location"
          },
          "Ships":{
             "link":"Ship"
          }
       },
       "Departure ports":{
          "value-type":"list",
          "Port":{
             "path":"docs[0].data.route.#.departure_port"
          },
          "Ships":{
             "link":"Ship"
          }
       },
       "Crew members":{
          "value-type":"list",
          "Surname":{
             "path":"docs[0].data.crew_list.#.crew_surname"
          },
          "Name":{
             "path":"docs[0].data.crew_list.#.crew_name"
          },
          "Birth place":{
             "path":"docs[0].data.crew_list.#.crew_birth_location"
          },
          "Birth date":{
             "path":"docs[0].data.crew_list.#.crew_birth_date"
          },
          "Serial number":{
             "path":"docs[0].data.crew_list.#.crew_serial_number"
          },
          "Profession":{
             "path":"docs[0].data.crew_list.#.crew_profession_type"
          },
          "Embarkation port":{
             "path":"docs[0].data.crew_list.#.embarkation_port"
          },
          "Embarkation date":{
             "path":"docs[0].data.crew_list.#.embarkation_date"
          },
          "Discharge port":{
             "path":"docs[0].data.crew_list.#.discharge_port"
          },
          "Discharge date":{
             "path":"docs[0].data.crew_list.#.discharge_date"
          },
          "Ships":{
             "link":"Ship"
          }
       },
       "Embarkation/Discharge ports":{
          "value-type":"list",
          "Embarkation Port":{
             "path": "docs[0].data.crew_list.#.embarkation_port"             
          },
          "Discharage Port":{
            "path": "docs[0].data.crew_list.#.discharge_port"
          },
          "Crew members":{
             "link":"Crew members"
          },
          "Ships":{
             "link":"Ship"
          }
       }
    }
 }
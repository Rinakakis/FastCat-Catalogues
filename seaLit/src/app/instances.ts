export const INSTANCES: any = {
    "templates_mapping": {
        
        "Accounts book": "Accounts book",
        "Census_LaCiotat": "Census La Ciotat",
        "Civil Register": "Civil Register",
        "Crew List": "Crew and displacement list (Roll)",
        "Crew List_IT": "Crew List (Ruoli di Equipaggio)",
        "Messageries_Maritimes": "Employment records, Shipyards of Messageries Maritimes, La Ciotat",
        "Census Odessa": "First national all-Russian census of the Russian Empire",
        "Crew_List_ES": "General Spanish Crew List",
        "Inscription_Maritime": "Inscription Maritime- Maritime Register of the State for La Ciotat",
        "Ship_List": "List of ships",
        "Logbook": "Logbook",
        "Register_of_Ships": "Naval Ship Register List",
        "Notarial Deeds": "Notarial Deeds",
        "Payroll": "Payroll",
        "Payroll_RU": "Payroll of Russian Steam Navigation and Trading Company",
        "Maritime_Register_ES": "Register of Maritime personel",
        "Maritime Workers_IT": "Register of Maritime workers (Matricole della gente di mare)",
        "Sailors_Register": "Sailors register (Libro de registro de marineros)",
        "Seagoing_Personel": "Seagoing Personel",
        "Students Register": "Students Register"    
        
    },

  "persons": {
    "Crew List (Ruoli di Equipaggio)": [
      {
        "ship_identity": [
          {
            "owner_name": "name"
          },
          {
            "owner_surname": "surname_a"
          },
          {
            "owner_fathers_name": "fathers_name"
          }
        ],
        
        "crew_list": [          
          {
            "crew_name": "name"
          },
          {
            "crew_surname": "surname_a"
          },
          {
            "crew_birth_date": "date_of_birth"
          },
          {
            "crew_serial_number": "registration_number"
          }          
        ]
      }
    ],
    "General Spanish Crew List": [
      {
        "ship_identity": [
          {
            "name": "name"
          },
          {
            "surname_a": "surname_a"
          }
        ],
        
        "crew_list": [          
          {
            "name": "name"
          },
          {
            "surname_a": "surname_a"
          },
          {
            "registration_number": "registration_number"
          }
        ]
      }
    ],       
    "First national all-Russian census of the Russian Empire": [
      {
        "occupant_registry": [
          {
            "name": "name"
          },
          {
            "surname_a": "surname_a"
          },
          {
            "surname_b": "surname_b"
          }          
        ]               
      }
    ],
    "Payroll of Russian Steam Navigation and Trading Company": [
      {
        "payroll": [
          {
            "name": "name"
          },
          {
            "surname_a": "surname_a"
          },
          {
            "date_of_birth": "date_of_birth"
          }          
        ]               
      }
    ],    
    "Logbook": [
      {
        "ship_identity": [
          {
            "name": "name"
          },
          {
            "surname_a": "surname_a"
          }       
        ],
        "analytic_calendar": [
          {
            "name": "name"
          },
          {
            "surname_a": "surname_a"
          },
          {
            "status": "status"
          }   
        ]        
      }
    ],    
    "Students Register": [
      {        
        "students_list": [
          {
            "name": "name"
          },
          {
            "surname_a": "surname_a"
          },
          {
            "surname_b": "surname_b"
          },
           {
            "status": "status"
          },
          {                    
            "date_of_birth": "date_of_birth"
          }           
        ]        
      }
    ],    
    "Employment records, Shipyards of Messageries Maritimes, La Ciotat": [
      {        
        "analytic_worker_list": [
          {
            "name": "name"
          },
          {
            "surname_a": "surname_a"
          },         
           {                    
            "date_of_birth": "date_of_birth"
          }
        ]        
      }
    ],    
    "Census La Ciotat": [
      {        
        "list_of_occupants": [
          {
            "name": "name"
          },
          {
            "surname_a": "surname_a"
          },         
           {                    
            "date_of_birth": "date_of_birth"
          }
        ]        
      }
    ],    
    "Payroll": [
      {
        "ship_identity": [
          {
            "name": "name"
          },
          {
            "surname_a": "surname_a"
          }       
        ],
        "voyages": [
          {
            "name": "name"
          },
          {
            "surname_a": "surname_a"
          },
          {
            "status": "status"
          }   
        ],
        "transactions": [
          {
            "name": "name"
          },
          {
            "surname_a": "surname_a"
          },
          {
            "status": "status"
          },
          {
            "place_of_birth": "place_of_birth"
          }  
        ]                
      }
    ],
    "Accounts book": [
      {       
        "voyages": [
          {
            "name": "name"
          },
          {
            "surname_a": "surname_a"
          } 
        ],
        "transactions": [
          {
            "name": "name"
          },
          {
            "surname_a": "surname_a"
          }            
        ]                
      }
    ],
    "Sailors register (Libro de registro de marineros)": [
      {        
        "seafarers_register": [
          {
            "name": "name"
          },
          {
            "surname_a": "surname_a"
          },
          {
            "surname_b": "surname_b"
          },
          {                    
            "registration_number": "registration_number"
          }
        ]             
      }
    ], 
    "Civil Register": [
      {        
        "death_register": [
          {
            "name": "name"
          },
          {
            "surname_a": "surname_a"
          },
          {
            "surname_b": "surname_b"
          },
          {                    
            "place_of_birth": "place_of_birth"
          },          
          {                    
            "date_of_death": "date_of_death"
          }    
        ]             
      }
    ], 
    "Register of Maritime workers (Matricole della gente di mare)": [
      {        
        "maritime_workers_list": [
          {
            "name": "name"
          },
          {
            "surname_a": "surname_a"
          },
          {                    
            "fathers_name": "fathers_name"
          },   
          {                    
            "place_of_birth": "place_of_birth"
          },          
          {                    
            "registration_number": "registration_number"
          }    
        ],
        "displacement": [
          {
            "name": "name"
          },
          {
            "surname_a": "surname_a"
          }         
        ]   
      }
    ],     
    "Register of Maritime personel": [
      {        
        "register_of_maritime_personnel": [
          {
            "name": "name"
          },
          {
            "surname_a": "surname_a"
          }          
        ]
      }
    ], 
    "template with all fields": [
      {
        "ship_identity": [
          {
            "name": "name"
          },
          {
            "surname_a": "surname_a"
          },
          {                    
            "surname_b": "surname_b"
          },          
          {                    
            "fathers_name": "fathers_name"
          },          
          {                    
            "maiden_name": "maiden_name"
          },          
          {                    
            "date_of_birth": "date_of_birth"
          },          
          {                    
            "place_of_birth": "place_of_birth"
          },          
          {                    
            "date_of_death": "date_of_death"
          },          
          {                    
            "registration_number": "registration_number"
          },          
          {                    
            "status": "status"
          }               
        ]
      }
    ]        
  },    
  "ships": {
    "Crew List (Ruoli di Equipaggio)": [
      {
        "ship_identity": [
          {
            "ship_name": "name"
          },
          {
            "ship_type": "type"
          },
          {
            "construction_location": "construction_location"
          },
          {
            "construction_date": "construction_date"
          },
          {
            "registry_number": "registration_number"
          }          
        ]               
      }
    ],
    "Accounts book": [
      {       
        "ship_identity": [
          {
            "name": "name"
          },
          {
            "type": "type"
          } 
        ]                
      }
    ],
    "Payroll": [
      {       
        "ship_identity": [
          {
            "name": "name"
          },
          {
            "type": "type"
          } 
        ]                                      
      }
    ],
    "Crew and displacement list (Roll)": [
      {       
        "ship_identity": [
          {
            "name": "name"
          },
          {
            "type": "type"
          },
          {
            "registration_folio": "registration_folio"
          },
          {
            "registration_list": "registration_list"
          },
          {
            "registration_location": "registration_location"
          }   
        ]                                      
      }
    ],
    "Logbook": [
      {
        "ship_identity": [
          {
            "name": "name"
          },
          {
           "type": "type"
          }       
        ],
        "analytic_calendar": [
          {
            "name": "name"
          },
          {
           "type": "type"
          }
        ]        
      }
    ],    
    "Payroll of Russian Steam Navigation and Trading Company": [
      {
        "payroll": [
          {
            "name": "name"
          },
          {
            "owner_company": "owner_company"
          }          
        ]               
      }
    ], 
    "Register of Maritime workers (Matricole della gente di mare)": [
      {        
        "displacement": [
         {
            "type": "type"
          },
          {
            "name": "name"
          },         
          {                    
            "registration_number": "registration_number"
          }     
        ]   
      }
    ],         
    "Notarial Deeds": [
      {        
        "content_of_deed": [
          {
            "name": "name"
          },  
         {
            "type": "type"
          } 
        ]   
      }
    ],   
    "List of ships": [
      {        
        "list_of_ships": [
          {
            "call_signal": "call_signal"
          }, 
          {
            "name": "name"
          }, 
          {
            "previous_name": "previous_name"
          }, 
         {
            "type": "type"
          } ,
          {
            "registration_location": "registration_location"
          }, 
          {
            "registration_number": "registration_number"
          }, 
          {
            "construction_location": "construction_location"
          }, 
          {
            "construction_date": "construction_date"
          }
        ]   
      }
    ],        
    "Naval Ship Register List": [
      {
        "list_of_ships": [
          {
            "telegraphic_code": "telegraphic_code"
          },
          {
            "name": "name"
          },          
          {
            "owner_company": "owner_company"
          }
        ]               
      }
    ],                   
    "template with all fields": [
      {
        "ship_identity": [
          {
            "name": "name"
          },
          {
            "surname_a": "surname_a"
          },
          {                    
            "surname_b": "surname_b"
          },          
          {                    
            "fathers_name": "fathers_name"
          },          
          {                    
            "maiden_name": "maiden_name"
          },          
          {                    
            "date_of_birth": "date_of_birth"
          },          
          {                    
            "place_of_birth": "place_of_birth"
          },          
          {                    
            "date_of_death": "date_of_death"
          },          
          {                    
            "registration_number": "registration_number"
          },          
          {                    
            "status": "status"
          }               
        ]
      }
    ]        
  }
}
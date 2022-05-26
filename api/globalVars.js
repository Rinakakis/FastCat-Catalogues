const NumColumns = [
    'Age',
    // 'Age (Years)',
    'House Number',
    'Year of Birth',
    // 'Construction Date',
    'Registry Folio',
    'Registry List',
    'Registry Number',
    // 'Birth Date (Year)', // Crew List (Ruoli di Equipaggio)
    'Serial Number',
    'Months',
    'Days',
    'Total Crew Number (Captain Included)',
    // 'Date of Birth (Year)', // Employment records, Shipyards of Messageries Maritimes, La Ciotat
    'Tonnage', 
    'Tonnage (Value)', 
    'Year of Reagistry',
    'Year of Construction',
    'Nominal Power',
    'Indicated Power',
    'Gross Tonnage (In Kg)',
    'Length (In Meter)',
    'Width (In Meter)',
    'Depth (In Meter)',
    'Year',
    'Reference Number',
    'Total Days',
    'Days at Sea',
    'Days at Port',
    'Overall Total Wages (Value)',
    'Overall Pension Fund (Value)',
    'Overall Net Wages (Value)',
    'Salary per Month (Value)',
    'Net Wage (Value)',
    // 'Registration Number',
    'Semester',
    'From',
    'To',
    'Total Number of Students',
    'Monthly Wage (Value)',
    'Total Wage (Value)',
    'Pension Fund (Value)',
    'Net Wage (Value)'
];
  
const mapp = {
    "Civil Register": {
      "Persons": {
        "Surname A": "Surname"
      },
      "Related Persons": {
        "Surname A": "Surname"
      },
      "Death Locations": {
        "Death Location": "Name"
      },
      "Origin Locations":{
        "Location of Origin": "Name"
      }
    },
    "General Spanish Crew List": {
      "Crew Members": {
        "Surname A": "Surname"
      },
      "Embarkation Ports": {
        "Port": "Name"
      },
      "Ships":{
        "Port of Registry": "Registry Location"
      },
      "Locations of Residence":{
        "Location of Residence": "Name"
      },
      "First Planned Destinations":{
        "First Planned Destination": "Name"
      }
    },
    "Crew and displacement list (Roll)": {
      "Ship Owners (Persons)": {
        "Surname A": "Surname"
      },
      "Crew Members": {
        "Surname A": "Surname"
      },
      "Destination Ports": {
        "Port": "Name"
      },
      "Embarkation Ports": {
        "Port": "Name"
      },
      "Ship Construction Locations": {
        "Construction Location": "Name"
      },
      "Discharge Ports": {
        "Port": "Name"
      },
      "Ports of Provenance": {
        "Port":"Name"
      },
      "Arrival Ports": {
        "Port":"Name"
      },
      "Ship Registration Locations": {
        "Registry Location": "Name"
      },
      "Locations of Residence": {
        "Location of Residence": "Name"
      },
      "Locations of Birth": {
        "Location of Birth":"Name"
      }
    },
    "Register of Maritime personel": {
      "Persons": {
        "Surname A": "Surname"
      },
      "Residence Locations": {
        "Location of Residence": "Name"
      },
      "Birth Locations": {
        "Birth Location": "Name"
      }
    },
    "Naval Ship Register List": {
      "Owners (Persons)": {
        "Surname A": "Surname"
      },
      "Construction Places": {
        "Construction Location": "Name"
      },
      "Ships":{
        "Tonnage": "Gross Tonnage (in kg)"
      },
      "Registration Locations":{
        "Location": "Name"
      }
    },
    "List of ships": {
      "Engine Manufacturers": {
        "Engine Manufacturer": "Name"
      },
      "Registry Ports": {
        "Port": "Name"
      },
      "Ship Construction Places": {
        "Construction Location": "Name"
      },
      "Engine Construction Places": {
        "Place of Engine Construction": "Name"
      },
      "Ships":{
        "Port of Registry": "Registry Location",
        "Tonnage (Value)": "Tonnage"
      }
    },
    "Accounts book": {
      "Departure Ports": {
        "Port": "Name"
      },
      "Destination Ports": {
        "Port": "Name"
      },
      "Ports of Call": {
        "Port": "Name"
      },
      "Transaction Recording Locations": {
        "Location": "Name"
      }
    },
    "Crew List (Ruoli di Equipaggio)": {
      "Departure Ports": {
        "Port": "Name"
      },
      "Arrival Ports": {
        "Port": "Name"
      },
      "Embarkation Ports": {
        "Port": "Name"
      },
      "Ship Registry Ports": {
        "Port": "Name"
      },
      "Ship Construction Locations": {
        "Construction Location": "Name"
      },
      "Discharge Ports": {
        "Port": "Name"
      },
      "Locations of Residence": {
        "Location of Residence": "Name"
      },
      "First Planned Destinations": {
        "First Planned Destination": "Name"
      },
      "Ships":{
        "Port of Registry": "Registry Location"
      }
    },
    "Logbook": {
      "Registry Ports": {
        "Port": "Name"
      },
      "Ports": {
        "Port": "Name"
      }
    },
    "Inscription Maritime - Maritime Register of the State for La Ciotat": {
      "Birth Places": {
        "Place of Birth": "Name"
      },
      "Residence Locations": {
        "Location of Residence": "Name"
      },
      "Embarkation Locations": {
        "Embarkation Location": "Name"
      },
      "Disembarkation Locations": {
        "Disembarkation Location": "Name"
      }
    },
    "Employment records, Shipyards of Messageries Maritimes, La Ciotat": {
      "Birth Places": {
        "Place of Birth": "Name"
      },
      "Residence Locations": {
        "Location of Residence": "Name"
      }
    },
    "Census La Ciotat": {
      "Birth Places": {
        "Place of Birth": "Name"
      },
      "Organisations (Works at)": {
        "Organisation": "Name"
      }
    },
    "First national all-Russian census of the Russian Empire":{
      "Birth Places (Governorates)": {
        "Governorate": "Name"
      },
      "Occupations (main)": {
        "Occupation (main)": "Profession"
      },
      "Occupations (secondary)": {
        "Occupation (secondary)": "Profession"
      }
    },
    "Register of Maritime workers (Matricole della gente di mare)":{
      "Residence Locations": {
        "Location of Residence": "Name"
      },
      "Birth Locations": {
        "Birth Location": "Name"
      },
      "Destination Locations": {
        "Destination Location": "Name"
      },
      "Embarkation Locations": {
        "Embarkation Location": "Name"
      },
      "Discharge Locations": {
        "Discharge Location": "Name"
      },
      "Intermediate Ports of Call": {
        "Intermediate Port of Call": "Name"
      }
    },
    "Students Register":{
      "Student Employment Companies": {
        "Employment Company": "Name"
      },
      "Employment Organization of Related Persons": {
        "Employment Organization": "Name"
      },
      "Students Origin Locations": {
        "Location of Origin": "Name"
      },
      "Students": {
        "Surname A": "Surname"
      }
    },
    "Payroll of Russian Steam Navigation and Trading Company": {
      "Ship owners (Companies)": {
        "Owner (Company)": "Name"
      },
      "Ranks-Specializations": {
        "Rank-Specialization": "Profession"
      },
      "Recruitment Ports": {
        "Recruitment Port": "Name"
      }
    },
    "Seagoing Personel":{
      "Transient Professions":{
        "Transient Profession":"Profession"
      },
      "Destinations":{
        "Destination":"Name"
      },
    },
    "Sailors register (Libro de registro de marineros)": {
      "Birth Locations": {
        "Birth Location": "Name"
      },
      "Military Service Organisation Locations": {
        "Military Service Organisation Location": "Name"
      },
      "Seafarers": {
        "Surname A": "Surname"
      }
    },
    "Payroll": {
      "Locations of Origin": {
        "Location of Origin": "Name"
      }
    },
    "Notarial Deeds": {
      "Residence Locations (of Witnesses)": {
        "Location of Residence": "Name"
      },
      "Residence Locations (of Contracting Parties)": {
        "Location of Residence":"Name"
      },
      "Origin Locations (of Contracting Parties)": {
        "Location of Origin": "Name"
      },
      "Contracting Parties": {
        "Surname A": "Surname"
      }
    }
}

exports.NumColumns = NumColumns;
exports.mapp = mapp;

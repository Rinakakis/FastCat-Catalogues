export const PARSER: any = {
    "Crew List (Ruoli di Equipaggio)": {
        "Ship":{
            "name": "docs[0].data.ship_records.ship_name", 
            "type": "docs[0].data.ship_records.ship_type",
            "construction location": "docs[0].data.ship_records.construction_location",
            "construction date": "docs[0].data.ship_records.construction_location_date",
            "registry number": "docs[0].data.ship_records.registry_number"
        },
        "Ship owners":{
            "owner name": "docs[0].data.ship_records.owner_name",
            "owner surname": "docs[0].data.ship_records.owner_surname",
            "owner fathers name": "docs[0].data.ship_records.owner_fathers_name"
        },
        "Registry ports":{
            "registry port": "docs[0].data.ship_records.registry_port"
        },
        "Ship construction locations":{
            "construction location": "docs[0].data.ship_records.construction_location",
            "construction location date": "docs[0].data.ship_records.construction_location_date"
        },
        "Route ports":{
            "routes": "docs[0].data.route"
        },
        "Crew members":{
            "name": "docs[0].data.crew_list"
        }
    }
}
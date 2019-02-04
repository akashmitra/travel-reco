<-- User -->
CREATE (lukeskywalker:Person {
    username: "lukeskywalker",
    firstName: "Luke",
    lastName: "Skywalker",
    purchaseHistory: [],
    likes: [],
    dislikes: [],
    preferredAmenities: ["Swimming Pool","Business Center","Barbecue Grill","Hot Tub"]
})

CREATE (obiwan:Person {
    username: "obiwan",
    firstName: "Obi Wan",
    lastName: "Kenobi",
    purchaseHistory: [],
    likes: [],
    dislikes: [],
    preferredAmenities: ["Shuttle Service","Mini Bar","Fireplace","Hot Tub"]
})

CREATE (anakin:Person {
    username: "anakinskywalker",
    firstName: "Anakin",
    lastName: "Skywalker",
    purchaseHistory: [],
    likes: [],
    dislikes: [],
    preferredAmenities: ["Mini Bar","Casino","Lounge","Swimming Pool","Shuttle Service"]
})

CREATE (macewindu:Person {
    username: "macewindu",
    firstName: "Mace",
    lastName: "Windu",
    purchaseHistory: [],
    likes: [],
    dislikes: [],
    preferredAmenities: ["Fireplace","Business Center","Valet parking","Golf Course"]
})

CREATE 
    (lukeskywalker)-[:ARE_CONNECTED {roles:'Relative'}]->(anakin),
    (anakin)-[:ARE_CONNECTED {roles:'Friends'}]->(obiwan),
    (obiwan)-[:ARE_CONNECTED {roles:'Colleague'}]->(macewindu),
    (anakin)-[:ARE_CONNECTED {roles:'Colleague'}]->(macewindu)

<!-- Create Hotels -->

CREATE (hotelcor:Hotel { 
    hotelid: "1234",
    hotelName: "Hotel Coruscant International",
    hotelType: "Luxury",
    priceType: "Medium High",
    rating: "8", 
    unitType: [], 
    amenities: ["Free Wifi", "Free Parking", "Housekeeping", "Towels", "Complimentary Toiletries", "Complimentary Breakfast", "Television Set", "Refrigerator", "Free Early Check-in", "Luxury Bedding", "Cable TV", "Complimentary Bottled Water", "Room Service", "Swimming Pool", "Free Coffee", "On-site Restaurant", "Vending Machines"],
    pos: ["Room Service", "Luxury Beds"], 
    neg: ["Car Facility", "Food"],
    cord_lat: "22.5726N",
    cord_long: "88.3639E"
    })

CREATE (hotelnab:Hotel { 
    hotelid: "5678",
    hotelName: "Naboo Inn",
    hotelType: "Budget",
    priceType: "Medium",
    rating: "7", 
    unitType: [], 
    amenities: [ "Microwave" , "Coffeemaker", "Indoor Swimming Pool", "Satellite TV", "Shuttle Service", "Fitness Center", "Concierge", "Spa", "Kitchenette", "Dry cleaning", "Nightly Turndown Service", "Bellhop", "Valet parking", "Hot Tub", "Mini Bar", "Barbecue Grill", "Pet Friendly", "Casino", "Fireplace", "ATM Banking", "Lounge", "Golf Course", "Tennis Court", "Business Center"],
    pos: ["Microwave", "Swimming Pool", "Mini-Tub"], 
    neg: ["Wifi", "Towels"],
    cord_lat: "22.5726N",
    cord_long: "88.3639E"
    })

CREATE (hoteljak:Hotel { 
    hotelid: "7890",
    hotelName: "Jakku Resorts",
    hotelType: "Budget",
    priceType: "Medium Low",
    rating: "6", 
    unitType: [], 
    amenities: ["Free Wifi", "Free Parking", "Housekeeping", "Towels", "Complimentary Toiletries", "Complimentary Breakfast", "Television Set", "Refrigerator", "Free Early Check-in", "Luxury Bedding", "Cable TV", "Complimentary Bottled Water", "Room Service", "Swimming Pool", "Free Coffee", "On-site Restaurant", "Vending Machines"],
    pos: ["Room Service", "Luxury Beds"], 
    neg: ["Car Facility", "Food"],
    cord_lat: "22.5726N",
    cord_long: "88.3639E"
    })  


<!-- Relationship -->
match (a:Person {username:"macewindu"}), (b:Hotel {hotelid:"1234"})
create (a)-[p:HAS_PURCHASED]->(b)
return type(p)

match (a:Person {username:"anakinskywalker"}), (b:Hotel {hotelid:"5678"})
create (a)-[p:HAS_PURCHASED]->(b)
return type(p)

match (a:Person {username:"obiwan"}), (b:Hotel {hotelid:"7890"})
create (a)-[p:HAS_PURCHASED]->(b)
return type(p)


<!-- Queries -->
MATCH (tom:Person {name:{nameParam}})-[:ACTED_IN]->(m)<-[:ACTED_IN]-(coActors), 
                           (coActors)-[:ACTED_IN]->(m2)<-[:ACTED_IN]-(cocoActors)
                 WHERE NOT (tom)-[:ACTED_IN]->()<-[:ACTED_IN]-(cocoActors) AND 
                 tom <> cocoActors RETURN m2, cocoActors.name AS Recommended, count(*) AS Strength ORDER BY Strength DESC

match (a:Person {username:"obiwan"})-[:HAS_PURCHASED]->(h)
    where h.amenities= "Towels"
    return h

match (a:Person {username:"obiwan"})-[:HAS_PURCHASED]->(h)
    where h.amenities contains 'Towels'
    return h

match (a:Person {username:"macewindu"})-[:HAS_PURCHASED]->(h)
    RETURN h.hotelName, filter(x IN h.amenities WHERE x="Towels")

MATCH (a:Person {username:"macewindu"})
    RETURN a.preferredAmenities AS amenities
UNION MATCH (h:Hotel)
    RETURN h.amenities AS amenities
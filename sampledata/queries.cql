//Find all holiday destinations in Kerala. This dataset consists of only 4 destinations currently
MATCH (p:Place)-[:STATE]->(kerala)
RETURN p.name AS Destinations

//Find all tourist attractions near Hotel Zuri, which is located in Kumarakom.
MATCH (r:Resort)-[:PLACE]->(p:Place)<-[:ATTRACTION_IN]-(a:Attraction)
WHERE r.name = 'The Zuri Kumarakom'
RETURN a.name AS Attractions_Near_Zuri

//Find all Resorts that are in a HillStation, that I can visit in the month of December. 
// Return the Resort name and address, sort the results with highest rated resort first
MATCH (r1:Resort)-[:CATEGORY]->(c:Category),
 (r1:Resort)-[:PLACE]->(p:Place),
 (p:Place)-[:BEST_SEASON]->(s:Season),
 (r1:Resort)-[:RATING]->(r2:Rating)
WHERE c.name = 'Hill Station' AND s.name='December'
RETURN r1.name AS Resort, r2.rating AS Rating, r1.address AS Address
ORDER BY r2.rating DESC


//Find all Romantic Resorts that fit into my budget of 9000 INR Per Day.
// They need to provide a Spa facility and it should be atleast a 3 star rating.
MATCH (r1:Resort)-[:CATEGORY]->(c:Category),
 (r1:Resort)-[:RATING]->(r2:Rating),
 (r1:Resort)-[:FACILITY]->(f:Facility)
WHERE c.name = 'Romantic' AND r1.avg_rate <= 9000 AND f.name = 'Spa' AND r2.rating >= 3
RETURN r1.name AS Resort, r2.rating AS Rating, r1.avg_rate AS Rate_Per_Day
ORDER BY r2.rating DESC


// The recommendation engine first computes the similarity of Raju with other users. 
// The other user is similar to Raju if he has checked-in to atleast 2 hotels, that were 
// also checked-in by Raju in the same period. From the similar user, identify which resort he visited. 
// Get the location of such resorts and find the top resorts from such locations, provided they are best to be visited in January. 
// Return the resort name, it’s location, rating. Sort the results by highest rating first
MATCH (a:Person)-[v1:VISITED]->(r1:Resort),
 (b:Person)-[v2:VISITED]->(r1:Resort),
 (a:Person)-[v3:VISITED]->(r2:Resort),
 (b:Person)-[v4:VISITED]->(r2:Resort),
 (b:Person)-[v5:VISITED]->(r3:Resort),
 (r3:Resort)-[:PLACE]->(p:Place),
 (r4:Resort)-[:PLACE]->(p:Place),
 (r4:Resort)-[:RATING]->(r5:Rating),
 (p:Place)-[:BEST_SEASON]->(s:Season)
WHERE a.name = 'Raju' AND a.name <> b.name
 AND r1.name <> r2.name AND r1.name <> r3.name
 AND v1.month = v2.month AND v3.month = v4.month
 AND s.name = 'January' AND r5.rating >= 4
RETURN DISTINCT r4.name AS Resort, p.name AS Place, r5.rating AS Rating
ORDER BY r5.rating DESC
import mysql from "mysql";

export const conn = mysql.createPool({
    // connectionLimit : 10,
    // host : "202.28.34.197",
    // user : "tripbooking",
    // password : "tripbooking@csmsu",
    // database : "tripbooking"


    connectionLimit : 10,
    host : "202.28.34.197",
    user : "web66_65011212074",
    password : "65011212074@csmsu",
    database : "web66_65011212074"
});



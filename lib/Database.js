const mysql = require("mysql");
const cTable = require("console.table");
class Database {//creates a connection to a db
    constructor() {
        this.connection = mysql.createConnection({//the log in details of the db to act upon
            host: "musicdb-g2.cykqhanvgs0f.ap-southeast-2.rds.amazonaws.com",

            port: 3306,

            user: "admin",

            password: "En9VAkHhCBk4Ii3CBJ4L",
            database: "mattsEmployeeDB"
        });

        this.connection.connect(function (err) {
            if (err) throw err;
        });
    }
    returnResult(query) {//read a tables info and return the raw data
        return new Promise((resolve, reject) => {
            this.connection.query(query, (err, result) => {
                resolve(result);
                this.connection.end();
            });
        });
    }
    // var queryString = "SELECT * FROM ?? WHERE ?? = ?";
    // connection.query(queryString, [tableInput, colToSearch, valOfCol], function(err, result) {


    create(tableColumns, tableValues, table) {//insert variables into a tables data
        return new Promise((resolve, reject) => {
            let queryString = `INSERT INTO ?? (${tableColumns}) VALUES (${tableValues});`;
            this.connection.query(queryString, [table],(err, result) => {
                if (err) throw err;
                console.log("Database Updated")
                resolve("Done");
                this.connection.end();
            });
        });
    }

    read(query) {//read a db info and return the data in a table
        return new Promise((resolve, reject) => {
            this.connection.query(query, (err, result) => {
                const table = cTable.getTable(result);
                resolve(table);
                this.connection.end();
            });
        });
    }
    update(tableName, dbID, valueObject) {//updates a db table with variables
        return new Promise((resolve, reject) => {
            this.connection.query(`UPDATE ?? SET ? WHERE ?`,
                [tableName,valueObject,{id: dbID}], (err, result) => {
                    if (err) throw err;
                    console.log("Database Updated");
                    resolve("Done");
                    this.connection.end();
                });
        });
    }
    delete(tableName, dbID) {//deletes variables from a table
        return new Promise((resolve, reject) => {
            this.connection.query(`DELETE FROM ${tableName} WHERE ?`,
                {
                    id: dbID
                }, (err, result) => {
                    if (err) throw err;
                    console.log("Database Updated");
                    resolve("Done");
                    this.connection.end();
                });
        });
    }
}

module.exports = Database;

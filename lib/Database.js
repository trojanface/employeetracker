const mysql = require("mysql");
const cTable = require("console.table");
class Database {
    constructor() {
        this.connection = mysql.createConnection({
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
    returnResult(query) {
        return new Promise((resolve, reject) => {
            this.connection.query(query, (err, result) => {
                resolve(result);
                this.connection.end();
            });
        });
    }
    create(tableColumns, tableValues, table) {
        this.connection.query(`INSERT INTO ${table} (${tableColumns})
        VALUES (${tableValues});`, (err, result) => {
            if (err) throw err;
            console.log("Database Updated")
            this.connection.end();
        });
    }

    read(query) {
        return new Promise((resolve, reject) => {
            this.connection.query(query, (err, result) => {
                const table = cTable.getTable(result);
                resolve(table);
                this.connection.end();
            });
        });
    }
    update(tableName, dbID, valueObject) {
        this.connection.query(`UPDATE ${tableName} SET ? WHERE ?`,
            [
                valueObject,
                {
                    id: dbID
                }
            ], (err, result) => {
                if (err) throw err;
                console.log("Department Name Updated")
                this.connection.end();
            });
    }
    delete(tableName, dbID) {
        this.connection.query(`DELETE FROM ${tableName} WHERE ?`,
            {
                id: dbID
            }, (err, result) => {
                if (err) throw err;
                console.log("Role Removed")
                this.connection.end();
            });
    }
}

module.exports = Database;

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
    // viewBudget() {
    //     this.connection.query("SELECT * FROM employee;", (err, result) => {
    //         if (err) throw err;
    //         const table = cTable.getTable(result);
    //         console.log(table);
    //         this.connection.end();
    //     });
    // }
    allEmployees() {
        this.connection.query("SELECT * FROM employee;", (err, result) => {
            if (err) throw err;
            const table = cTable.getTable(result);
            console.log(table);
            this.connection.end();
        });
    }
    allEmployeesDep() {
        this.connection.query(`SELECT employee.first_name, employee.last_name, role.title, department.name
        FROM role 
        JOIN employee ON role.id = employee.role_id
        JOIN department ON role.department = department.id ORDER BY department.id;`, (err, result) => {
            if (err) throw err;
            const table = cTable.getTable(result);
            console.log(table);
            this.connection.end();
        });
    }
    newRole(name, salary, dept) {
        this.connection.query(`INSERT INTO role (title, salary, department)
        VALUES ("${name}", "${salary}", ${dept});`, (err, result) => {
            if (err) throw err;
            console.log("New Role Added")
            this.connection.end();
        });
    }
    remRole(idnum) {
        this.connection.query("DELETE FROM role WHERE ?",
        {
          id: idnum
        }, (err, result) => {
            if (err) throw err;
            console.log("Role Removed")
            this.connection.end();
        });
    }
    addNewDepartment(depName) {
        this.connection.query(`INSERT INTO department (name)
        VALUES("${depName}")`,
        (err, result) => {
            if (err) throw err;
            console.log("New Department Added")
            this.connection.end();
        });
    }
    remDep(idnum) {
        this.connection.query("DELETE FROM department WHERE ?",
        {
          id: idnum
        }, (err, result) => {
            if (err) throw err;
            console.log("Department Removed")
            this.connection.end();
        });
    }
    updDep(oldId, newName) {
        this.connection.query("UPDATE department SET ? WHERE ?",
        [
          {
            name: newName
          },
          {
            id: oldId
          }
        ], (err, result) => {
            if (err) throw err;
            console.log("Department Name Updated")
            this.connection.end();
        });
    }
    updMan(empid, idnum) {
        this.connection.query("UPDATE employee SET ? WHERE ?",
        [
          {
            manager_id: idnum
          },
          {
            id: empid
          }
        ], (err, result) => {
            if (err) throw err;
            console.log("Employee Manager Updated")
            this.connection.end();
        });
    }
    updRole(empid, idnum) {
        this.connection.query("UPDATE employee SET ? WHERE ?",
        [
          {
            role_id: idnum
          },
          {
            id: empid
          }
        ], (err, result) => {
            if (err) throw err;
            console.log("Employee Role Updated")
            this.connection.end();
        });
    }
    allEmployeesMan() {
        this.connection.query(`SELECT e.first_name, e.last_name, CONCAT(m.first_name, ', ', m.last_name) AS Manager FROM employee e
        JOIN employee m ON e.manager_id=m.id ORDER BY Manager;`, (err, result) => {
            if (err) throw err;
            const table = cTable.getTable(result);
            console.log(table);
            this.connection.end();
        });
    }
    addNewEmployee(fName, lName, role, man) {
        this.connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
        VALUES ("${fName}", "${lName}", ${role}, ${man});`, (err, result) => {
            if (err) throw err;
            console.log("New Employee Added")
            this.connection.end();
        });
    }
    remEmployee(idnum) {
        this.connection.query("DELETE FROM employee WHERE ?",
        {
          id: idnum
        }, (err, result) => {
            if (err) throw err;
            console.log("Employee Removed")
            this.connection.end();
        });
    }
}
module.exports = Database;

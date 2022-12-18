const inititateDB = require("./initiateDB.js");

class employeeDB extends inititateDB {
  constructor(options) {
    super(options);
  }

  get_departments() {
    return new Promise((resolve, reject) => {
      this.db.query("SELECT * FROM department", (err, results) => {
        if (err) {
          reject(err);
        }
        resolve(results);
      });
    });
  }

  get_roles() {
    return new Promise((resolve, reject) => {
      return this.db.query("SELECT * FROM role", (err, results) => {
        if (err) {
          reject(err);
        }
        resolve(results);
      });
    });
  }

  get_employees() {
    return new Promise((resolve, reject) => {
      // Select id, name, title, department, salary and manager
      this.db.query(
        `SELECT
        employee.id, 
        CONCAT(employee.first_name,' ',employee.last_name) as name,
        role.title as title, 
        department.name as department, 
        role.salary, 
        CONCAT(manager.first_name, ' ', manager.last_name) as Manager 
        FROM employee LEFT JOIN role on employee.role_id = role.id 
        LEFT JOIN department on role.department_id = department.id 
        LEFT JOIN employee as manager on manager.id = employee.manager_id`,
        (err, results) => {
          if (err) {
            reject(err);
          }
          resolve(results);
        }
      );
    });
  }

  get_manager() {
    return new Promise((resolve, reject) => {
      this.db.query(
        `SELECT
        employee.id,
        CONCAT(employee.first_name, ' ', employee.last_name) as name,
	    department.name as department
        FROM employee LEFT JOIN role on employee.role_id = role.id 
        LEFT JOIN department on role.department_id = department.id 
        WHERE employee.manager_id IS NULL`,
        (err, results) => {
          if (err) {
            reject(err);
          }
          resolve(results);
        }
      );
    });
  }

  insert_department(department) {
    return new Promise((resolve, reject) => {
      this.db.query(
        // Insert new department
        `INSERT INTO department SET ?`,
        //Insert into name the new department name
        { name: department.department_name },
        (err, results) => {
          if (err) {
            reject(err);
          }
          resolve(
            `Department ${department.department_name} added successfully`
          );
        }
      );
    });
  }

  insert_role(role) {
    // save user's inserted values into a variable
    const newRole = {
      title: role.role_name,
      salary: role.role_salary,
      department_id: role.department_id,
    };

    return new Promise((resolve, reject) => {
      this.db.query(`INSERT INTO role SET ?`, newRole, (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(`The new role ${role.title} was added successfully`);
      });
    });
  }

  insert_employee(employee) {
    // save user's inserted values into a variable
    const newEmployee = {
      first_name: employee.first_name,
      last_name: employee.last_name,
      role_id: employee.role_id,
      manager_id: employee.manager_id,
    };

    return new Promise((resolve, reject) => {
      this.db.query(
        `INSERT INTO employee SET ?`,
        newEmployee,
        (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(
            `${employee.first_name} ${employee.last_name} added successfully`
          );
        }
      );
    });
  }
}

module.exports = employeeDB;

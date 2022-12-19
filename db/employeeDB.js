const DB = require("./DB.js");

class employeeDB extends DB {
  constructor(options) {
    super(options);
  }
  //-----Get all Departments-----//
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
  //------ Get all employees -----//
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
  //-----Get only managers-----//
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
  //-----Create new Department-----//
  insert_department(department) {
    return new Promise((resolve, reject) => {
      this.db.query(
        // Insert new department
        `INSERT INTO department SET ?`,
        //Insert new department name into the database
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
//-----Create new Role-----//
  insert_role(role) {
    // save user's inserted values into a variable
    const newRole = {
      title: role.role_name,
      salary: role.role_salary,
      department_id: role.department_id,
    };

    return new Promise((resolve, reject) => {
      //Insert new role into the database
      this.db.query(`INSERT INTO role SET ?`, newRole, (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(`The new role ${role.title} was added successfully`);
      });
    });
  }

  //-----Create new employee-----//
  insert_employee(employee) {
    // save user's inserted values into a variable
    const newEmployee = {
      first_name: employee.first_name,
      last_name: employee.last_name,
      role_id: employee.role_id,
      manager_id: employee.manager_id,
    };

    return new Promise((resolve, reject) => {
      //Insert the new employee into the database
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
  //-----Update employee role-----//
  update_employe_role_query(employee) {
    return new Promise((resolve, reject) => {
      this.db.query(
        "UPDATE employee SET role_id=? WHERE id=?",
        [employee.role_id, employee.employee_id],
        (err, results) => {
          if (err) {
            reject(err);
          }
          resolve(results);
        }
      );
    });
  }
  //-----Update employee Manager-----//
  update_employee_manager_query(employee) {
    return new Promise((resolve, reject) => {
      this.db.query(
        `UPDATE employee SET manager_id=? WHERE id=?`,
        [employee.manager_id, employee.employee_id],
        (err, results) => {
          if (err) {
            reject(err);
          }
          resolve(results);
        }
      );
    });
  }
  //------Get employee by manager-----//
  get_employee_by_manager(employee) {
    console.log(employee);
    return new Promise((resolve, reject) => {
      this.db.query(
        `SELECT
        employee.id, 
        CONCAT(employee.first_name,' ',employee.last_name) as name,
        role.title as title,
        CONCAT(manager.first_name, ' ', manager.last_name) as Manager 
        FROM employee 
        INNER JOIN role on employee.role_id = role.id 
        INNER JOIN employee as manager on manager.id = employee.manager_id
        WHERE manager.id = ${employee.employee_id}`,
        (err, results) => {
          if (err) {
            reject(err);
          }
          resolve(results);
        }
      );
    });
  }
}

module.exports = employeeDB;

const inquirer = require("inquirer");
const mysql = require("mysql2");
const {
  MainMenuQuestions,
  departmentQuestions,
  roleQuestions,
  employeeQuestions,
  updateEmployeeQuestions,
} = require("./questions");

//Connec to the database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "cmonin123!",
  database: "employee_db",
});

// Prompt questions
const runMenuQuestions = async () => {
  await inquirer.prompt(MainMenuQuestions).then((response) => {
    switch (response.option) {
      case "view_departments":
        view_departments();
        break;
      case "view_roles":
        view_roles();
        break;
      case "view_employees":
        view_employees();
        break;
      case "add_department":
        add_department();
        break;
      case "add_role":
        add_role();
        break;
      case "add_employee":
        add_employee();
        break;
      case "update_role":
        update_role();
        break;
      default:
        console.log("default");
        break;
    }
  });
};

//View Departments Query
const view_departments = () => {
  db.query("SELECT * FROM department", (err, results) => {
    err ? console.error(err) : console.table(results);
    //call menu questions
    runMenuQuestions();
  });
};

//View Roles Query
const view_roles = () => {
  db.query("SELECT * FROM role", (err, results) => {
    err ? console.error(err) : console.table(results);
    //call menu questions
    runMenuQuestions();
  });
};

//View Employees Query
const view_employees = () => {
  // VIEW id, name, title, department, manager
  db.query(
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
      err ? console.error(err) : console.table(results);
      //call menu questions
      runMenuQuestions();
    }
  );
};

// Add a Department
const add_department = () => {
  //Prompt add a department questions
  inquirer.prompt(departmentQuestions).then((response) => {
    db.query(
      // Insert new department
      `INSERT INTO department SET ?`,
      //Insert into name the new department name
      { name: response.department_name },
      (err, results) => {
        err
          ? console.error(err)
          : console.log(
              `Department ${response.department_name} added successfully`
            );
        //call menu questions
        runMenuQuestions();
      }
    );
  });
};
// Add a Role
const add_role = () => {
  //Get all departments and push them into roleQuestions choices
  db.query("SELECT * FROM department", (err, results) => {
    const departmentChoices = roleQuestions[2];
    results.forEach((department) => {
      departmentChoices.choices.push({
        value: department.id,
        name: department.name,
      });
    });
  });
  //Run roleQuestions and insert new role
  inquirer.prompt(roleQuestions).then((response) => {
    db.query(
      `INSERT INTO role SET ?`,
      {
        title: response.role_name,
        salary: response.role_salary,
        department_id: response.department_id,
      },
      (err, results) => {
        err
          ? console.error(err)
          : console.log(`Role ${response.title} added successfully`);
        //call menu questions
        runMenuQuestions();
      }
    );
  });
};

const add_employee = () => {
  // get all details from role and push them into "role" question in employeeQuestions
  db.query(`Select * FROM role`, (err, results) => {
    const roleQuestion = employeeQuestions[2];
    results.forEach((role) => {
      roleQuestion.choices.push({
        value: role.id,
        name: role.title,
      });
    });
  });
  const managerQuestion = employeeQuestions[3];
  //filter managers and push them into "manager" question in employeeQuestions
  db.query(
    `SELECT
      employee.id,
      CONCAT(employee.first_name, ' ', employee.last_name) as name,
	  department.name as department
      FROM employee LEFT JOIN role on employee.role_id = role.id 
      LEFT JOIN department on role.department_id = department.id 
      WHERE employee.manager_id IS NULL`,
    (err, results) => {
      results.forEach((manager) => {
        const manager_details = `${manager.name} (${manager.department})`;
        managerQuestion.choices.push({
          value: manager.id,
          name: manager_details,
        });
      });
    }
  );
  //give a null value if the employee added is a manager
  managerQuestion.choices.push({
    value: null,
    name: "None",
  });
  //Run employee questions and insert employee
  inquirer.prompt(employeeQuestions).then((response) => {
    db.query(
      `INSERT INTO employee SET ?`,
      {
        first_name: response.first_name,
        last_name: response.last_name,
        role_id: response.role_id,
        manager_id: response.manager_id,
      },
      (err, results) => {
        err
          ? console.error(err)
          : console.log(
              `${response.first_name} ${response.last_name} added successfully`
            );
        //call menu questions
        runMenuQuestions();
      }
    );
  });
};

runMenuQuestions();

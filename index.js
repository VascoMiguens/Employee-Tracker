const inquirer = require("inquirer");
const mysql = require("mysql2");
const {
  MainMenuQuestions,
  departmentQuestions,
  roleQuestions,
  employeeQuestions,
  updateEmployeeQuestions,
} = require("./questions");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "cmonin123!",
  database: "employee_db",
});

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

const view_departments = () => {
  db.query("SELECT * FROM department", (err, results) => {
    err ? console.error(err) : console.table(results);
    runMenuQuestions();
  });
};

const view_roles = () => {
  db.query("SELECT * FROM role", (err, results) => {
    err ? console.error(err) : console.table(results);
    runMenuQuestions();
  });
};

const view_employees = () => {
  db.query("SELECT * FROM employee", (err, results) => {
    err ? console.error(err) : console.table(results);
    runMenuQuestions();
  });
};

const add_department = () => {
  inquirer.prompt(departmentQuestions).then((response) => {
    db.query(
      `INSERT INTO department SET ?`,
      { name: response.department_name },
      (err, results) => {
        err
          ? console.error(err)
          : console.log(
              `Department ${response.department_name} added successfully`
            );
        runMenuQuestions();
      }
    );
  });
};

runMenuQuestions();

const inquirer = require("inquirer");
const {
  MainMenuQuestions,
  departmentQuestions,
  roleQuestions,
  employeeQuestions,
  updateEmployeeRoleQuestions,
  updateEmployeeManagerQuestions,
  employeebyManager,
  employeebyDepartment,
  deleteDepartment,
  deleteRole,
  deleteEmployee,
  departmentBudget,
  updateRoleSalary,
} = require("./questions");
const employeeDB = require("./db/employeeDB.js");
const { response } = require("express");

//Connect to the database
const db = new employeeDB({
  host: "localhost",
  user: "root",
  password: "cmonin123!",
  database: "employee_db",
});

db.connect();

//------Prompt questions------//
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
      case "update_employee_role":
        update_employee_role();
        break;
      case "update_employee_manager":
        update_employee_manager();
        break;
      case "view_employee_manager":
        view_employees_manager();
        break;
      case "view_employee_department":
        view_employee_department();
        break;
      case "delete_department":
        delete_department();
        break;
      case "delete_role":
        delete_role();
        break;
      case "delete_employee":
        delete_employee();
        break;
      case "department_budget":
        department_budget();
        break;
      case "update_role_salary":
        update_role_salary();
        break;
      default:
        console.log("default");
        break;
    }
  });
};

//------View Departments Query------//
const view_departments = () => {
  db.get_departments().then((results) => {
    //show results in a table
    console.table(results);
    //call menu questions
    runMenuQuestions();
  });
};

//------View Roles Query-----//
const view_roles = () => {
  db.get_roles().then((results) => {
    //show results in a table
    console.table(results);
    //call menu questions
    runMenuQuestions();
  });
};

//------View Employees Query------//
const view_employees = () => {
  db.get_employees().then((results) => {
    console.table(results);
    //call menu questions
    runMenuQuestions();
  });
};

//-----Add a Department-----//
const add_department = () => {
  //Prompt add a department questions
  inquirer.prompt(departmentQuestions).then((response) => {
    db.insert_department(response).then((results) => {
      console.log("\n", results, "\n");
      //call menu questions
      runMenuQuestions();
    });
  });
};
//-----Add a Role-----//
const add_role = () => {
  //Get all departments and push them into roleQuestions choices
  db.get_departments().then((results) => {
    const departmentChoices = roleQuestions[2];
    results.forEach((department) => {
      departmentChoices.choices.push({
        value: department.id,
        name: department.name,
      });
    });
    //Run roleQuestions and insert new role
    inquirer.prompt(roleQuestions).then((response) => {
      db.insert_role(response).then((results) => {
        console.log("\n", results, "\n");
        //call menu questions
        runMenuQuestions();
      });
    });
  });
};

//----Add a employee----//
const add_employee = () => {
  // get all details from role and push them into "role" question in employeeQuestions
  db.get_roles().then((results) => {
    const roleQuestion = employeeQuestions[2];
    results.forEach((role) => {
      roleQuestion.choices.push({
        value: role.id,
        name: role.title,
      });
    });

    //filter managers and push them into "manager" question in employeeQuestions
    db.get_manager().then((results) => {
      const managerQuestion = employeeQuestions[3];
      results.forEach((manager) => {
        const manager_details = `${manager.name} (${manager.department})`;
        managerQuestion.choices.push({
          value: manager.id,
          name: manager_details,
        });
      });

      //give a null value if the employee added is a manager
      managerQuestion.choices.push({
        value: null,
        name: "None",
      });

      //Run employee questions and insert employee
      inquirer.prompt(employeeQuestions).then((response) => {
        db.insert_employee(response).then((results) => {
          console.log("\n", results, "\n");
          //call menu questions
          runMenuQuestions();
        });
      });
    });
  });
};

//Update an employee's role
const update_employee_role = () => {
  // get all  employees and add them into employee question
  db.get_employees().then((results) => {
    const employeeQuestion = updateEmployeeRoleQuestions[0];
    let employeeName;
    results.forEach((employee) => {
      employeeName = employee.name;
      employeeQuestion.choices.push({
        value: employee.id,
        name: employeeName,
      });
    });
    //get all roles and add them into role question
    db.get_roles().then((results) => {
      const roleQuestion = updateEmployeeRoleQuestions[1];
      results.forEach((role) => {
        roleQuestion.choices.push({
          value: role.id,
          name: role.title,
        });
      });
      //run update employee role questions and update the role
      inquirer.prompt(updateEmployeeRoleQuestions).then((response) => {
        db.update_employe_role_query(response).then((results) => {
          console.log("\n", results, "\n");
          console.log(`${employeeName} role updated successfully`);
          //call menu questions
          runMenuQuestions();
        });
      });
    });
  });
};

const update_employee_manager = () => {
  // get all  employees
  db.get_employees().then((results) => {
    const employeeQuestion = updateEmployeeManagerQuestions[0];
    const managerQuestion = updateEmployeeManagerQuestions[1];
    let employeeDetails;
    //add all employees to the employee and manager questions
    results.forEach((employee) => {
      employeeDetails = `${employee.name} (${employee.title})`;
      employeeQuestion.choices.push({
        value: employee.id,
        name: employeeDetails,
      });
      managerQuestion.choices.push({
        value: employee.id,
        name: employeeDetails,
      });
    });
    //add a null choice to manager question
    managerQuestion.choices.push({
      name: "None",
      value: null,
    });
    //run update employee manager questions and update the manager
    inquirer.prompt(updateEmployeeManagerQuestions).then((answer) => {
      db.update_employee_manager_query(answer).then((results) => {
        console.log(`${employeeDetails} manager was updated!`);
        //call menu questions
        runMenuQuestions();
      });
    });
  });
};

const view_employees_manager = () => {
  // get all  managers
  db.get_manager().then((results) => {
    const managerQuestion = employeebyManager[0];
    //add all managers to the manager question
    results.forEach((manager) => {
      const employeeDetails = `${manager.name} (${manager.department})`;
      managerQuestion.choices.push({
        value: manager.id,
        name: employeeDetails,
      });
    });
    //run employee manager questions and show all the employees by manager
    inquirer.prompt(employeebyManager).then((answer) => {
      db.get_employee_by_manager(answer).then((results) => {
        console.table(results);
        //call menu questions
        runMenuQuestions();
      });
    });
  });
};

const view_employee_department = () => {
  // get all departments
  db.get_departments().then((results) => {
    const departmentQuestion = employeebyDepartment[0];
    //add all departments to the department question
    results.forEach((department) => {
      departmentQuestion.choices.push({
        value: department.id,
        name: department.name,
      });
    });
    //run employee by department questions and show all the department employees
    inquirer.prompt(employeebyDepartment).then((answer) => {
      db.get_employee_by_department(answer).then((results) => {
        console.table(results);
        //call menu questions
        runMenuQuestions();
      });
    });
  });
};
//-----Delete Department ------//
const delete_department = () => {
  // get all departments
  db.get_departments().then((results) => {
    const deleteDepartmentQuestion = deleteDepartment[0];
    let departmentName;
    //add all departments to the department question
    results.forEach((department) => {
      departmentName = department.name;
      deleteDepartmentQuestion.choices.push({
        value: department.id,
        name: departmentName,
      });
    });
    //run delete department questions and delete the department
    inquirer.prompt(deleteDepartment).then((answer) => {
      db.delete_department_query(answer).then((results) => {
        console.log("\n", results, "\n");
        console.log(`${departmentName} Department deleted successfully`);
        //call menu questions
        runMenuQuestions();
      });
    });
  });
};
//-----Delete Role-----//
const delete_role = () => {
  db.get_roles().then((results) => {
    // get all roles
    const deleteRoleQuestion = deleteRole[0];
    let roleTitle;
    //add all roles to the roles question
    results.forEach((role) => {
      roleTitle = role.title;
      deleteRoleQuestion.choices.push({
        value: role.id,
        name: roleTitle,
      });
    });
    //run delete role questions and delete the role
    inquirer.prompt(deleteRole).then((answer) => {
      db.delete_role_query(answer).then((results) => {
        console.log("\n", results, "\n");
        console.log("Role deleted successfully");
        //call menu questions
        runMenuQuestions();
      });
    });
  });
};
//-----Delete Employee-----//
const delete_employee = () => {
  db.get_employees().then((results) => {
    // get all roles
    const deleteEmployeeQuestion = deleteEmployee[0];
    let employeeDetails;
    //add all roles to the roles question
    results.forEach((employee) => {
      employeeDetails = `${employee.name} (${employee.title})`;
      deleteEmployeeQuestion.choices.push({
        value: employee.id,
        name: employeeDetails,
      });
    });
    //run delete role questions and delete the role
    inquirer.prompt(deleteEmployee).then((answer) => {
      db.delete_employee_query(answer).then((results) => {
        console.log("\n", results, "\n");
        console.log(`Employee ${employeeDetails} deleted successfully`);
        //call menu questions
        runMenuQuestions();
      });
    });
  });
};

//------Total Budget of a Department-------//
const department_budget = () => {
  //get all departments
  db.get_departments().then((results) => {
    const departmentBudgetQuestion = departmentBudget[0];
    //add all departments to department budget question
    results.forEach((department) => {
      departmentBudgetQuestion.choices.push({
        value: department.id,
        name: department.name,
      });
    });
    //run department budget questions and sum all the salaries in that department
    inquirer.prompt(departmentBudget).then((answer) => {
      db.department_budget_query(answer).then((results) => {
        console.table(results);
        //call menu questions
        runMenuQuestions();
      });
    });
  });
};
// -----Update Role Salary -----//
const update_role_salary = () => {
  //get all roles
  db.get_roles().then((results) => {
    const roleSalaryQuestion = updateRoleSalary[0];
    //add all roles to update role salary question
    results.forEach((role) => {
      roleSalaryQuestion.choices.push({
        value: role.id,
        name: role.title,
      });
    });
    inquirer.prompt(updateRoleSalary).then((answer) => {
      db.update_role_salary_query(answer).then((results) => {
        console.log("\n", results, "\n");
      });
    });
  });
};

runMenuQuestions();

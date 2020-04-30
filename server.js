var mysql = require("mysql");
var inquirer = require('inquirer')

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "12345678",
    database: "tracker_db"
    
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    startFunction();

});

function startFunction(){
    inquirer.prompt({
        name: 'choice',
        type: 'rawlist',
        message: 'Choose one of the options below.',
        choices: [
            'View All Employees',
            'View all Employees by Department',
            'View Employees by Manager',
            'View Departments',
            'View Employee Roles',
            'Add Department',
            'Delete Department',
            'Add Role',
            'Delete Role',
            'Add Employee',
            'Delete Employee'

        ]
    }).then(function(answer){
        console.log(answer.choice);
        if(answer.choice === 'View All Employees'){
            viewAllEmployee();
        }else if(answer.choice === 'View all Employees by Department'){
            viewByDepartment();
        }else if (answer.choice === 'View Employees by Manager'){
            viewByManager();
        }else if(answer.choice === 'View Departments'){
            viewDepartments();
        }else if(answer.choice === 'View Employee Roles'){
            viewEmployeeRoles();
        }else if (answer.choice === 'Add Department'){
            departmentAdd();
        }else if (answer.choice === 'Delete Department'){
            departmentDelete();
        }else if (answer.choice === 'Add Role'){
            roleAdd();
        }else if (answer.choice === 'Delete Role'){
            roleDelete();
        }else if (answer.choice === 'Add Employee'){
            employeeAdd();
        }else if (answer.choice === 'Delete Employee'){
            employeeDelete();
        }
    })
}

function viewAllEmployee(){
    var query = `select employee.id, employee.last_name, employee.first_name, role.title, department.name as department, role.salary, 
    concat(manager.first_name, ' ', manager.last_name) as manager from employee left join role on employee.role_id = role.id 
    left join department on role.department_id = department.id left join employee manager on manager.id = employee.manager_id`;
    connection.query(query, function(err, res){
        if (err) throw err;
        console.log('All Employees');
        console.table(res);
        startFunction();
    })
};

function viewByDepartment(){
    connection.query('SELECT * FROM department', function (req, res){
    inquirer.prompt({
        name: 'department',
        type: 'list',
        message: 'What department would you like to view?',
        choices: res.map(choice => ({name: choice.name, value: choice.id}))
    }).then(function(answer){
        console.log(`${answer.department}`);
        var query = `select employee.id, concat(employee.first_name, " ", employee.last_name) as FullName, department.name as department from employee
        left join role on employee.role_id = role.id left join department on role.department_id = department.id
        where department.id = '${answer.department}'`;
        connection.query(query, function(err, res){
            if (err) throw err;
            console.log('All Employees');
            console.table(res);
            startFunction();
        })
    })
})
}

function viewByManager(){
    connection.query(`select concat(manager.first_name, ' ', manager.last_name) as Manager, manager.id from employee inner join employee manager on employee.manager_id = manager.id`, function(err, res) {
        inquirer.prompt({
            name: 'manager_id',
            type: 'list',
            message: "Who's employees would you like to see?",
            choices: res.map(choice => ({name: choice.Manager, value: choice.id}))
        }).then(function(answer){
            var query = `select employee.id, concat(first_name, ' ', last_name) as FullName, role.title
            from employee inner join role on employee.role_id = role.id
            where employee.manager_id = ${answer.manager_id} group by employee.id`;
            connection.query(query, function(err, res){
                if(err) throw err;
                console.log('Employees by Manager')
                console.table(res);
                startFunction();
            })
        })
    })
};

function viewDepartments(){
    var query = 'select * from department';
    connection.query(query, function(err, res){
        if(err) throw err;
        console.log('All Departments')
        console.table(res);
        startFunction();
    })
}

function viewEmployeeRoles(){
    var query = 'select * from role';
    connection.query(query, function(err, res){
        if(err) throw err;
        console.log('All Employee Roles')
        console.table(res);
        startFunction();
    })
}

function departmentAdd(){
    inquirer.prompt({
        name: 'departmentAdd',
        type: 'input',
        message: 'What is the name of the department you wish to add?'
    }).then(function(answer){
        connection.query(`insert into department (name) value ('${answer.departmentAdd}')`, function (err, res){
            if(err) throw err;
        console.log(`${answer.departmentAdd} has been added to the Department Table.`);
        startFunction();
    })
}).then(function (){
    var query = 'select * from department';
    connection.query(query, function(err, res){
        if(err) throw err;
        console.log('All Departments')
        console.table(res);
        startFunction();
})
})
}

function departmentDelete(){
    connection.query('select name, id from department', function (err, res){
        const departmentList = res.map(department => {
            return{
                name: department.name,
                value: department.id
            }
        })
        inquirer.prompt({
            name: 'deleteDepartment',
            type:'list',
            message: 'What department is going to be removed?',
            choices: departmentList
        }).then(function(answer){
            const deleteDep = departmentList.filter(depo => depo.value === answer.deleteDepartment);
            console.log(deleteDep);
            var query = `delete from department where id = '${answer.deleteDepartment}'`;
            connection.query(query, function(err, res){
                if(err) throw err;
                console.log(`${deleteDep[0].name} has been removed to the Department Table.`)
                startFunction();
            }) 
        })
    })
}

function roleAdd(){
    connection.query('SELECT * FROM department', function (req, res){
        inquirer.prompt([{
            name: 'roleAdd',
            type: 'input',
            message: 'What is the name of the role you wish to add?'
        },{
            name: 'roleSalary',
            type: 'input',
            message: 'How much should this position make?'
        },{
            message: 'What department should this role be added too?',
            name: 'roleId',
            type: 'list',
            choices: res.map(choice => ({name: choice.name, value: choice.id}))
        }]).then(function(answer){
            connection.query(`insert into role (title, salary, department_id) values ('${answer.roleAdd}', ${answer.roleSalary}, ${answer.roleId})`, function (err, res){
                if(err) throw err;
            console.log(`${answer.roleAdd} has been added to the Role Table.`);
            startFunction();
        })
    })
    })
}


function roleDelete(){
    connection.query('select title, id from role', function (err, res){
        const roleList = res.map(choice => ({name: choice.title, value: choice.id}))
        inquirer.prompt({
            name: 'deleteRole',
            type:'list',
            message: 'What role is going to be removed?',
            choices: roleList
        }).then(function(answer){
            const deleteRoll = roleList.filter(rol => rol.value === answer.deleteRole);
            console.log(deleteRoll);
            var query = `delete from role where id = '${answer.deleteRole}'`;
            connection.query(query, function(err, res){
                if(err) throw err;
                console.log(`${deleteRoll[0].name} has been removed to the Role Table.`)
                startFunction();
            }) 
        })
    })
}

function employeeAdd(){
    connection.query('SELECT CONCAT(first_name, " ", last_name) as Manager, id FROM employee', function(err, res){
        connection.query('SELECT DISTINCT title, id from role', function (err, response){
        inquirer.prompt([{
            name: 'employeeFirst',
            type: 'input',
            message: 'What is the first name of the new employee?'
        },{
            name: 'employeeLast',
            type: 'input',
            message: 'What is the last name of the new employee?'
        },{
            message: "What is the employee's role?",
            type: 'list',
            name: 'employeeRole',
            choices: response.map(choice => ({name: choice.title, value: choice.id})),
        },{
            message: "Who will be the employee's manager?",
            type: 'list',
            name: 'employeeManager',
            choices: res.map(man => ({name: man.Manager , value: man.id})),
            
        }]).then(function(answer){
            connection.query(`insert into employee (first_name, last_name, role_id, manager_id) values ('${answer.employeeFirst}', '${answer.employeeLast}', ${answer.employeeRole}), ${answer.employeeManager}`, function (err, res){
                if(err) throw err;
            console.log(`${answer.employeeFirst} ${answer.employeeLast} has been added to the team!`);
            startFunction();
        })
    })
    })})
    
}

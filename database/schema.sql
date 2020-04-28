drop database if exists tracker_db;

create database tracker_db;

use tracker_db;

create table department(
id int not null auto_increment,
name varchar(30),
primary key(id)
);

insert into department (name) values 
	('Sales'),
	('Engineering'),
    ('Finance'),
    ('Legal');

create table role(
id int not null auto_increment,
title varchar(30),
salary decimal, 
department_id int,
primary key (id),
foreign key (department_id) references department (id)
);

insert into role (title, salary, department_id) values
	('Manager', 150000, 1),
    ('Engineer Lead', 125000, 2),
    ('Software Engineer', 120000, 2),
    ('Sales Specialist', 100000, 1),
    ('Finance Manager', 100000, 3),
    ('Accountant', 80000, 3),
	('Legal Team Lead', 150000, 4),
    ('Lawyer', 130000, 4)
    ;

create table employee(
id int not null auto_increment,
first_name varchar (30),
last_name varchar (30),
role_id int,
manager_id int null,
primary key (id),
foreign key (role_id) references role(id)
);

insert into employee (first_name, last_name, role_id, manager_id) values
	('David', 'Callaway', 1, null),
    ('Dakota', 'Turner', 7, null),
    ('Jackson', 'Hunt', 4, 1),
    ('Garrison', 'Bronson', 8, 2),
    ('Bryan', 'Winter', 2, null),
    ('Adam', 'Conner', 6, 7),
    ('Ashley', 'Daniels', 5, null),
    ('Derek', 'Cruise', 3, 5)
    ;

create table employeeList as
select employee.id, employee.last_name, employee.first_name, employee.manager_id, role.title, role.salary, department.name
from employee
left join role on employee.role_id = role.id
left join department on role.department_id = department.id
order by employee.id;

-- Lists all employees  with their manager at the end
select employee.id, employee.last_name, employee.first_name, role.title, department.name as department, role.salary, concat(manager.first_name, ' ', manager.last_name) as manager
from employee
left join role on employee.role_id = role.id
left join department on role.department_id = department.id
left join employee manager on manager.id = employee.manager_id;

-- Groups by manager  
select employee.id, employee.last_name, employee.first_name, employee.manager_id, role.title, role.salary, role.department_id as Department, concat(m.first_name, ' ', m.last_name) as Manager 
from employee 
left join role on employee.role_id = role.id
inner join department on role.department_id = department_id
inner join employee m on employee.manager_id = m.id where concat(m.first_name, " ", m.last_name) in ('David Callaway', 'Dakota Turner', 'Ashley Daniels', 'Bryan Winter')
group by employee.id;

-- Lists employee and their department
select employee.id, concat(employee.last_name, ", ", employee.first_name) as FullName, department.name as Department
from employee
left join role on employee.role_id = role.id
left join department on role.department_id = department.id


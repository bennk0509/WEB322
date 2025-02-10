const customer = require('./customer.js');

customer.setFullName("Khanh Anh Kiet Nguyen");
customer.setEmail("kaknguyen@senecapolytechnic.ca");
customer.addPhone("123-456-7890");
customer.addPhone("987-654-3210");

console.log("Customer Details:");
console.log("Full Name:", customer.getFullName());
console.log("Email:", customer.getEmail());
console.log("Phones:", customer.getPhones());



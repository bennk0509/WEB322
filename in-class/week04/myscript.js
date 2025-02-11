const customer = require("./customer.js");

customer.setFullName("Khanh Anh Kiet Nguyen");
customer.setEmail("abcdef@gmail.com");
customer.addPhone("123-456-789");
customer.addPhone("789-456-123");

console.log(customer.getFullName());
console.log(customer.getEmail());
console.log(customer.getPhones());
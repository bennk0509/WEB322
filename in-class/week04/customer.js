let fullName = "";
let email = "";
let phones = [];

function getFullName()  {return fullName};
function setFullName(name) {fullName = name;}

function getEmail() {return email;}
function setEmail() {return email;}

function getPhones() {return phones;}
function addPhone(phone) {return phones.push(phone);}

module.exports = {
    getFullName,
    setFullName,
    getEmail,
    setEmail,
    getPhones,
    addPhone
};

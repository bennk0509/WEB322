let fullName = "";
let email = "";
let phones = [];

function getFullName()
{
    return fullName;
}
function setFullName(name)
{
    fullName = name;
}
function getEmail()
{
    return email;
}
function setEmail(em)
{
    email = em;
}
function getPhones()
{
    return phones;
}
function addPhone(phone)
{
    phones.push(phone);
}

module.exports = {
    getFullName,
    setFullName,
    getEmail,
    setEmail,
    getPhones,
    addPhone
}



module.exports.addPhone = (phone) => {phones.push(phonne);}
module.exports.setFullName = (name) => {fullName = name;}
module.exports.getPhones = () => {return phones};
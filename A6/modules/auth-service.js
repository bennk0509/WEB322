require('dotenv').config(); 
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { sendVerificationEmail } = require('./mailer.js');
let Schema = mongoose.Schema;

const userSchema = new Schema({
    userName: {
      type: String,
      unique: true
    },
    password: String,
    email: String,
    loginHistory: [{
      dateTime: Date,
      userAgent: String
    }]
});

let User;

function initialize(){
    return new Promise((resolve,reject) => {
        let db = mongoose.createConnection(process.env.MONGODB_URI);
        db.on('error', (err)=>{
            reject(err);
        });
        db.once('open', ()=>{
           User = db.model("users", userSchema);
           resolve();
        });
    })
}


function registerUser(userData){
    return new Promise((resolve, reject) => {
        if(userData.password != userData.password2)
        {
            return reject("Passwords do not match");
        }
        // Encrypt the password
        bcrypt.hash(userData.password, 10)
            .then( async (hash) => {
            // Replace original password with hashed one
            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
            userData.password = hash;
            delete userData.password2;
            const newUser = new User(userData);
            // newUser.save()
            //     .then(() => resolve())
            //     .catch(err => {
            //     if (err.code === 11000) {
            //         return reject("User Name already taken");
            //     } else {
            //         return reject(`There was an error creating the user: ${err}`);
            //     }
            //     });
            try {
                await newUser.save();
                await sendVerificationEmail(userData.email, verificationCode); // ✅ send email here
                resolve(); // done!
              } catch (err) {
                if (err.code === 11000) {
                  return reject("User Name already taken");
                } else {
                  return reject(`There was an error creating the user: ${err}`);
                }
              }
            }).catch(err => {
                return reject("There was an error encrypting the password");
            });
    })
}

function checkUser(userData) {
    return new Promise((resolve, reject) => {
      User.find({ userName: userData.userName }).exec()
        .then((users) => {
          if (!users || users.length === 0) {
            return reject(`Unable to find user: ${userData.userName}`);
          }
  
          const user = users[0];
  
          // Compare hashed password with plain password
          bcrypt.compare(userData.password, user.password)
            .then((result) => {
              if (!result) {
                return reject(`Incorrect Password for user: ${userData.userName}`);
              }
  
              // Password matched: update login history
              if (user.loginHistory.length >= 8) {
                user.loginHistory.pop();
              }
  
              user.loginHistory.unshift({
                dateTime: new Date().toString(),
                userAgent: userData.userAgent
              });
  
              User.updateOne(
                { userName: user.userName },
                { $set: { loginHistory: user.loginHistory } }
              )
                .then(() => resolve(user))
                .catch(err => {
                  reject(`There was an error verifying the user: ${err}`);
                });
            })
            .catch(err => {
              reject("There was an error comparing passwords");
            });
        })
        .catch(err => {
          reject(`Unable to find user: ${userData.userName}`);
        });
    });
}

module.exports = {
    initialize,
    registerUser,
    checkUser
}
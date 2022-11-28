const mongoose = require("mongoose");
var bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username:{type: String, index:{unique:true}},
    password:{type: String},
    fullname:{type: String},
    address: {type: String, required: true, index:{unique:true}},
    isAdmin:{type: Boolean},
})

userSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
    
});
userSchema.methods.comparePassword = function(candidatePassword) {
    return new Promise((resolve, reject)=>{
        bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
            if (err) return reject(err);
            resolve(isMatch);
        });
    })

};
module.exports = mongoose.model("User",userSchema);
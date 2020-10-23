const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolesValid = {
  values: ['USER_ROLE', 'ADMIN_ROLE'],
  message: '{VALUE} Does not a role valid'
};

let Schema = mongoose.Schema;

let userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'The name is required']
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'the email is required']
  },
  password: {
    type: String,
    required: [true, 'the password is required']    
  },
  img: {
    type: String,
    required: false
  },
  role: {
    type: String,
    default: "USER_ROLE",
    enum: rolesValid,
  },
  state: {
    type: Boolean,
    default: true 
  },
  google: {
    type: Boolean,
    default: false
  }

})

//Sobreescribe metodo toJSON para eliminar el password 
// del user creado
userSchema.methods.toJSON = function () {

  let user = this;
  let userObject = user.toObject();
  delete userObject.password

  return userObject; 
}

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let categorySchema = new Schema({
    name: {
        type: String,
        required: [true, 'The name is required']
    },
    userCreation: {
        type: Schema.ObjectId, 
        ref: "User"
    }

})

module.exports = mongoose.model('Category', categorySchema);
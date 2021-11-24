//requesting mongooose and Schema so the class can be defined
const mongoose = require('mongoose')
const {Schema} = mongoose;

//setting up the Rules for our class using schema 
const filmSchema = new Schema({
    title: String,
    year: Number, 
    director: String,
    isReleased: Boolean
  })
//defining the name of the constructor for our class
const Film = mongoose.model('Film', filmSchema);
//export the class, also called a model or a document, to use in different files
module.exports = Film

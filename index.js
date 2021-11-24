// declaration
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const mongoose = require('mongoose') // require the driver to connect to the database
const Film = require('./film.js')


//make the app use the bodyParser
app.use (bodyParser.urlencoded({extended:false}))

//API ROUTES 
//show all films from the database using GET request
app.get('/film', (req, res) => {
    //find all films in the database and store them in the "result" variable
    //use the Model created in the films.js file to retrieve all film entries from the database
    Film.find((err, films) => {
      //in case there is an error with our film model, we we will send it to the user(postman)
      if (err) {
        res.status(404).send("Error occured no films retrieved")
        return
      }
      //if no error send the array conting films to the user/postman
      res.send(films)
      //log the result in the console as well
      console.log(films)
    })
  })
  // FIND ONE BY ID, using a GET REQUEST and A PARAMETER (id)
  app.get('/film/:id', (req, res) => {
    const id = req.params.id;
    // we use the findById query, details on https://mongoosejs.com/docs/queries.html
    // this query only returns one element
    // you can also use findOneById
    // you can also use findOne({_id:req.paramas.id}) - this query will find depending on other properties,
    //                                    e.g. breed, name
    //                                    will only return first element found
    // to return more then 1 element use find({}) // see previous request
    Film.findById(id, (err, film) => {
      if (err) {
        res.status(404).send("Film not found")
        return
      }
      //"film" is an object file retrieved from the database
      //"film" will only be defined if there is a film with the specific id
      // inside the Database
      // for a wrong ID, "film" will be undefined
  
      //we will send it back to the user/postman
      res.status(403).send(film)
      console.log(film)
    })
  })
  
  //insert request using POST to add a film into the database
  app.post('/film', (req, res) => {
    console.log("Inserting a film in the database")
    //inser the film into the database
    // film.save() // insert the fim into the database
  
    let isReleased = false;
    if (req.body.isReleased === 'true') {
        isReleased = true;
    }
    let film = new Film({
      
      title: req.body.title, //String
      year: parseInt(req.body.year), //Number
      director: req.body.director || "No director inserted", //String
      isReleased: isReleased //Boolean
    });
    //inserting a film and checking to see if any errors occured
    film.save(err => {
      if (err) {
        // if error send a message to let the user know
        res.status(404).send(`Film not inserted into the database, error is: ${err}`)
        //return to be used in order to not send to res.send and crash the program
        return
      }
      //send a message to the user with the result
      res.status(403).send("Film inserted into the database")
      console.log("Film is in the database")
    })
  
    //if return runs, code will start from here
    return
  })
  // -->
  // PUT request to update or modify one film from the database
  app.put('/film/:id', (req, res) => {
    // you can use fineOneAndUpdate() see https://mongoosejs.com/docs/api.html#model_Model.findOneAndUpdate
    // or
    // you can use findByIdAndUpdate() see https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate
    // You can use req.params.id to send the _id and req.body for your new variables
    // or you can send all variables, including id, in req.body
    console.log("Trying to edit film")
    console.log(parseInt(req.body.year))
  
  
    Film.findByIdAndUpdate(req.params.id, {
      
      title: req.body.title,
      year: ((parseInt(req.body.year) == NaN) ? 0 : parseInt(req.body.year)),
      director: req.body.director,
      isReleased: (req.body.isReleased === 'true')
    }, err => {
      if (err) {
        res.status(404).send("It didn't edit. The error is: " + err)
        return;
      }
      res.status(403).send("It did edit")
    })
  })
  
  
  //delete request using DELETE and a PARAMETER (id)
  app.delete('/film/:id', (req, res) => {
  
    // You can use findOneAndDelete({_id:})
    // or
    // You can use findByIdAndDelete(id)
    //see https://mongoosejs.com/docs/api.html#model_Model.findByIdAndDelete
    Film.findByIdAndDelete(req.params.id, err => {
      if (err) {
        res.status(404).send("Film did not delete. Check is id correct")
        return
      }
      res.status(403).send("Film successfully deleted")
      console.log(`Film with id ${req.params.id} is now deleted`)
      // console.log("film with id "+req.params.id + "is now deleted")
    })
  })
  
  //start the server
  app.listen(port, () => {
    //change the link to your database
    mongoose.connect(
      'mongodb+srv://admin:admin@cluster0.6zai5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority').
    catch(error => console.log(error));
    console.log(`Example app listening at http://localhost:${port}`)
  })
  
  
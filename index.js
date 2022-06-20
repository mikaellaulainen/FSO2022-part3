require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors=require('cors')
const app= express()
app.use(express.json())
app.use(cors())
app.use(morgan('tiny'))
app.use(express.static('build'))
const Person=require('./models/person')

//all persons
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons=> {
      response.json(persons)
  })
})

//add person
app.post('/api/persons', (request,response,next) => {
  const body = request.body

  if (!body.name){
    return response.status(400).json({
      error: 'Name missing'
    })
  }
  if (!body.number){
    return response.status(400).json({
      error: 'Number missing'
    })
  }
  const person = new Person({
    name : body.name,
    number : body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
    })
    .catch(error => { next(error)})
})


//Date info and amount of persons
app.get('/info', (req,res) => {
  const dateInfo= new Date()
  Person.countDocuments(function(err,count){
    if (err){
      console.log(err)
    } else{
      res.send(`
      <p>Phonebook has info for ${count} people</p>
      <p>${dateInfo}</p>
  
      `)
    }
  })
})

// get person by id 
app.get('/api/persons/:id', (request,response,next) =>{
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      next(error)
    })
})
//remove person
app.delete('/api/persons/:id',(request,response,next) =>{
  Person.findByIdAndRemove(request.params.id)
  .then(result => {
    response.status(204).end()
  })
  .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)



const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
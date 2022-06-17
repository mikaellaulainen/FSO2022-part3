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
app.post('/api/persons', (request,response) => {
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
})


//Date info and amount of persons
app.get('/info', (req,res) => {
    const dateInfo= new Date()
    res.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${dateInfo}</p>
    
    `)
})
// get person by id 
app.get('/api/persons/:id', (request,response) =>{
    const id= Number(request.params.id)

    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    }else{
        response.status(404).end()
    }
})
//remove person
app.delete('/api/persons/:id',(request,response) =>{
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})



const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
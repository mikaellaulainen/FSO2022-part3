const express = require('express')
const morgan = require('morgan')
const cors=require('cors')
const app= express()

let persons= [
        { 
          "name": "Arto Hellas", 
          "number": "040-123456",
          "id": 1
        },
        { 
          "name": "Ada Lovelace", 
          "number": "39-44-5323523",
          "id": 2
        },
        { 
          "name": "Dan Abramov", 
          "number": "12-43-234345",
          "id": 3
        },
        { 
          "name": "Mary Poppendieck", 
          "number": "39-23-6423122",
          "id": 4
        }
]

app.use(express.json())
app.use(cors())
app.use(morgan('tiny'))
app.use(express.static('build'))


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
  if (persons.some(person => person["name"].toLowerCase() === body.name.toLowerCase())){
    return response.status(400).json({
      error: 'Name must be unique'
    })
  }
  const person = {
    name : body.name,
    number : body.number,
    id : Math.floor(Math.random()*1000)
  }
  console.log(person)

  persons= persons.concat(person)
  
  response.json(person)
})
//all persons
app.get('/api/persons', (req,res) => {
    res.json(persons)
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



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
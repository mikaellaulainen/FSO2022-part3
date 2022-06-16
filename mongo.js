const mongoose = require('mongoose')

if (process.argv<3) {
    console.log('Give password as argument')
    process.exit(1)
}

const password= process.argv[2]

const url= `mongodb+srv://admin:${password}@cluster0.wtewr.mongodb.net/persons?retryWrites=true&w=majority`

mongoose.connect(url)

const personShema= new mongoose.Schema({
    name: String,
    number: String,
    id:Number,
})

const Person = mongoose.model("Person", personShema)


if(process.argv.length == 3){
    console.log('Phonebook:')
    Person.find({}).then(result=> {
        result.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
        process.exit(1)
    })
} 
if(process.argv.length == 5){
    const person= new Person({
        name : process.argv[3],
        number: process.argv[4],
        id : Math.floor(Math.random() * 10000)
    })

    person.save().then(result => {
        console.log(`Added ${person.name} number ${person.number} to phonebook`)
        mongoose.connection.close()
    })
}

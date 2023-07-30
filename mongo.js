const mongoose = require('mongoose')

const url = `mongodb+srv://fullstack:${process.argv[2]}@testcluster.wesht2j.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const perSchm = new mongoose.Schema({
    name:String,
    number:Number,
})
const Person = mongoose.model("Person", perSchm)

if (process.argv.length === 3) {
    Person.find({}).then(r => {
        r.forEach(p => {
            console.log(`${p.name} ${p.number}`)
        })
    mongoose.connection.close()
    })
    return
}

const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
})

person.save().then(r => {
    console.log(`added ${r.name} number ${r.number} to phonebook`)
    mongoose.connection.close()
})
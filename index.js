require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :contents'))
app.use(cors())


morgan.token('contents', (req) => JSON.stringify(req.body))

const Person = require('./models/person')

app.get('/api/persons', (req, res, next) => {
  Person.find({}).then(rpersons => {
    res.json(rpersons)
  })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id).then(rperson => {
    if (rperson) {res.json(rperson)}
    else {res.status(404).end()}
  })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body

  const person = new Person({
    name: name,
    number: number,
  })

  person.save().then(rPerson => {
    res.json(rPerson)
  })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id).then(() => {
    res.status(204).end()
  })
    .catch(error => next(error))

})

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body

  const person = {
    name: name,
    number: number,
  }

  Person.findByIdAndUpdate(req.params.id, person,
    { new:true, runValidators:true, context: 'query' })
    .then(rPerson => {
      res.json(rPerson)
    })
    .catch(error => next(error))
})

app.get('/info', (req, res) => {
  Person.count().then(rCount => {
    res.send(`<p>Phonebook has info for ${rCount} people <br/> ${Date()}</p>`)
  })
})


const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)


const errorHandler = (error, req, res, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  console.log(error)
  next(error)
}
app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {console.log('server is running')})
/* eslint-disable react/react-in-jsx-scope */
import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import AddForm from './components/AddForm'
import Contents from './components/Contents'
import Notification from './components/Notification'
import Error from './components/Error'
import perService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setNewFilter] = useState('')
  const [notMessage, setNotMessage] = useState(null)
  const [errorMessage, setErrorMessgae] = useState(null)

  useEffect(() => {
    perService
      .getPersons()
      .then(rPersons => {
        setPersons(rPersons)
      })
  }, [])

  const addName = (event) => {
    event.preventDefault()

    const person = {
      name: newName,
      number: newNumber
    }

    if (persons.some(element => element.name === newName)) {
      if (window.confirm(`Do you want to replace the number of ${newName} number with a new one?`)) {
        person.id = persons.find(element => element.name === newName).id
        editNumber(person)
      }

    } else {

      perService
        .addPerson(person)
        .then(rPerson => {
          setPersons(persons.concat(rPerson))
          displayNotification(`Added ${person.name}`)
        })
        .catch(error => {
          console.log(error.response)
          displayError(error.response.data.error)
        })
    }

    setNewName('')
    setNewNumber('')
  }

  const editNumber = person => {
    perService
      .replaceNumber(person)
      .then(rPerson => {
        setPersons(persons.map(p => p.id === person.id ? rPerson : p))
        displayNotification(`Updated ${person.name}'s number`)
      })
      .catch(() => {
        displayError(`Information of ${person.name} has already been removed from server`)
        setPersons(persons.filter(p => p.id !== person.id))
      })
  }


  const namesToShow = persons.filter(person =>
    person.name.toLowerCase().includes(
      filter.toLowerCase()
    )
  )

  const filterNames = (event) => {
    setNewFilter(event.target.value)
  }

  const deleteName = (event, id, name) => {
    event.preventDefault()

    if (!window.confirm(`Delete ${name}`)) {return}

    perService.deletePerson(id)
    setPersons(persons.filter(person => person.id !== id))
    displayNotification(`Deleted ${name}`)
  }

  const displayNotification = msg => {
    setNotMessage(msg)
    setTimeout(() => {
      setNotMessage(null)
    }, 3000)
  }

  const displayError = msg => {
    setErrorMessgae(msg)
    setTimeout (() => {
      setErrorMessgae(null)
    }, 5000)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification msg = {notMessage}/>
      <Error msg = {errorMessage} />
      <Filter filter={filter} filterNames={filterNames} />
      <h3>Add person</h3>
      <AddForm addName={addName} newName={newName} setNewName={setNewName} newNumber={newNumber} setNewNumber={setNewNumber} />
      <h3>Numbers</h3>
      <Contents namesToShow={namesToShow} deleteName={deleteName}/>
    </div>
  )
}

export default App
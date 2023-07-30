const Contents = ( { namesToShow, deleteName } ) => (
  <ul>
    {namesToShow.map(person =>
      <li key={person.id}>{person.name} {person.number}
        <button onClick={(event) => deleteName(event, person.id, person.name)}> delete</button>
      </li>
    )}
  </ul>
)

export default Contents
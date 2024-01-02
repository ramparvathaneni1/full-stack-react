import ListItem from "./ListItem";
import { useState, useEffect } from "react";

function MyList() {
  const [toDoItemArray, setToDoItemArray] = useState([]);
  const [newItem, setNewItem] = useState("");

  const todoItems = toDoItemArray.map((item) => (
    <ListItem {...item} key={item.id} />
  ));

  // We declare a named function called getTodos()
  // because an fetch and .json are asynchronous.
  // You can put all of this inside useEffect if you want
  async function getTodos() {
    const response = await fetch("http://127.0.0.1:3001/api/todos");
    const todos = await response.json();
    console.log("Todos from database", todos);

    setToDoItemArray(todos);
  }

  // Inside the [], tell useEffect to update
  // only when a particular value changes
  // React will do an infinite update if you do not
  // supply an empty dependencies array
  useEffect(() => {
    getTodos();
  }, []);

  return (
    <div>
      <h1>Things I should stop procrastinating:</h1>
      <ul>{todoItems}</ul>
      {newItem}
      <form>
        <input
          type="text"
          placeholder="Type an item here"
          onChange={(e) => setNewItem(e.target.value)}
          value={newItem}
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            setToDoItemArray([...toDoItemArray, newItem]);
            setNewItem("");
          }}
        >
          Add it!
        </button>
      </form>
      <button
        onClick={() => {
          console.log("Clearing list!");
          setToDoItemArray([]);
        }}
      >
        Finished the list!
      </button>
    </div>
  );
}

export default MyList;

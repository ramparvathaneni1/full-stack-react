import ListItem from "./ListItem";
import { useState, useEffect } from "react";

function MyList() {
  const [toDoItemArray, setToDoItemArray] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [doneItemArray, setDoneItems] = useState([]);
  const [allToDos, ]

  // Todo item 1: Render todo items
  const todoItems = toDoItemArray.map((item) => (
    <ListItem
      {...item}
      key={item.id}
      handleDeleteTodo={deleteTodo}
      handleUpdateTodo={updateTodo}
    />
  ));

  const doneItems = doneItemArray.map((item) => (
    <ListItem
      {...item}
      key={item.id}
      handleDeleteTodo={deleteTodo}
      handleUpdateTodo={updateTodo}
    />
  ));

  // Todo item 2: Fetch todos from API
  async function getTodos() {
    const response = await fetch("http://127.0.0.1:3001/api/todos");
    const allToDos = await response.json();
    console.log("Todos from database", allToDos);

    const doneList = [];
    const todoList = [];
    allToDos.forEach(item => item.done ? doneList.push(item) : todoList.push(item));

    setToDoItemArray(todoList);
    setDoneItems(doneList);
  }

  // Todo item 3: Use effect to fetch todos on component mount
  useEffect(() => {
    console.log("calling useEffect");
    getTodos();
  }, []);

  // Todo item 4: Form to add new todo
  function renderForm() {
    return (
      <form onSubmit={createTodo}>
        <input
          type="text"
          placeholder="Type an item here"
          onChange={(e) => setNewItem(e.target.value)}
          value={newItem}
        />
        <button type="submit">Add it!</button>
      </form>
    );
  }

  // Todo item 5: Create a new todo item
  async function createTodo(e) {
    e.preventDefault();

    const newItemForDatabase = {
      title: newItem,
      done: false,
    };

    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newItemForDatabase),
    };

    try {
      const response = await fetch(`http://127.0.0.1:3001/api/todos`, options);
      const data = await response.json();
      console.log("newTodo with ID", data);
      setToDoItemArray([...toDoItemArray, data]);
      setNewItem("");
    } catch (error) {
      console.log(error);
    }
  }

  // Todo item 6: Delete a todo item
  async function deleteTodo(e, id) {
    e.preventDefault();
    const options = {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    try {
      const response = await fetch(
        `http://127.0.0.1:3001/api/todos/${id}`,
        options
      );
      let newToDoItemArray = [...toDoItemArray];
      let itemToDelete = newToDoItemArray.findIndex((item) => item.id === id);
      newToDoItemArray.splice(itemToDelete, 1);
      setToDoItemArray(newToDoItemArray);
    } catch (error) {
      console.log(error);
    }
  }

  // Todo item 7: Update a todo item
  async function updateTodo(e, id) {
    e.preventDefault();
    let indexOfItem = toDoItemArray.findIndex((item) => item.id === id);
    let itemToUpdate = { ...toDoItemArray[indexOfItem] };
    itemToUpdate.done = !itemToUpdate.done;

    const options = {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(itemToUpdate),
    };
    try {
      const response = await fetch(
        `http://127.0.0.1:3001/api/todos/${id}`,
        options
      );
      const newToDoItemArray = [...toDoItemArray];
      newToDoItemArray[indexOfItem] = itemToUpdate;
      setToDoItemArray(newToDoItemArray);
    } catch (error) {
      console.log(error);
    }
  }

  // Rendering the component UI
  return (
    <div>
      <h1>Things I should stop procrastinating:</h1>
      <ul>{todoItems}</ul>
      {renderForm()}
      <button onClick={() => setToDoItemArray([])}>Finished the list!</button>
      <hr/>
      <h2>Things already DONE:</h2>
      <ul>{doneItems}</ul>
    </div>
  );
}

export default MyList;

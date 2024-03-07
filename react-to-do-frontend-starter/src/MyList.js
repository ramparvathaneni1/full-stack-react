import ListItem from "./ListItem";
import { useState, useEffect } from "react";

function MyList() {
    const [toDoItemArray, setToDoItemArray] = useState([]);
    const [newItem, setNewItem] = useState("");

    // Todo item 1: Render todo items
    const todoItems = toDoItemArray.map((item) => (
        <ListItem
            {...item}
            key={item.id}
            handleDeleteTodo={deleteTodo}
            handleUpdateTodo={updateTodo}
        />
    ));

    // Todo item 2: Fetch todos from API
    async function getTodos() {
       
    }

    // Todo item 3: Use effect to fetch todos on component mount
    useEffect(() => {
        console.log("calling useEffect")
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
    }

    // Todo item 6: Delete a todo item
    async function deleteTodo(e, id) {
        e.preventDefault();
    }

    // Todo item 7: Update a todo item
    async function updateTodo(e, id) {
        e.preventDefault();
    }

    // Rendering the component UI
    return (
        <div>
            <h1>Things I should stop procrastinating:</h1>
            <ul>{todoItems}</ul>
            {renderForm()}
            <button onClick={() => setToDoItemArray([])}>Finished the list!</button>
        </div>
    );
}

export default MyList;
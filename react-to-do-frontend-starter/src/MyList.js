import ListItem from "./ListItem";
import {useState, useEffect} from "react";

function MyList() {
    const [toDoItemArray, setToDoItemArray] = useState([]);
    const [newItem, setNewItem] = useState("");

    const todoItems = toDoItemArray.map((item) => (
        <ListItem {...item} key={item.id} handleDeleteTodo={deleteTodo}/>
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
                <button onClick={createTodo}>
                    Add it!
                </button>
            </form>
            <button
                onClick={() => {
                    setToDoItemArray([]);
                }}
            >
                Finished the list!
            </button>
        </div>
    );

    async function createTodo(e) {
        e.preventDefault();

        let newItemForDatabase = {
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
            console.log("newTodo With ID", data);
            setToDoItemArray([...toDoItemArray, data]);
            setNewItem("");
        } catch (error) {
            console.log(error);
        }
    }

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
}

export default MyList;

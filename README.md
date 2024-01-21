# Connect React frontend to Express API backend

## Start up your Node Express Backend

1. Open your terminal.
2. To access the `mef` directory, please navigate to it from your home directory using the command `cd ~/mef`.
3. Fork the repository named [full-stack-react](https://git.generalassemb.ly/ModernEngineering/full-stack-react) on the
   GitHub website.
4. Click the "Fork" button in the upper right corner of the repository page. This will create a copy of the repository
   under your own GitHub account.
5. After forking, you'll have your own copy of the repository under your GitHub account.
    - Copy the URL of your forked repository, which will look
      like: `https://github.com/YourUsername/full-stack-react.git`.
6. Now clone the repository using the SSH URL.
7. To change your current working directory to `express-todo-api` within the cloned `full-stack-react` repository, you
   can use the following commands: `cd full-stack-react/express-todo-api/`.
8. To reset the existing database using the `psql` command, you can use the following
   command: `psql -U postgres -d todo_app_db < db/todo.sql`.
9. To add dependencies to our project, use the `npm install` command followed by the package names you want to install.
   In our case, `npm i cors express pg nodemon`.
10. To open the express-todo-api project in VSCode, use the command `code .`. After opening the project, you can initiate the server by opening the VS Code terminal and executing the command `npm run start`. The server is set up to listen on port `3001`.

NOTE: If you get a message that a port is in use, you can kill it with this
command: `sudo kill -9 $(sudo lsof -t -i:3000)`.

- Replace `3000` with the port number you want to stop.
- [Reference](https://tecadmin.net/kill-process-on-specific-port/)

## Postman Review

Let's open the Postman Collection that is provided (or that you built in class) to review the 5 API Todo endpoints.

1. Open Postman: Run `/opt/Postman/app/Postman` in the terminal
2. The collection should already be available in Postman. If it's not, you can select "Import" then locate the
   `todo_app.postman_collection.json` file in the `express-to-do-api` folder.

Once we've reviewed and confirmed that the backend is functioning correctly, we can shift our attention to the React
frontend.

## Setting up React Frontend Application

To begin running the React frontend application, please open a new terminal window and navigate to the full-stack-react
folder, which you cloned earlier.

1. `cd ~/mef/full-stack-react/react-to-do-frontend-starter/`.
2. Now, open the terminal window within VSCode and execute the following commands:
    - Run `npm i` to install the necessary Node.js dependencies.
    - After the dependencies are installed, start the React frontend application with: `npm run start`.
3. This will launch the development server for your React frontend application and should open it in your default web
   browser.

## Get all Todos

#### GET TODOS - `http://127.0.0.1:3001/api/todos`

1. We'll need to make a `fetch` request to hit our backend endpoint to get all the todos.

   `MyList.js` - (this should be in the starter code)

   ```js
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
   ```

1. `ListItem.js` (this should be in the starter code)

   ```js
   const ListItem = ({ title, done, id }) => {
     return (
       <>
         <li>
           {title}
           <input type="checkbox" defaultChecked={done} />
         </li>
       </>
     );
   };
   export default ListItem;
   ```

- Import `useEffect`
- Make an API call to the Express Backend
- Update our `ListItem` component

<br>

## Create a Todo

#### POST TODOS - `http://127.0.0.1:3001/api/todos`

1. First, in `MyList.js`, we'll create an `async` function named `createTodo`. We will move some of the code from the
   button element to this function.

   `MyList.js`

   ```jsx
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
   ```

1. Next, in `MyList`, we'll update the button in our `return` method to call the function.

   `MyList.js`

   ```jsx
       // Replace the logic in this button...

           <button
             onClick={(e) => {
               e.preventDefault();
               setToDoItemArray([...toDoItemArray, newItem]);
               setNewItem("");
             }}
           >
             Add it!
           </button>

       // With this version of the button

           <button onClick={createTodo}>
               Add it!
           </button>
   ```

1. In `ListItem`, we'll pass in the `done` and `id` as props.

   ```jsx
   const ListItem = ({ title, done, id }) => {
     return (
       <>
         <li>
           {title}
           <input type="checkbox" defaultChecked={done} />
         </li>
       </>
     );
   };
   export default ListItem;
   ```

1. For reference, our Express backend `index.js` POST route should look like this:

   ```js
   app.post("/api/todos", (request, response) => {
     const { title, done } = request.body;
     console.log("request.body", request.body);

     pool.query(
       "INSERT INTO todos (title, done) VALUES ($1, $2) RETURNING *",
       [title, done],
       (error, results) => {
         if (error) throw error;
         console.log(results);
         response.status(201).json(results.rows[0]);
       }
     );
   });
   ```

<br>

## DELETE Todo

#### DELETE a Todo - DELETE `http://127.0.0.1:3001/api/todos/:id`

1. In `MyList.js`, update the `todoItems` array to pass a `handleDeleteTodo` prop to the `ListItem` component containing
   a `deleteTodo` event handler.

   ```js
   const todoItems = toDoItemArray.map((item, index) => (
     <ListItem {...item} key={index} handleDeleteTodo={deleteTodo} />
   ));
   ```

1. Next, we'll create the `deleteTodo` event handler.

   ```js
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
   ```

1. `ListItem.js`

   ```js
   const ListItem = ({ title, done, id, handleDeleteTodo }) => {
     return (
       <>
         <li>
           {title}
           <input type="checkbox" defaultChecked={done} />
           <button onClick={(e) => handleDeleteTodo(e, id)}>X</button>
         </li>
       </>
     );
   };

   export default ListItem;
   ```

<br>

## Update Todo as DONE

[Replacing Items in An Array](https://react.dev/learn/updating-arrays-in-state#replacing-items-in-an-array)

#### Update a Todo - PUT `http://127.0.0.1:3001/api/todos/:id`

1. `MyList.js` - add a `handleUpdateTodo` prop to the `ListItem` component.

   ```js
   const todoItems = toDoItemArray.map((item) => (
     <ListItem
       {...item}
       key={item.id}
       handleDeleteTodo={deleteTodo}
       handleUpdateTodo={updateTodo}
     />
   ));
   ```

1. `MyList.js` - build an `updateTodo` event handler.

   ```js
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
   ```

1. `ListItem.js`

   ```js
   const ListItem = ({
     title,
     done,
     id,
     handleDeleteTodo,
     handleUpdateTodo,
   }) => {
     return (
       <>
         <li>
           {title}
           <input
             type="checkbox"
             //   defaultChecked={done}
             checked={done ? "checked" : ""}
             onChange={(e) => handleUpdateTodo(e, id)}
           />
           <button onClick={(e) => handleDeleteTodo(e, id)}>X</button>
         </li>
       </>
     );
   };

   export default ListItem;
   ```

1. For reference, this is what our Express backend PUT route should be in `index.js`.

   ```js
   app.put("/api/todos/:id", (request, response) => {
     const id = parseInt(request.params.id);
     const { title, done } = request.body;

     pool.query(
       "UPDATE todos SET title = $1, done = $2 WHERE id = $3",
       [title, done, id],
       (error, results) => {
         if (error) throw error;
         response.status(200).json({ message: `Todo modified with ID: ${id}` });
       }
     );
   });
   ```

<br>

## Bonuses - YOU DO

- Filter Todos into 2 sections: complete and todo
- Implement the Finished the List! button to clear out all Todos
- Add the ability to update the title of a todo (you could add logic to make the `title` input field clickable in the
  UI)
- Use React Router to show the details for a single todo

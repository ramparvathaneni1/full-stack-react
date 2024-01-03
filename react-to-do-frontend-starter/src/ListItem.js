const ListItem = ({title, done, id, handleDeleteTodo}) => {
    return (
        <>
            <li>
                {title}
                <input type="checkbox" defaultChecked={done}/>
                <button onClick={(e) => handleDeleteTodo(e, id)}>X</button>
            </li>
        </>
    );
};

export default ListItem;
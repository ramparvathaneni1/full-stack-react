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

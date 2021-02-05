import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_ALL_USERS, GET_ONE_USER } from "./query/user";
import { CREATE_USER } from "./mutations/user";

function App() {
  const [users, setUsers] = useState([]);

  const { data, loading, error, refetch } = useQuery(GET_ALL_USERS);

  const { data: oneUser, loading: loadingOneUser } = useQuery(GET_ONE_USER, {
    variables: {
      id: 1,
    },
  });

  const [newUser] = useMutation(CREATE_USER);

  const [userAge, setUserAge] = useState(0);

  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (!loading) {
      setUsers(data.getAllUsers);
    }
  }, [data]);

  if (loading || loadingOneUser) {
    return <div>Loading...</div>;
  }

  console.log("oneUser", oneUser);

  const handleCreate = (e) => {
    e.preventDefault();
    newUser({
      variables: {
        input: { username: userName, age: +userAge },
      },
    }).then(({ data }) => {
      console.log("new user data:", data);
      setUserName("");
      setUserAge(0);
      getAll(e);
    });
  };

  const getAll = (e) => {
    e.preventDefault();
    refetch();
  };

  return (
    <div>
      <form>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <input
          type="number"
          value={userAge}
          onChange={(e) => setUserAge(e.target.value)}
        />
        <div className="btns">
          <button onClick={handleCreate}>Create</button>
          <button onClick={getAll}>Get</button>
        </div>
      </form>

      <div className="users">
        {users.map((user) => (
          <div className="user" key={user.id}>
            {user.username}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

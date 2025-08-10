import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodoTitle, setNewTodoTitle] = useState("");

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/todos`
        );
        const data = await response.json();

        setTodos(data);
      } catch (error) {
        console.error("데이터 불러오기 실패", error);
      }
    };
    fetchTodos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTodoTitle) return;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/todos`,
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title: newTodoTitle }),
        }
      );
      const newTodo = await response.json();

      setTodos([...todos, newTodo]);
      setNewTodoTitle("");
    } catch (error) {
      console.error("할일 추가 실패", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/todos/${id}`, {
        method: "delete",
      });
    } catch (error) {
      console.error("할일 삭제 실패", error);
    }
  };
  return (
    <div className="App">
      <h1>My Todo List</h1>
      <form onSubmit={handleSubmit} className="todo-form">
        <input
          type="text"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
        />
        <button type="submit">추가</button>
      </form>

      {/* 할 일 목록을 보여주는 부분 */}
      <div className="todo-list">
        {/* 3. todos 배열을 .map() 함수로 순회하면서 각 todo 항목을 렌더링한다. */}
        {todos.map((todo) => (
          // .map()으로 리스트를 렌더링할 때는 각 항목을 구분하기 위해 고유한 'key' prop을 꼭 넣어줘야 해.
          <div key={todo.id} className="todo-item">
            <span>{todo.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

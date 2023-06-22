'use client'

import { JwtUser } from '@/common/tool/calc';
import React, { useState } from 'react';
import { useQuery, useMutation } from 'urql'
import { useRouter } from 'next/navigation';

// GraphQL mutation to add a todo item
const ADD_TODO_MUTATION = `
  mutation AddTodoItem($content: String!, $userId:String!) {
    addTodoItem(content: $content, userId:$userId) {
      id
      content
    }
  }
`;

// GraphQL mutation to mark a todo item as done
const MARK_TODO_DONE_MUTATION = `
  mutation MarkTodoDone($id: ID!, $done: String!) {
    markTodoItemDone(id: $id, done: $done) {
      id
      content
      done
    }
  }
`;

// GraphQL mutation to delete a todo item
const DELETE_TODO_MUTATION = `
  mutation DeleteTodoItem($id: ID!) {
    deleteTodoItem(id: $id)
  }
`;

// GraphQL query to fetch todo items
const FETCH_TODO_ITEMS_QUERY = `
  query FetchTodoItems($userId: String!) {
    todoItems(userId: $userId ) {
      id
      content
      done
      userId
    }
  }
`;

const TodoListPage: React.FC<{ jwtUser: JwtUser }> = ({ jwtUser }) => {

  const router = useRouter();

  const userId = jwtUser.id;
  console.log('TodoListPage userId', userId);

  const [newTodoContent, setNewTodoContent] = useState('');

  // Mutation hook for adding a new todo item
  const [addTodoResult, addTodo] = useMutation(ADD_TODO_MUTATION);

  // Mutation hook for marking a todo item as done
  const [markTodoDoneResult, markTodoDone] = useMutation(MARK_TODO_DONE_MUTATION);

  // Mutation hook for deleting a todo item
  const [deleteTodoResult, deleteTodo] = useMutation(DELETE_TODO_MUTATION);

  // Query hook for fetching todo items
  const [fetchTodoResult, reexecuteQuery] = useQuery({
    query: FETCH_TODO_ITEMS_QUERY,
    variables: { userId },
  });

  const handleAddTodo = () => {
    addTodo({ content: newTodoContent, userId: jwtUser.id }).then(() => {
      setNewTodoContent('');
      reexecuteQuery({ requestPolicy: 'network-only' });
    });
  };

  const handleMarkTodoDone = (id: string, done: string) => {
    markTodoDone({ id, done }).then(result => {
      console.log('markTodoDone item and reexecuteQuery()', id);
      reexecuteQuery({ requestPolicy: 'network-only' });
    });
  };

  const handleDeleteTodo = (id: string, content: string) => {
    if (window.confirm(`delete: ${content}`)) {

      deleteTodo({ id }).then(result => {
        console.log('deleteTodo item and reexecuteQuery()', id);
        reexecuteQuery({ requestPolicy: 'network-only' });
      });

    } else {
      // Do nothing!
      console.log('delete canceled');
    }

  };

  const refreshItems = () => {
    console.log('refreshItems');
    reexecuteQuery({ requestPolicy: 'network-only' });
  };

  const logout = () => {
    console.log('logout');

    const url = "/api/user/logout";
    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: jwtUser.name,
      }),
    };

    console.log(`POST name: ${jwtUser.name}`);

    fetch(url, options)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.code === 0) {
          console.log(`Logout success: ${data.message}`);

          // redirect to todolist page

          // const jsonData = { name: 'John', id: 25 };
          // const jsonString = JSON.stringify(jsonData);
          // const queryParams = encodeURIComponent(jsonString);

          router.push('/user/login');
        } else {

          console.log(`Logout failed: ${data.message}`);
        }
      });


    // Perform registration logic here
    // You can send the data to an API or handle it as per your requirement
    console.log('Login submitted');

  };

  return (

    <div className="container mx-auto p-4">
      <div className="flex mb-4 justify-end items-center">
        user: {jwtUser.name}
        {/* <button
          className="bg-blue-500 text-white p-2 rounded-md ml-2"
          onClick={refreshItems}
        >
          Refresh
        </button> */}
        <button
          className="bg-blue-500 text-white p-2 rounded-md ml-2"
          onClick={logout}
        >
          Logout
        </button>
      </div>
      <div className="flex mb-4">
        <input
          type="text"
          className="border border-gray-300 p-2 rounded-md flex-grow"
          value={newTodoContent}
          onChange={(e) => setNewTodoContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault(); // Prevent form submission
              handleAddTodo();
            }
          }}
        />
        <button
          className="bg-blue-500 text-white p-2 rounded-md ml-2"
          onClick={handleAddTodo}
        >
          Add
        </button>
      </div>

      <ul>
        {fetchTodoResult.data?.todoItems.map((todoItem: any) => (
          <li
            key={todoItem.id}
            className="mb-2 bg-gray-100 p-2 rounded-md flex flex-wrap items-center justify-between"
            style={{ minWidth: '200px' }}
          >
            <span className="flex-shrink">{todoItem.content}</span>
            <div>
              {!todoItem.done && (
                <button
                  className="bg-green-500 text-white p-2 rounded-md"
                  onClick={() => handleMarkTodoDone(todoItem.id, 'false')}
                >
                  Done
                </button>
              )}
              {todoItem.done && (
                <button
                  className="bg-green-300 text-white p-2 rounded-md relative"
                  onClick={() => handleMarkTodoDone(todoItem.id, 'true')}
                >
                  Done
                  <span className="absolute inset-0 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="h-8 w-8 text-blue-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                </button>
              )}
              <button
                className="bg-red-500 text-white p-2 rounded-md ml-2"
                onClick={() => handleDeleteTodo(todoItem.id, todoItem.content)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>


  );
};

export default TodoListPage
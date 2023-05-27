'use client'

import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';

const TodoListPage: React.FC = () => {
  const [newTodoContent, setNewTodoContent] = useState('');

  const fetchTodoItems = async (url:string) => {
    const response = await fetch(url);
    return response.json();
  };

  const { data, mutate } = useSWR('/api/rest', fetchTodoItems);

  console.log(`get data: ${JSON.stringify(data)}`)

  const handleAddTodo = async () => {
    const response = await fetch('/api/rest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: newTodoContent }),
    });
    

    console.log(`post get response: ${JSON.stringify(await response.json())}`)

    setNewTodoContent('');
    mutate();
  };

  const handleMarkTodoDone = async (id: string) => {
    await fetch(`/api/rest/${id}/done`, {
      method: 'PUT',
    });
    mutate();
  };

  const handleDeleteTodo = async (id: string) => {
    await fetch(`/api/rest/${id}`, {
      method: 'DELETE',
    });
    mutate();
  };

  return (
    <div className="container mx-auto p-4">
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
        {data?.todoItems?.map((todoItem: any) => (
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
                  onClick={() => handleMarkTodoDone(todoItem.id)}
                >
                  Done
                </button>
              )}
              {todoItem.done && (
                <button
                  className="bg-green-300 text-white p-2 rounded-md relative"
                  disabled
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
                onClick={() => handleDeleteTodo(todoItem.id)}
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

export default TodoListPage;


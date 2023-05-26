'use client'

import { ApiDef } from '../../common'
import React, { useState } from 'react';
import { gql, useQuery, useMutation } from 'urql'

// GraphQL mutation to add a todo item
const ADD_TODO_MUTATION = `
  mutation AddTodoItem($content: String!) {
    addTodoItem(content: $content) {
      id
      content
    }
  }
`;

// GraphQL mutation to mark a todo item as done
const MARK_TODO_DONE_MUTATION = `
  mutation MarkTodoDone($id: ID!) {
    markTodoItemDone(id: $id) {
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
  query FetchTodoItems {
    todoItems {
      id
      content
      done
    }
  }
`;

const TodoListPage: React.FC = () => {
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
  });

  const handleAddTodo = () => {
    addTodo({ content: newTodoContent }).then(() => {
      setNewTodoContent('');
    });
  };

  const handleMarkTodoDone = (id: string) => {
    markTodoDone({ id }).then(result => {
      console.log('Deleted todo item and reexecuteQuery()', id);
      reexecuteQuery({ requestPolicy: 'network-only' });
    });
  };

  const handleDeleteTodo = (id: string) => {
    deleteTodo({ id }).then(result => {
      console.log('Deleted todo item and reexecuteQuery()', id);
      reexecuteQuery({ requestPolicy: 'network-only' });
    });
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

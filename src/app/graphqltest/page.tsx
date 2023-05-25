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
  const [fetchTodoResult] = useQuery({ query: FETCH_TODO_ITEMS_QUERY });

  const handleAddTodo = () => {
    addTodo({ content: newTodoContent }).then(() => {
      setNewTodoContent('');
    });
  };

  const handleMarkTodoDone = (id: string) => {
    markTodoDone({ id });
  };

  const handleDeleteTodo = (id: string) => {
    deleteTodo({ id });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <input
          type="text"
          className="border border-gray-300 p-2 rounded-md w-full"
          value={newTodoContent}
          onChange={(e) => setNewTodoContent(e.target.value)}
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
          <li key={todoItem.id} className="mb-2">
            {todoItem.content}
            {!todoItem.done && (
              <button
                className="bg-green-500 text-white p-2 rounded-md ml-2"
                onClick={() => handleMarkTodoDone(todoItem.id)}
              >
                Done
              </button>
            )}
            <button
              className="bg-red-500 text-white p-2 rounded-md ml-2"
              onClick={() => handleDeleteTodo(todoItem.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoListPage;

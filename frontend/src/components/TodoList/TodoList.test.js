import React from "react";
import { render, screen } from "@testing-library/react";
import TodoList from "./TodoList";
import "@testing-library/jest-dom";
// These tests verify the TodoList component's rendering behavior under different conditions:
// - The first test checks that the main header is displayed and that the component
//   shows a "No tasks found." message when the mocked API returns an empty task list.
// - The second test checks that when the mocked API returns a list of tasks,
//   the component correctly renders the titles of those tasks on the screen.
// All external dependencies like routing, authentication, and API calls are mocked
// to isolate the component's rendering logic and behavior.

jest.mock("react-router-dom", () => ({
  useParams: () => ({ userId: "123" }),
  Link: ({ children }) => <div>{children}</div>,
}));

jest.mock("../Hooks/UseAuth", () => () => ({
  auth: { userId: 123, access_token: "fake-token" },
}));

const mockGet = jest.fn();
const mockDelete = jest.fn(() => Promise.resolve());

jest.mock("../Hooks/UseAxiosPrivate", () => () => ({
  get: mockGet,
  delete: mockDelete,
}));

test("renders header with mocks for everything", async () => {
  mockGet.mockResolvedValueOnce({ data: [] }); // empty list for this test

  render(<TodoList />);

  expect(screen.getByText(/My Todo-s/i)).toBeInTheDocument();

  const noTasks = await screen.findByText(/No tasks found./i);
  expect(noTasks).toBeInTheDocument();
});

test("renders list of tasks when data is returned", async () => {
  mockGet.mockResolvedValueOnce({
    data: [
      { id: 1, title: "Task 1", description: "Desc 1" },
      { id: 2, title: "Task 2", description: "Desc 2" },
    ],
  }); // mock tasks for this test

  render(<TodoList />);

  expect(await screen.findByText("Task 1")).toBeInTheDocument();
  expect(screen.getByText("Task 2")).toBeInTheDocument();
});

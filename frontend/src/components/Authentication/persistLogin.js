test("renders input and add button", () => {
  expect(screen.getByPlaceholderText(/add new task/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /add task/i })).toBeInTheDocument();
});

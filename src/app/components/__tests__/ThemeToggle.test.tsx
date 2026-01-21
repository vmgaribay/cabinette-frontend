import { render, screen, fireEvent } from "@testing-library/react";
import ThemeToggle from "../ThemeToggle";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { toggleTheme } from "../../store/themeSlice";

const mockStore = configureStore([]);

test("renders labels", () => {
    const store = mockStore({
      theme: { mode: "light" },
    });
    render(
      <Provider store={store}>
        <ThemeToggle />
      </Provider>
    );
    expect(screen.getByText("Light")).toBeInTheDocument();
    expect(screen.getByText("Dark")).toBeInTheDocument();

  });

  test("dispatches toggleTheme when clicked", () => {
    const store = mockStore({
      theme: { mode: "default" },
    });
    store.dispatch = jest.fn();

    render(
      <Provider store={store}>
        <ThemeToggle />
      </Provider>
    );

    fireEvent.click(screen.getByRole("button"));
    expect(store.dispatch).toHaveBeenCalledWith(toggleTheme());
  });

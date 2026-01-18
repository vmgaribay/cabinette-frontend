import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { createRef } from "react";
import BookmarksFilter from "../BookmarksFilter";

const themeRef = createRef<HTMLDivElement>();
const mockStore = configureStore([]);
const initialStore = {
  bookmarks: { siteIds: ["site1", "site2"] },
  filter: { showBookmarkedOnly: false },
};
let store: any;
beforeAll(() => {
  window.alert = jest.fn();
  window.confirm = jest.fn(() => true);
});

beforeEach(() => {
  store = mockStore(initialStore);
});

afterEach(() => {
  jest.restoreAllMocks();
});

if (!("createObjectURL" in URL)) {
  URL.createObjectURL = jest.fn();
}
if (!("revokeObjectURL" in URL)) {
  URL.revokeObjectURL = jest.fn();
}

test('bookmark filter toggles', () => {
  render(
    <Provider store={store}>
      <BookmarksFilter themeRef={themeRef} />
    </Provider>
  );
    const toggle = screen.getByRole("checkbox", { name: /show only/i });
    expect(toggle).toBeInTheDocument();
    expect(toggle).not.toBeChecked();
    fireEvent.click(toggle);
    expect(store.getActions()).toContainEqual({
      type: "filter/setShowBookmarkedOnly",
      payload: true,
    });
});


test('opens and closes the utilities menu', () => {
    render(
    <Provider store={store}>
        <BookmarksFilter themeRef={themeRef} />
    </Provider>
    );
    const utilitiesButton = screen.getByRole("button", { name: /Utilities/i });
    expect(utilitiesButton).toBeInTheDocument();
    fireEvent.click(utilitiesButton);
    const cancelButton = screen.getByRole("button", { name: /X Cancel/i });
    expect(cancelButton).toBeInTheDocument();
    fireEvent.click(cancelButton);
});

test('exports bookmarks as JSON', () => {
  render(
    <Provider store={store}>
      <BookmarksFilter themeRef={themeRef} />
    </Provider>
  );
  fireEvent.click(screen.getByRole("button", { name: /Utilities/i }));
  const downloadButton = screen.getByRole("button", { name: /export bookmarks/i });  expect(downloadButton).toBeInTheDocument();
const createObjectURLSpy = jest.spyOn(URL, 'createObjectURL').mockReturnValue('blob:http://website.com/mockdownload');
fireEvent.click(downloadButton);

  expect(createObjectURLSpy).toHaveBeenCalled();
  const blobArg = createObjectURLSpy.mock.calls[0][0];
  expect(blobArg).toBeInstanceOf(Blob);
  createObjectURLSpy.mockRestore();
  waitFor(() => {
  expect(screen.getByText(/initialized/i)).toBeInTheDocument();
   });
});

test('bookmarks imported and overwritten', () => {
  render(
    <Provider store={store}>
      <BookmarksFilter themeRef={themeRef} />
    </Provider>
  );
  fireEvent.click(screen.getByRole("button", { name: /Utilities/i }));
  const importLabel = screen.getByText(/import bookmarks/i).closest("label");
  const fileInput = importLabel!.querySelector("input[type='file']");
  expect(fileInput).toBeInTheDocument();  
    const file = new File(
        [JSON.stringify({ siteIds: ["site3", "site4"], date: new Date().toISOString() })],
        "bookmarks_test.json",
        { type: "application/json" }
    );
    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);
    fireEvent.change(fileInput, { target: { files: [file] } });
     waitFor(() => {
    expect(screen.getByText(/Bookmarks from file/i)).toBeInTheDocument();
    });
    waitFor(() => {
    expect(store.getActions()).toContainEqual({
    type: "bookmarks/setBookmarks",
    payload: ["site3", "site4"],
  });
    });
    confirmSpy.mockRestore();
});



test('merges bookmarks and exports', () => {
    render(
    <Provider store={store}>
      <BookmarksFilter themeRef={themeRef} />
    </Provider>
  );
    fireEvent.click(screen.getByRole("button", { name: /Utilities/i }));
    const addLabel = screen.getByText(/add to existing bookmarks/i).closest("label");
    const fileInput = addLabel.querySelector("input[type='file']");
    expect(addLabel).toBeInTheDocument();  
    const file = new File(
        [JSON.stringify({ siteIds: ["site2", "site3"], date: new Date().toISOString() })],
        "bookmarks.json",
        { type: "application/json" }
    );
    fireEvent.change(fileInput, { target: { files: [file] } });
    setTimeout(() => {
      expect(store.getActions()).toContainEqual({
        type: "bookmarks/setSiteIds",
        payload: ["site1", "site2", "site3"],
      });
    }, 0);
        waitFor(() => {
        expect(screen.getByText(/Bookmarks merged with file/i)).toBeInTheDocument();
    });
});



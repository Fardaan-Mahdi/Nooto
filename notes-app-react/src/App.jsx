import { useState, useEffect } from "react";
import MainLayout from "./layouts/MainLayout";
import AddNotePage from "./pages/AddNotes";
import EditNotePage from "./pages/EditNotePage";
import HomePage from "./pages/HomePage";
import NoteDetailPage from "./pages/NotePage";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
// import { TbError404Off } from "react-icons/tb"

const App = () => {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterText, setFilterText] = useState("");
  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8008';
  console.log("Current API URL:", API_URL);
  const handleFilterText = (val) => {
    setFilterText(val);
  };

  const handelSearchText = (val) => {
    setSearchText(val);
  };

  const filteredNotes =
    filterText === "BUSINESS"
      ? notes.filter((note) => note.category == "BUSINESS")
      : filterText === "PERSONAL"
      ? notes.filter((note) => note.category == "PERSONAL")
      : filterText === "IMPORTANT"
      ? notes.filter((note) => note.category == "IMPORTANT")
      : notes;

  useEffect(() => {
    if (searchText.length === 0) {
      // Reset to all notes when search is cleared
      axios
        .get(`${API_URL}/notes/`)
        .then((res) => {
          setNotes(res.data);
        })
        .catch((err) => console.log(err.message));
      return;
    }
    if (searchText.length < 3) return;
    axios
      .get(`${API_URL}/notes-search/?search=${searchText}`)
      .then((res) => {
        console.log(res.data);
        setNotes(res.data);
      })
      .catch((err) => console.log(err.message));
  }, [searchText]);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${API_URL}/notes/`)
      .then((res) => {
        // console.log(res.data);
        setNotes(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  const addNote = (data) => {
    axios
      .post(`${API_URL}/notes/`, data)
      .then((res) => {
        setNotes([...notes, data]);
        toast.success("A new note has been added");
        console.log(res.data);
      })

      .catch((err) => {
        console.log(console.log(err.message));
      });
  };

  const updateNote = (data, slug) => {
    axios
      .put(`${API_URL}/notes/${slug}/`, data)
      .then((res) => {
        console.log(res.data);
        toast.success("Note updated succesfully");
      })

      .catch((err) => console.log(err.message));
  };

  const deleteNote = (slug) => {
    axios
      .delete(`${API_URL}/notes/${slug}`)
      .catch((err) => console.log(err.message));
  };

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route
        path="/"
        element={
          <MainLayout
            searchText={searchText}
            handelSearchText={handelSearchText}
          />
        }
      >
        <Route
          index
          element={
            <HomePage
              notes={filteredNotes}
              loading={isLoading}
              handleFilterText={handleFilterText}
            />
          }
        />
        <Route path="/add-note" element={<AddNotePage addNote={addNote} />} />
        <Route
          path="/edit-note/:slug"
          element={<EditNotePage updateNote={updateNote} />}
        />
        <Route
          path="/notes/:slug"
          element={<NoteDetailPage deleteNote={deleteNote} />}
        />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;

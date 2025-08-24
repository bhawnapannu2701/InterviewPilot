import { createBrowserRouter } from "react-router-dom";
import Home from "./routes/Home";
import Setup from "./routes/Setup";
import Interview from "./routes/Interview";
import Result from "./routes/Result";
import Transcripts from "./routes/Transcripts";
import Auth from "./routes/Auth";

export const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/setup", element: <Setup /> },
  { path: "/interview/:id", element: <Interview /> },
  { path: "/result/:id", element: <Result /> },
  { path: "/transcripts", element: <Transcripts /> },
  { path: "/auth", element: <Auth /> },
]);

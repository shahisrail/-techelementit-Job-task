import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  { path: "/", element: <div>Home</div>, errorElement: <div>error</div> },
]);
export default router;

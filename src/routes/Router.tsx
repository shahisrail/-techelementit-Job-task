import { createBrowserRouter } from "react-router-dom";
import App from "../pages/App";

 

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <div>error</div>,
  },
]);
export default router;

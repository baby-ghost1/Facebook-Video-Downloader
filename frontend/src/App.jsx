import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";

const App = () => {
  return (
    <>
      <Home />
      <Toaster position="top-right" />
    </>
  );
};

export default App;

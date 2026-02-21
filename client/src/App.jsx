import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "./pages/Home";
import Books from "./pages/Books";
import Cart from "./pages/Cart";

function App() {
  return (
    
   <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="books" element = {<Books />} />
          <Route path="cart" element = {<Cart />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import homeImage from "../../assets/home-img.png";
import Item from "./Item";
import Minter from "./Minter";

function App() {
  return (
    <div className="App">
      <Header />
      {/* <img className="bottom-space" src={homeImage} /> */}
      {/* <Item id="rrkah-fqaaa-aaaaa-aaaaq-cai"/> */}
      {/* <Minter/> */}
      <Footer />
    </div>
  );
}

export default App;

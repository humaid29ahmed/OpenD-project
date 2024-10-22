import React, { useEffect, useState } from "react";
import {Principal} from "@dfinity/principal";
import Item from "./Item";

function Gallery(props) {

  const [items, setItems] = useState(); //This State would store small HTML code to Display NFTs 
 

  function fetchNfts() // This function is used to get all the NFT ids array sent from the Header.jsx to Gallery.jsx
  {
    console.log(props.ids);
    console.log(props.ids != undefined);
    if(props.ids != undefined) //If props.ids contains no Ids then the bloack of Inside will not executed.
    {
      console.log("Inside the Function.");
      console.log(props.ids.length);
    setItems(props.ids.map((nftId)=><Item id={nftId} key={nftId.toText()} role={props.role} />)); // Creates all the NFT Item cards by sending the ids via props to Item.jsx 
    }
  }
  useEffect(()=>{fetchNfts();},[]); // Call the function once when the user navigates to Collections or MyNFT and Discover Page.
  
  return (
    <div className="gallery-view"> {/* Display the Title Like "My NFTs" or "Discover" based on the props sent from the header.jsx */}
      <h3 className="makeStyles-title-99 Typography-h3">{props.title}</h3>
      <div className="disGrid-root disGrid-container disGrid-spacing-xs-2">
        <div className="disGrid-root disGrid-item disGrid-grid-xs-12">
          <div className="disGrid-root disGrid-container disGrid-spacing-xs-5 disGrid-justify-content-xs-center"> {
            items
          }</div>
         
        </div>
      </div>
    </div>
  );
}

export default Gallery;

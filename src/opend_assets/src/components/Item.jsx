import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import {Actor,HttpAgent} from "@dfinity/agent";
import { idlFactory } from "../../../declarations/NFT";
import { idlFactory as tokenIdlFactory } from "../../../declarations/token";
import {Principal} from "@dfinity/principal";
import {opend} from "../../../declarations/opend";
import Button from "./Button";
import CURRENT_USER_ID from "../index";
import Price from "./Price";


function Item(props) {

  console.log("hello !!!");

  const id =props.id; // Conatins the Canister Ids of the NFT sent by the Gallery.jsx
  const localHost = "http://localhost:8080/"; 

  const agent = new HttpAgent({host : localHost}); //Establishes a Connections between the Cannisters that will be hosted locally on port 8000 by default.
  // Remove "agent.fetchRootKey()" when deploying live.
  agent.fetchRootKey();
  /* This "agent.fetchRootKey()" is by importing the @dfinity/agent which is used to get the RootKey of the ICP local replica networks.
     Furthermore, authenticity of the responses from the ICP Canisters. It is used when we test or run the application on the local Internet Computer Replica
     because when we run the local replica of the ICP each responses are not signed cryptographically by default which provides the authenticity of the responses
     of the Cannisters that the Application uses */

  const [name, setName] = useState("");// set the Name of the NFT
  const [principalId, setId] = useState(""); // Owners Principal Id that owns the NFT
  const [url, setUrl] = useState(""); //It stores the created image url to display the Image of the NFT
  const [button, setButton] = useState(); // It is used to store the button component
  const [priceInput, setInput] = useState();// It is used to set the Selling price of the NFT
  const [blur, setBlur] = useState();// It is used to store the CSS object to blur the card after the NFT is sold to the Opend platform
  const [listed, setListed] = useState();// It is used to stored to print "Listed" in front of the NFT that are for sale in Opend Platform
  const [loaderHidden, setLoaderHidden] = useState(true); // It is used to store the value that handles the visibility of the loader
  const [listPrice, setListPrice] = useState();// It stores the price of the NFT
  const [cardDisplay, setCardDisplay] = useState(true); // It stores the value for the display style So that after buying the NFT It should not display the NFT in the Discover page
  let nftActor;
  async function loadNFT()
  {
    nftActor = await Actor.createActor(idlFactory, {
      agent,
      canisterId: id,
    }); // It connects to the Specific NFT canister that exist

    const name = await nftActor.getName(); // Access the Name of the NFT
    const principalId = await nftActor.getOwnerId(); // Access the Canister ID of the Owner that owns it
    const imageData = await nftActor.getImageBytes(); // Gets 8bit image binary Array
    const imageContent = new Uint8Array(imageData);  // Stores the 8bit image data into 8bit array 
    const image = URL.createObjectURL(new Blob([imageContent.buffer],{type: "image/png"}))// Converts the 8bit Image Array into an Image URL
    console.log(principalId);
    setId(principalId.toText()); //Convert and Stores the Prinicipal ID into text for display
    setUrl(image); //Stores the image URL once it has been created
    console.log(url);
    setName(name); // Stores the name of the NFT
   if(props.role === "myNfts") // If MyNFT page is Accessed this if block is executed
   {
    let isListedResult = await opend.isListed(props.id); // This async method call would provide a boolean value.
    if(isListedResult) // If the NFT is listed for sale then this codeblock would executed or else block would be executed.
    {
          setId("openD");// Setting the principal ID to Opend platform
          setBlur({filter:"blur(4px)"});// Bluring the image of the NFT 
          setListed("Listed");// Used to display the NFT as Listed for the listed NFT.
    }else{
    setButton(<Button handleClick={handleSell} text="Sell"/>); // If the NFT is not listed it will display this Sell button to list your buyed NFT
    }
  }else if(props.role === "discover") // If Discover page is Accessed this if block is executed.
  {
    const originalOwnerId = await opend.getOriginalOwnerId(props.id); // It get the Owners Principal ID of the NFT
    console.log(originalOwnerId.toText());
    const listedNftPrice = await opend.listedPrice(props.id); // It get the Listed Price of the NFT that is Currently listed for sale.
    console.log("Listed Price :"+ listedNftPrice);
    setListPrice(<Price sellprice={listedNftPrice} />);// Used to set the state and display the price component.
    if(originalOwnerId.toText() !== CURRENT_USER_ID.toText()) // this will check if the person is not the owner who sold its NFT to the Opend platform
    {
    setButton(<Button handleClick={handleBuy} text="Buy"/>);// if the condition satisfies it will display the button
    }
  }

  }



  useEffect(()=>{
    loadNFT();
  },[]); // this will call the loadNFT() async function once this component is called from the gallery component
  let price; // stores the price of an NFT while inputing the price of the NFT
  function handleSell() // This function is called when you want to sell and list your NFT to the Opend platform
  {
    console.log("sell button is clicked");
    
    setInput(<input
      placeholder="Price in DANG"
      type="number"
      className="price-input"
      value={price}
      onChange={(e)=>price = e.target.value}
    />);

    setButton(<Button handleClick={sellItem} text="Confirm"/>); // once you have added the price , you click the confirm button that will call the sellItem()
  }

  async function handleBuy() // This function will be executed when pressing the buy button
  {
    console.log("Buy button is Clicked!");
    setLoaderHidden(false);
    const tokenActor = await Actor.createActor(tokenIdlFactory, {agent, canisterId: Principal.fromText("xub3y-eqaaa-aaaaa-aaawq-cai") });
    const nftOwnerId = await opend.getOriginalOwnerId(props.id);
    const itemPrice = await opend.listedPrice(props.id);

    const transferResult = await tokenActor.transfer(nftOwnerId, itemPrice);

    if(transferResult == "Success")
    {
      //transfer the ownership
      const transferResult = await opend.transferOwnership(props.id, nftOwnerId, CURRENT_USER_ID);
      console.log("Purchase : "+transferResult);
      setLoaderHidden(true);
      setCardDisplay(false);
    }
  }
  async function sellItem() // This function works when the user press the sell button
    {
      setLoaderHidden(false);
      console.log("User is selling the item at "+ price);

      let listingResult = await opend.listItem(id, Number(price)); // listing the items in the mapofList hashmap in the backend and returns the result as "Success" if the NFT has been successfully listed.

      console.log("listing : "+listingResult);

      if(listingResult == "Success")
      {
        let openID = await opend.getOpenId(); // get the openD cannister Id
        let transferResult = await nftActor.transferNftOwnership(openID); // transfer the ownerhip to the OpenD platform
        console.log(`Transfer result : ${transferResult}`);
        if(transferResult == "Success")
        {
          setLoaderHidden(true);
          setButton();
          setInput();
          setId("openD");
          setBlur({filter:"blur(4px)"});
          setListed("Listed");
        }
      }
    } 
  return (
    <div style = {{display: cardDisplay ? "inline": "none"}} className="disGrid-item">
      {/*This HTML is used to Display the Item NFT card in the Gallery*/}
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          style={blur}
          src={url}
        />
        <div hidden={loaderHidden} className="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
        <div className="disCardContent-root">
          {listPrice}
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name}<span className="purple-text"> {listed}</span>
          </h2>
          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner: {principalId}
          </p>
          {priceInput}
          {button}
        </div>
      </div>
    </div>
  );
}

export default Item;

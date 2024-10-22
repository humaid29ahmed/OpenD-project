import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import {BrowserRouter, Link, Switch,Route} from "react-router-dom";
import homeImage from "../../assets/home-img.png";
import Minter from "./Minter";
import Gallery from "./Gallery";
import {opend} from "../../../declarations/opend";
import CURRENT_USER_ID from "../index";

function Header() {
  let [galleryItems, setGalleryItems] = useState(); /*This State is used to send the Owner minted NFTs 
                                                      Principal Canister ids to the Gallery Component */

  let [listedItems, setListedItems] = useState();   /* This State is use to send the Owner Principal Canister ids to the Gallery Component 
                                                       that the Owner has listed for Selling the NFTs in the Opend DeFi Platform */ 
  
  
  async function getNft() /*This async function is used call the opend motoko backend for the Lists
                            of NFT canister ids both Listed and Minted to the Gallery Component */
  {
    let ownerNfts = await opend.ownersNftsList(CURRENT_USER_ID); // Calling and Getting the Minted NFT list ids Array from the Motoko backend
    console.log(ownerNfts);
    setGalleryItems(
      <Gallery ids={ownerNfts} title="My NFTs" role="myNfts"/> // Sending the Minted Canister ids  Array to the Gallery Component to Display the NFTs
    );
    const listedPrincipalIds = await opend.getListedNfts(); // Calling and Getting the Listed NFT list Canister ids Array from the Motoko backend
    console.log(listedPrincipalIds);
    setListedItems(<Gallery ids={listedPrincipalIds} title="Discover" role="discover"/>); // Sending the Listed Canister ids  Array to the Gallery Component to Display the NFTs
    
  }

  useEffect(()=>{getNft();},[]); // This useEffect is used call the getNFT() once the page is loaded on the Screen
  return (
    <BrowserRouter forceRefresh={true}> {/* Handles routing to different pages  */}
    <div className="app-root-1">
      <header className="Paper-root AppBar-root AppBar-positionStatic AppBar-colorPrimary Paper-elevation4">
        <div className="Toolbar-root Toolbar-regular header-appBar-13 Toolbar-gutters">
          <div className="header-left-4"></div>
          <img className="header-logo-11" src={logo} />
          <div className="header-vertical-9"></div>
          <h5 className="Typography-root header-logo-text"><Link to="/">OpenD</Link></h5>
          <div className="header-empty-6"></div>
          <div className="header-space-8"></div>
          <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
            <Link to="/discover"> {/* Creates a Link same like Anchor Tab to Direct to the Specific EndPoints like here It will Direct to "/discover"*/}
            Discover
            </Link>
          </button>
          <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
            <Link to="/minter"> {/*Links to "/minter " where you can Mint an NFT or Create an NFT*/}
            Minter
            </Link>
          </button>
          <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
            <Link to="/collections"> {/*Links to "/minter " where you can view all the Minted NFTs*/}
            My NFTs
            </Link>
          </button>
        </div>
      </header>
    </div>
    <Switch> {/* SWitches to the Specific Endpoint One at a time*/}
     <Route exact path="/"> {/*Routes to the Homepage*/}
     <img className="bottom-space" src={homeImage} />
     </Route>
     <Route path="/discover">  {/*Routes and Send the Listed Gallery Component Items to the Discover page where all the Listed NFTs Can be Viewed*/}
    {listedItems}
     </Route>
     <Route path="/minter"> {/*Routes and render Minter Component to the Minter Form Where you can Provide data to Mint a new NFT*/}
     <Minter/>
     </Route>
     <Route path="/collections"> {/*Routes and render the Gallery Components to the Collections Where you can see all the Minted NFTs of the user*/}
     {galleryItems}
     </Route>
    </Switch>
    </BrowserRouter>
  );
}

export default Header;

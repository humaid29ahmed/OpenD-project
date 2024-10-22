import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Nat8 "mo:base/Nat8";
import NFTActorClass "../NFT/nft";
import Cycles "mo:base/ExperimentalCycles";
import Debug "mo:base/Debug";
import HashMap "mo:base/HashMap";
import List "mo:base/List";
import Bool "mo:base/Bool";
import Iter "mo:base/Iter";
actor OpenD { // This Canister is for the Opend platform where it is used to store the Users NFT data
    private type Listing = {    // It is the custom datatype that stores the Owner Principal Id and listed price of the selling NFT to the openD platform
        itemOwner: Principal;
        itemPrice: Nat;
    };
    let mapofNFTs = HashMap.HashMap<Principal, NFTActorClass.NFT>(1,Principal.equal,Principal.hash); // It contains the principal ID of the Owner NFT and the NFT Canister
    let mapofOwners = HashMap.HashMap<Principal, List.List<Principal>>(1, Principal.equal, Principal.hash);
    let mapofListing = HashMap.HashMap<Principal, Listing>(1, Principal.equal, Principal.hash);
    public shared(msg) func mint(image: [Nat8], name: Text): async Principal
    {
        let owner: Principal = msg.caller; // Principal Id of the person who is using the OpenD platform

        Debug.print(debug_show(Cycles.balance()));

        Cycles.add(100_500_000_000);  // Add Cycles to run a canister.

        let newNFT = await NFTActorClass.NFT(name, owner, image); // Provide details like name, owner's principal Id and image in bytes

        Debug.print(debug_show(Cycles.balance()));

        let newCFTPrincipal = await newNFT.getCanisterId(); // Get the newly created NFTs Canister ID 

        mapofNFTs.put(newCFTPrincipal, newNFT); // Adds the new NFT details to the mapofNFTs Hashmap
        addToOwnershipMap(owner, newCFTPrincipal); // Transfer the NFT ownership to the Owner who minted the NFT

        return newCFTPrincipal; // returns new NFT principal Id


    };

      public query func wallet_receive() : async () {
        // This method is required to accept cycles
        Debug.print("Cycles received by the canister.");
      };

      public query func getCycleBalance(): async Nat {
        return Cycles.balance(); // Returns the current cycle balance
    };

    private func addToOwnershipMap(owner: Principal, newNftId: Principal) // This function add the owners Id and NFT principal Id to the mapofOwners Hashmap
    {
        var ownerNfts: List.List<Principal> = switch(mapofOwners.get(owner))
        {
            case null List.nil<Principal>();
            case (?result) result;
        };
        
        ownerNfts:= List.push(newNftId, ownerNfts);
        mapofOwners.put(owner, ownerNfts);
    };

    public query func ownersNftsList(user: Principal): async [Principal] // This function takes owners principal ID to return the list of NFT principal Id that are linked to the user
    {
        var userNfts:List.List<Principal> = switch(mapofOwners.get(user)){
            case null List.nil<Principal>();
            case (?result) result;
        };

        

        return List.toArray(userNfts);

    };

    public query func getListedNfts(): async [Principal] //This functions sends all the Listed NFT principal Id
    {

        let ids = Iter.toArray(mapofListing.keys());

        return ids

    };

    public shared(msg) func listItem(id: Principal, price: Nat ): async Text // This function add the NFT for Listing in the OpenD platform
    {
        var ownerNft: NFTActorClass.NFT = switch(mapofNFTs.get(id)){
            case null return "NFT does not exist !";
            case (?result) result;
        };
        let ownerId:Principal = await ownerNft.getOwnerId();
        if(Principal.equal(ownerId, msg.caller))
        {
            let newListing: Listing = {
                itemOwner = ownerId;
                itemPrice = price;
            };

            mapofListing.put(id, newListing);
            return "Success";
        } else {
            return "You don't own an NFT !";
        }

    };

    public query func getOpenId():async Principal // It return the Principal Id of the OpenD canister
    {
        return Principal.fromActor(OpenD);
    };

    public query func isListed(id:Principal): async Bool // It returns the boolean value whether the NFT is listed or Not
    {
        if(mapofListing.get(id) == null)
        {
            return false;
        }else{
            return true;
        }
    };

    public query func getOriginalOwnerId(id:Principal): async Principal //Return the Original Owner Principal Id of the Listed NFT 
    {
        var listings: Listing = switch(mapofListing.get(id))
        {
            case null return Principal.fromText("");
            case (?result) result;
        };

        return listings.itemOwner;

    };

    public query func listedPrice(id: Principal): async Nat //Return the Listed price of the Listed NFT
    {

        var listPrice: Listing = switch(mapofListing.get(id))
        {
            case null return 0;
            case (?result) result;
        };

        return listPrice.itemPrice;

    };

    public shared(msg) func transferOwnership(id: Principal, ownerId: Principal, newOwnerId: Principal): async Text // Transfer of the OwnerShip from one User to Another
    {

        var purchasedNFT : NFTActorClass.NFT = switch(mapofNFTs.get(id)){
            case null return "NFT does not exists!";
            case(?result) result;
        };

        var transferResult = await purchasedNFT.transferNftOwnership(newOwnerId);

        if(transferResult == "Success")
        {
            mapofListing.delete(id);
            var ownerNFTs: List.List<Principal> = switch(mapofOwners.get(ownerId)){
                case null List.nil<Principal>();
                case (?result) result;
            };

            ownerNFTs:= List.filter(ownerNFTs, func (listItemId: Principal): Bool{
                return listItemId != id;
            });

            addToOwnershipMap(newOwnerId, id);

            return "Success";
            } else {return "Error";}
        
    }
 
};

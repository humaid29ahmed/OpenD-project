import Debug "mo:base/Debug";
import Nat8 "mo:base/Nat8";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
// This actor is used to create an NFT Canister Which stores name, Owner principal Id and image in 8 byte arrays 
actor class NFT (name : Text, owner : Principal, image : [Nat8]) = this {

   private let itemName = name;
   private var ownerId = owner;
   private let imageBytes = image;

   public query func getName(): async Text
   {
    return itemName;
   };

   public query func getOwnerId(): async Principal
   {
    return ownerId;
   };

   public query func getImageBytes(): async [Nat8]
   {
    return imageBytes;
   };

   public query func getCanisterId(): async Principal
   {
      return Principal.fromActor(this);
   };

   public shared(msg) func transferNftOwnership(newOwner:Principal):async Text //Transfering the ownership of the nft to the new owner
   {
      if(msg.caller == ownerId)
      {
         ownerId := newOwner;
         return "Success";

      }else{
         return "Error: Not initiated by NFT Owner.";
      }
   }

};
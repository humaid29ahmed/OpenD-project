import type { Principal } from '@dfinity/principal';
export interface _SERVICE {
  'getCycleBalance' : () => Promise<bigint>,
  'getListedNfts' : () => Promise<Array<Principal>>,
  'getOpenId' : () => Promise<Principal>,
  'getOriginalOwnerId' : (arg_0: Principal) => Promise<Principal>,
  'isListed' : (arg_0: Principal) => Promise<boolean>,
  'listItem' : (arg_0: Principal, arg_1: bigint) => Promise<string>,
  'listedPrice' : (arg_0: Principal) => Promise<bigint>,
  'mint' : (arg_0: Array<number>, arg_1: string) => Promise<Principal>,
  'ownersNftsList' : (arg_0: Principal) => Promise<Array<Principal>>,
  'transferOwnership' : (
      arg_0: Principal,
      arg_1: Principal,
      arg_2: Principal,
    ) => Promise<string>,
  'wallet_receive' : () => Promise<undefined>,
}

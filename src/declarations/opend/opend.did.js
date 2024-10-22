export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'getCycleBalance' : IDL.Func([], [IDL.Nat], ['query']),
    'getListedNfts' : IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
    'getOpenId' : IDL.Func([], [IDL.Principal], ['query']),
    'getOriginalOwnerId' : IDL.Func(
        [IDL.Principal],
        [IDL.Principal],
        ['query'],
      ),
    'isListed' : IDL.Func([IDL.Principal], [IDL.Bool], ['query']),
    'listItem' : IDL.Func([IDL.Principal, IDL.Nat], [IDL.Text], []),
    'listedPrice' : IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
    'mint' : IDL.Func([IDL.Vec(IDL.Nat8), IDL.Text], [IDL.Principal], []),
    'ownersNftsList' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(IDL.Principal)],
        ['query'],
      ),
    'transferOwnership' : IDL.Func(
        [IDL.Principal, IDL.Principal, IDL.Principal],
        [IDL.Text],
        [],
      ),
    'wallet_receive' : IDL.Func([], [], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };

const USER_REGISTER = {
  contract: "KT1XaikgmBDQANBvkFqyFhSpgAZJAXpiDFGE",
  entrypoint: "update_profile",
};

const ISSUER_V0 = {
  contract: "KT1PyfrDD85RxUWz8dMHoC92MxdPzecSQ5t9",
  entrypoint: "update_issuer",
};

const GENTK_V1 = {
  contract: "KT1ExHjELnDuat9io3HkDcrBhHmek7h8EVXG",
  entrypoint: "mint",
};

const CONTRACTS = [
  USER_REGISTER.contract,
  ISSUER_V0.contract,
  GENTK_V1.contract,
];

const ENTRYPOINTS = [
  USER_REGISTER.entrypoint,
  ISSUER_V0.entrypoint,
  GENTK_V1.entrypoint,
];

const BATCH_LIMIT = 1000;

export {
  USER_REGISTER,
  ISSUER_V0,
  GENTK_V1,
  CONTRACTS,
  ENTRYPOINTS,
  BATCH_LIMIT,
};

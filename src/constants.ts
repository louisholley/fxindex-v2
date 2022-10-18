const USER_REGISTER = {
  address: "KT1XaikgmBDQANBvkFqyFhSpgAZJAXpiDFGE",
  entrypoint: "update_profile",
};

const ISSUER_V0 = {
  address: "KT1PyfrDD85RxUWz8dMHoC92MxdPzecSQ5t9",
  entrypoint: "update_issuer",
};

const GENTK_V1 = {
  address: "KT1ExHjELnDuat9io3HkDcrBhHmek7h8EVXG",
  entrypoint: "mint",
};

const CONTRACTS = [USER_REGISTER, ISSUER_V0, GENTK_V1];

const BATCH_LIMIT = 1000;

export { USER_REGISTER, ISSUER_V0, GENTK_V1, CONTRACTS, BATCH_LIMIT };

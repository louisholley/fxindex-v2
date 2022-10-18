import { TransactionOperation } from "@tzkt/sdk-api";
import { CONTRACTS, GENTK_V1, ISSUER_V0, USER_REGISTER } from "./constants";
import { Gentk } from "./entity/Gentk";
import { Project } from "./entity/Project";
import { User } from "./entity/User";

const mapTransactionToUser = ({
  sender: { address, alias },
}: TransactionOperation) => {
  const user = new User();
  user.id = address;
  user.alias = alias;
  return user;
};

interface ProjectTransaction extends TransactionOperation {
  parameter: {
    value: {
      issuer_id: string;
      price: string;
      royalties: string;
      enabled: boolean;
    };
  };
}

const mapTransactionToProjectAndCreator = ({
  sender: { address, alias },
  parameter: {
    value: { issuer_id, price, royalties, enabled },
  },
}: ProjectTransaction) => {
  const project = new Project();
  project.id = issuer_id;
  project.price = price ? parseInt(price) : null;
  project.royalties = royalties ? parseInt(royalties) : null;
  project.enabled = enabled;

  const creator = new User();
  creator.id = address;
  creator.alias = alias;

  project.creator = creator;

  return { project, creator };
};

interface GentkTransaction extends TransactionOperation {
  parameter: {
    value: {
      address: string;
      metadata: any;
      token_id: string;
      issuer_id: string;
      iteration: string;
      royalties: string;
    };
  };
}

const mapTransactionToGentkAndProjectAndMinter = ({
  timestamp,
  parameter: {
    value: { address, metadata, token_id, issuer_id, iteration, royalties },
  },
}: GentkTransaction) => {
  const minter = new User();
  minter.id = address;

  const project = new Project();
  project.id = issuer_id;

  const gentk = new Gentk();
  gentk.id = token_id;
  gentk.project = project;
  gentk.minter = minter;
  gentk.timestamp = new Date(timestamp);
  gentk.iteration = parseInt(iteration);
  gentk.royalties = parseInt(royalties);
  gentk.metadata = metadata;

  return { minter, project, gentk };
};

const isTransactionType =
  (contract: typeof CONTRACTS[0]) => (t: TransactionOperation) =>
    t.target.address === contract.address &&
    t.parameter.entrypoint === contract.entrypoint;

const isUserTransaction = isTransactionType(USER_REGISTER);
const isProjectTransaction = isTransactionType(ISSUER_V0);
const isGentkTransaction = isTransactionType(GENTK_V1);

const mapToEntitiesAcc = {
  users: {},
  projects: {},
  gentks: {},
};

type MapToEntitiesAcc = typeof mapToEntitiesAcc;

const handleUserTransaction = (
  acc: MapToEntitiesAcc,
  t: TransactionOperation
) => {
  const user = mapTransactionToUser(t);
  return {
    ...acc,
    users: {
      ...acc.users,
      [user.id]: user,
    },
  };
};

const handleProjectTransaction = (
  acc: MapToEntitiesAcc,
  t: TransactionOperation
) => {
  const { project, creator } = mapTransactionToProjectAndCreator(
    t as ProjectTransaction
  );
  const hasCreatorBeenIndexed = !!acc.users[creator.id];
  return {
    ...acc,
    projects: {
      ...acc.projects,
      [project.id]: project,
    },
    users: hasCreatorBeenIndexed
      ? acc.users
      : { ...acc.users, [creator.id]: creator },
  };
};

const handleGentkTransaction = (
  acc: MapToEntitiesAcc,
  t: TransactionOperation
) => {
  const { gentk, project, minter } = mapTransactionToGentkAndProjectAndMinter(
    t as GentkTransaction
  );
  const hasProjectBeenIndexed = !!acc.projects[project.id];
  const hasMinterBeenIndexed = !!acc.users[minter.id];
  return {
    ...acc,
    gentks: {
      ...acc.gentks,
      [gentk.id]: gentk,
    },
    projects: hasProjectBeenIndexed
      ? acc.projects
      : { ...acc.projects, [project.id]: project },
    users: hasMinterBeenIndexed
      ? acc.users
      : {
          ...acc.users,
          [minter.id]: minter,
        },
  };
};

const mapTransactionsToEntities = (transactions: TransactionOperation[]) => {
  const entities = transactions.reduce((acc, t: TransactionOperation) => {
    if (isUserTransaction(t)) return handleUserTransaction(acc, t);
    if (isProjectTransaction(t)) return handleProjectTransaction(acc, t);
    if (isGentkTransaction(t)) return handleGentkTransaction(acc, t);
    return acc;
  }, mapToEntitiesAcc);

  return {
    users: Object.values(entities.users),
    projects: Object.values(entities.projects),
    gentks: Object.values(entities.gentks),
  };
};

export { mapTransactionsToEntities };

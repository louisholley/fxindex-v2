import { TransactionOperation } from "@tzkt/sdk-api";
import { GENTK_V1, ISSUER_V0, USER_REGISTER } from "./constants";
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

const mapTransactionToProject = (t: ProjectTransaction) => {
  console.log(t);

  const {
    sender: { address, alias },
    parameter: {
      value: { issuer_id, price, royalties, enabled },
    },
  } = t;
  const project = new Project();
  project.id = issuer_id;
  project.price = price ? parseInt(price) : null;
  project.royalties = royalties ? parseInt(royalties) : null;
  project.enabled = enabled;

  const user = new User();
  user.id = address;
  user.alias = alias;

  project.creator = user;

  return [project, user];
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

const mapTransactionToGentk = ({
  parameter: {
    value: { address, metadata, token_id, issuer_id, iteration, royalties },
  },
}: GentkTransaction) => {
  const user = new User();
  user.id = address;

  const project = new Project();
  project.id = issuer_id;

  const gentk = new Gentk();
  gentk.id = token_id;
  gentk.project = project;
  gentk.minter = user;
  gentk.iteration = parseInt(iteration);
  gentk.royalties = parseInt(royalties);
  gentk.metadata = metadata;

  return [user, project, gentk];
};

const mapTransactionsToEntities = (transactions: TransactionOperation[]) =>
  transactions.reduce((acc, t: TransactionOperation) => {
    if (t.target.address === USER_REGISTER.contract)
      return [...acc, mapTransactionToUser(t)];
    if (t.target.address === ISSUER_V0.contract)
      return [...acc, ...mapTransactionToProject(t as ProjectTransaction)];
    if (t.target.address === GENTK_V1.contract)
      return [...acc, ...mapTransactionToGentk(t as GentkTransaction)];
  }, []);

export { mapTransactionsToEntities };

import hre, { ethers, artifacts } from 'hardhat';
import { expect } from 'chai';
import {
  DeployUpgradeFunc,
  NamedAddresses,
  SetupUpgradeFunc,
  TeardownUpgradeFunc,
  ValidateUpgradeFunc
} from '@custom-types/types';

/*

Pod Executor V2

Deploy and authorise a PodExecutor V2 which exposes the 
executeBatch() method

*/

const fipNumber = 'pod_executor_v2';

// Do any deployments
// This should exclusively include new contract deployments
const deploy: DeployUpgradeFunc = async (deployAddress: string, addresses: NamedAddresses, logging: boolean) => {
  const PodExecutorFactory = await ethers.getContractFactory('PodExecutor');
  const podExecutor = await PodExecutorFactory.deploy(addresses.core);
  await podExecutor.deployTransaction.wait();
  logging && console.log('Pod Executor deployed to: ', podExecutor.address);

  return {
    podExecutor
  };
};

// Do any setup necessary for running the test.
// This could include setting up Hardhat to impersonate accounts,
// ensuring contracts have a specific state, etc.
const setup: SetupUpgradeFunc = async (addresses, oldContracts, contracts, logging) => {
  console.log(`No actions to complete in setup for fip${fipNumber}`);
};

// Tears down any changes made in setup() that need to be
// cleaned up before doing any validation checks.
const teardown: TeardownUpgradeFunc = async (addresses, oldContracts, contracts, logging) => {
  console.log(`No actions to complete in teardown for fip${fipNumber}`);
};

// Run any validations required on the fip using mocha or console logging
// IE check balances, check state of contracts, etc.
const validate: ValidateUpgradeFunc = async (addresses, oldContracts, contracts, logging) => {
  // 1. Validate has EXECUTOR role
  // 2. Validate can executeBatch a transaction
  // 3. Validate can execute a transaction
};

export { deploy, setup, teardown, validate };

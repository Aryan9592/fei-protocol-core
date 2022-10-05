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

TIP_123

*/

const fipNumber = 'tip_123';

// Do any deployments
// This should exclusively include new contract deployments
const deploy: DeployUpgradeFunc = async (deployAddress: string, addresses: NamedAddresses, logging: boolean) => {
  // 1. Deploy DAOTimelockBurner, to burn admin of Fei and Rari DAO timelocks
  const DAOTimelockBurnerFactory = await ethers.getContractFactory('DAOTimelockBurner');
  const daoTimelockBurner = await DAOTimelockBurnerFactory.deploy();
  console.log('DAO timelock burner deployed to: ', daoTimelockBurner.address);

  const FeiTimelockBurnerFactory = await ethers.getContractFactory('FeiLinearTokenTimelockBurner');
  // 2. Deploy deprecated Rari FEI timelock burner
  const deprecatedRariFeiTimelockBurner = await FeiTimelockBurnerFactory.deploy(addresses.rariInfraFeiTimelock);
  console.log('Deprecated Rari FEI timelock burner deployed to: ', deprecatedRariFeiTimelockBurner.address);

  // 3. Deploy deprecated Rari TRIBE timelock burner
  const TribeTimelockedDelegatorBurnerFactory = await ethers.getContractFactory('TribeTimelockedDelegatorBurner');
  const deprecatedRariTribeTimelockBurner = await TribeTimelockedDelegatorBurnerFactory.deploy(
    addresses.rariInfraTribeTimelock
  );
  console.log('Deprecated Rari TRIBE timelock burned deployed to: ', deprecatedRariTribeTimelockBurner.address);

  // 4. Deploy Fei Labs burner
  const feiLabsTribeBurner = await TribeTimelockedDelegatorBurnerFactory.deploy(addresses.feiLabsVestingTimelock);
  console.log('Fei Labs TRIBE burner deployed to: ', feiLabsTribeBurner.address);

  return {
    daoTimelockBurner,
    deprecatedRariFeiTimelockBurner,
    deprecatedRariTribeTimelockBurner,
    feiLabsTribeBurner
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
  // 1. Verify Fei DAO timelock admin burned
  expect(await contracts.feiDAOTimelock.admin()).to.equal(addresses.daoTimelockBurner);

  // 2. Verify Rari Fei deprecated timelock burned
  expect(await contracts.rariInfraFeiTimelock.beneficiary()).to.equal(addresses.deprecatedRariFeiTimelockBurner);

  // 3. Verify Rari Tribe deprecated timelock burned
  expect(await contracts.rariInfraTribeTimelock.beneficiary()).to.equal(addresses.deprecatedRariTribeTimelockBurner);

  // 4. Verify Fei Labs Tribe timelock burned
  expect(await contracts.feiLabsVestingTimelock.beneficiary()).to.equal(addresses.feiLabsTribeBurner);

  // 4. Verify Tribe minter set to zero address and inflation is the minimum of 0.01% (1 basis point)
  expect(await contracts.tribe.minter()).to.equal(ethers.constants.AddressZero);
  expect(await contracts.tribeMinter.annualMaxInflationBasisPoints()).to.equal(1);
};

export { deploy, setup, teardown, validate };

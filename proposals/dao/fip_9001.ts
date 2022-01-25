import hre, { ethers, artifacts } from 'hardhat';
import { expect } from 'chai';
import {
  DeployUpgradeFunc,
  NamedAddresses,
  SetupUpgradeFunc,
  TeardownUpgradeFunc,
  ValidateUpgradeFunc
} from '@custom-types/types';
import { getImpersonatedSigner, time } from '@test/helpers';
import { forceEth } from '@test/integration/setup/utils';

/*

DAO Proposal #9001

Description:

Steps:
  1 -
  2 -
  3 -

*/

const fipNumber = '9001'; // Change me!
const DELEGATE_AAVE = '0x6ef71cA9cD708883E129559F5edBFb9d9D5C6148';
const DELEGATE_ANGLE = '0x6ef71cA9cD708883E129559F5edBFb9d9D5C6148';
const DELEGATE_COMP = '0x6ef71cA9cD708883E129559F5edBFb9d9D5C6148';
const DELEGATE_CVX = '0x6ef71cA9cD708883E129559F5edBFb9d9D5C6148';

// Do any deployments
// This should exclusively include new contract deployments
const deploy: DeployUpgradeFunc = async (deployAddress: string, addresses: NamedAddresses, logging: boolean) => {
  if (!addresses.core) {
    throw new Error('An environment variable contract address is not set');
  }

  const moverFactory = await ethers.getContractFactory('ERC20PermissionlessMover');
  const permissionlessPcvMover = await moverFactory.deploy(addresses.core);
  await permissionlessPcvMover.deployTransaction.wait();
  logging && console.log('permissionlessPcvMover: ', permissionlessPcvMover.address);

  const aaveDelegatorFactory = await ethers.getContractFactory('AaveDelegatorPCVDeposit');
  const aaveDelegatorPCVDeposit = await aaveDelegatorFactory.deploy(addresses.core, DELEGATE_AAVE);
  await aaveDelegatorPCVDeposit.deployTransaction.wait();
  logging && console.log('aaveDelegatorPCVDeposit: ', aaveDelegatorPCVDeposit.address);

  const angleDelegatorFactory = await ethers.getContractFactory('AngleDelegatorPCVDeposit');
  const angleDelegatorPCVDeposit = await angleDelegatorFactory.deploy(addresses.core, DELEGATE_ANGLE);
  await angleDelegatorPCVDeposit.deployTransaction.wait();
  logging && console.log('angleDelegatorPCVDeposit: ', angleDelegatorPCVDeposit.address);

  const delegatorFactory = await ethers.getContractFactory('DelegatorPCVDeposit');
  const compDelegatorPCVDeposit = await delegatorFactory.deploy(addresses.core, addresses.comp, DELEGATE_COMP);
  await compDelegatorPCVDeposit.deployTransaction.wait();
  logging && console.log('compDelegatorPCVDeposit: ', compDelegatorPCVDeposit.address);

  const convexDelegatorFactory = await ethers.getContractFactory('ConvexDelegatorPCVDeposit');
  const convexDelegatorPCVDeposit = await convexDelegatorFactory.deploy(addresses.core, DELEGATE_CVX);
  await convexDelegatorPCVDeposit.deployTransaction.wait();
  logging && console.log('convexDelegatorPCVDeposit: ', convexDelegatorPCVDeposit.address);

  return {
    aaveDelegatorPCVDeposit,
    angleDelegatorPCVDeposit,
    compDelegatorPCVDeposit,
    convexDelegatorPCVDeposit,
    permissionlessPcvMover
  };
};

// Do any setup necessary for running the test.
// This could include setting up Hardhat to impersonate accounts,
// ensuring contracts have a specific state, etc.
const setup: SetupUpgradeFunc = async (addresses, oldContracts, contracts, logging) => {
  // Whitelist our contract for vote-locking on Angle's governance
  logging && console.log('Whitelist angleDelegatorPCVDeposit as a smartwallet on Angle governance...');
  const ANGLE_MULTISIG_ADDRESS = '0xdC4e6DFe07EFCa50a197DF15D9200883eF4Eb1c8';
  await forceEth(ANGLE_MULTISIG_ADDRESS);
  const angleMultisigSigner = await getImpersonatedSigner(ANGLE_MULTISIG_ADDRESS);
  const abi = ['function approveWallet(address _wallet)'];
  const smartWalletCheckerInterface = new ethers.utils.Interface(abi);
  const encodeWhitelistingCall = smartWalletCheckerInterface.encodeFunctionData('approveWallet', [
    contracts.angleDelegatorPCVDeposit.address
  ]);
  await (
    await angleMultisigSigner.sendTransaction({
      data: encodeWhitelistingCall,
      to: '0xAa241Ccd398feC742f463c534a610529dCC5888E' // SmartWalletChecker
    })
  ).wait();
  logging && console.log('Whitelisted angleDelegatorPCVDeposit as a smartwallet on Angle governance.');
};

// Tears down any changes made in setup() that need to be
// cleaned up before doing any validation checks.
const teardown: TeardownUpgradeFunc = async (addresses, oldContracts, contracts, logging) => {
  console.log(`No actions to complete in teardown for fip${fipNumber}`);
};

// Run any validations required on the fip using mocha or console logging
// IE check balances, check state of contracts, etc.
const validate: ValidateUpgradeFunc = async (addresses, oldContracts, contracts, logging) => {
  const daoSigner = await getImpersonatedSigner(contracts.feiDAOTimelock.address);
  await forceEth(contracts.feiDAOTimelock.address);

  // Validate delegatees
  expect(await contracts.aaveDelegatorPCVDeposit.delegate()).to.be.equal(DELEGATE_AAVE);
  expect(await contracts.angleDelegatorPCVDeposit.delegate()).to.be.equal(DELEGATE_ANGLE);
  expect(await contracts.compDelegatorPCVDeposit.delegate()).to.be.equal(DELEGATE_COMP);
  expect(await contracts.convexDelegatorPCVDeposit.delegate()).to.be.equal(DELEGATE_CVX);

  console.log('========== Move all our gov tokens to delegators ==========');
  await contracts.permissionlessPcvMover.move(contracts.crv.address, contracts.d3poolConvexPCVDeposit.address);
  await contracts.permissionlessPcvMover.move(contracts.cvx.address, contracts.d3poolConvexPCVDeposit.address);
  await contracts.permissionlessPcvMover.move(contracts.comp.address, contracts.compoundEthPCVDeposit.address);
  await contracts.permissionlessPcvMover.move(contracts.comp.address, contracts.compoundDaiPCVDeposit.address);
  await contracts.permissionlessPcvMover.move(contracts.stkaave.address, contracts.aaveEthPCVDeposit.address);
  await contracts.permissionlessPcvMover.move(contracts.stkaave.address, contracts.aaveRaiPCVDeposit.address);
  console.log(
    'Aave delegator AAVE balance',
    (await contracts.aave.balanceOf(contracts.aaveDelegatorPCVDeposit.address)) / 1e18
  );
  console.log(
    'Aave delegator stkAAVE balance',
    (await contracts.stkaave.balanceOf(contracts.aaveDelegatorPCVDeposit.address)) / 1e18
  );
  console.log(
    'Angle delegator ANGLE balance',
    (await contracts.angle.balanceOf(contracts.angleDelegatorPCVDeposit.address)) / 1e18
  );
  console.log(
    'Compound delegator COMP balance',
    (await contracts.comp.balanceOf(contracts.compDelegatorPCVDeposit.address)) / 1e18
  );
  console.log(
    'Convex delegator CVX balance',
    (await contracts.cvx.balanceOf(contracts.convexDelegatorPCVDeposit.address)) / 1e18
  );
  console.log(
    'Convex delegator CRV balance',
    (await contracts.crv.balanceOf(contracts.convexDelegatorPCVDeposit.address)) / 1e18
  );

  // Aave game
  console.log('========== Aave game ==========');
  console.log('claimRewards()');
  await contracts.aaveDelegatorPCVDeposit.claimRewards();
  console.log(
    'Aave delegator AAVE balance',
    (await contracts.aave.balanceOf(contracts.aaveDelegatorPCVDeposit.address)) / 1e18
  );
  console.log(
    'Aave delegator stkAAVE balance',
    (await contracts.stkaave.balanceOf(contracts.aaveDelegatorPCVDeposit.address)) / 1e18
  );
  console.log('start stkAAVE -> AAVE cooldown [as governor]');
  await contracts.aaveDelegatorPCVDeposit.connect(daoSigner).cooldown();
  console.log('cooldown started. fast-forwarding 10 days');
  await time.increase(10 * 24 * 3600);
  console.log('unstaking stkAAVE to AAVE');
  await contracts.aaveDelegatorPCVDeposit.unstakeAave();
  console.log(
    'Aave delegator AAVE balance',
    (await contracts.aave.balanceOf(contracts.aaveDelegatorPCVDeposit.address)) / 1e18
  );
  console.log(
    'Aave delegator stkAAVE balance',
    (await contracts.stkaave.balanceOf(contracts.aaveDelegatorPCVDeposit.address)) / 1e18
  );
  console.log('stake AAVE to stkAAVE');
  await contracts.aaveDelegatorPCVDeposit.stakeAave();
  console.log(
    'Aave delegator AAVE balance',
    (await contracts.aave.balanceOf(contracts.aaveDelegatorPCVDeposit.address)) / 1e18
  );
  console.log(
    'Aave delegator stkAAVE balance',
    (await contracts.stkaave.balanceOf(contracts.aaveDelegatorPCVDeposit.address)) / 1e18
  );

  // Comp delegation check
  console.log('========== Compound game ==========');
  console.log('comp.getCurrentVotes(DELEGATE_COMP)', (await contracts.comp.getCurrentVotes(DELEGATE_COMP)) / 1e18);

  // Angle game
  console.log('========== Angle game ==========');
  console.log('Vote-locking ANGLE...');
  await contracts.angleDelegatorPCVDeposit.lock();
  console.log('Vote-locked ANGLE.');
  console.log(
    'angleDelegatorPCVDeposit ANGLE balance',
    (await contracts.angle.balanceOf(contracts.angleDelegatorPCVDeposit.address)) / 1e18
  );
  console.log(
    'angleDelegatorPCVDeposit veANGLE balance',
    (await contracts.veAngle.balanceOf(contracts.angleDelegatorPCVDeposit.address)) / 1e18
  );
  console.log('ff 1 year');
  await time.increase(365 * 24 * 3600);
  console.log(
    'angleDelegatorPCVDeposit ANGLE balance',
    (await contracts.angle.balanceOf(contracts.angleDelegatorPCVDeposit.address)) / 1e18
  );
  console.log(
    'angleDelegatorPCVDeposit veANGLE balance',
    (await contracts.veAngle.balanceOf(contracts.angleDelegatorPCVDeposit.address)) / 1e18
  );
  console.log('prolong locking period');
  await contracts.angleDelegatorPCVDeposit.lock();
  console.log(
    'angleDelegatorPCVDeposit ANGLE balance',
    (await contracts.angle.balanceOf(contracts.angleDelegatorPCVDeposit.address)) / 1e18
  );
  console.log(
    'angleDelegatorPCVDeposit veANGLE balance',
    (await contracts.veAngle.balanceOf(contracts.angleDelegatorPCVDeposit.address)) / 1e18
  );
  console.log('ff 4 years');
  await time.increase(4 * 365 * 24 * 3600);
  console.log(
    'angleDelegatorPCVDeposit ANGLE balance',
    (await contracts.angle.balanceOf(contracts.angleDelegatorPCVDeposit.address)) / 1e18
  );
  console.log(
    'angleDelegatorPCVDeposit veANGLE balance',
    (await contracts.veAngle.balanceOf(contracts.angleDelegatorPCVDeposit.address)) / 1e18
  );
  console.log('exitLock()');
  console.log(
    'angleDelegatorPCVDeposit ANGLE balance',
    (await contracts.angle.balanceOf(contracts.angleDelegatorPCVDeposit.address)) / 1e18
  );
  console.log(
    'angleDelegatorPCVDeposit veANGLE balance',
    (await contracts.veAngle.balanceOf(contracts.angleDelegatorPCVDeposit.address)) / 1e18
  );
  console.log('lock()');
  await contracts.angleDelegatorPCVDeposit.lock();
  console.log(
    'angleDelegatorPCVDeposit ANGLE balance',
    (await contracts.angle.balanceOf(contracts.angleDelegatorPCVDeposit.address)) / 1e18
  );
  console.log(
    'angleDelegatorPCVDeposit veANGLE balance',
    (await contracts.veAngle.balanceOf(contracts.angleDelegatorPCVDeposit.address)) / 1e18
  );
  console.log('gauge stuff - todo');

  // Convex game
  console.log('========== Convex game ==========');
  console.log('todo');

  // TODO: additional checks
  console.log('done');
  expect(false).to.be.true;
};

export { deploy, setup, teardown, validate };

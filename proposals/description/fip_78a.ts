import { ProposalDescription } from '@custom-types/types';

const fip_9001: ProposalDescription = {
  title: 'FIP-9001: Metagov update [find a cool name]',
  commands: [
    {
      target: 'core',
      values: '0',
      method: 'createRole(bytes32,bytes32)',
      arguments: [
        '0xb02f76effb323167cad756bb4f3edbfb9d9291f9bfcdc72c9ceea005562f32eb',
        '0x899bd46557473cb80307a9dabc297131ced39608330a2d29b2d52b660c03923e'
      ],
      description: 'Create METAGOVERNANCE_VOTE_ADMIN Role'
    },
    {
      target: 'indexDelegator',
      values: '0',
      method: 'setContractAdminRole(bytes32)',
      arguments: ['0xb02f76effb323167cad756bb4f3edbfb9d9291f9bfcdc72c9ceea005562f32eb'],
      description: 'Set INDEX delegator Contract Admin Role to METAGOVERNANCE_VOTE_ADMIN'
    },
    {
      target: 'core',
      values: '0',
      method: 'grantRole(bytes32,address)',
      arguments: ['0xb02f76effb323167cad756bb4f3edbfb9d9291f9bfcdc72c9ceea005562f32eb', '{feiDAOTimelock}'],
      description: 'Grant METAGOVERNANCE_VOTE_ADMIN Role to DAO Timelock'
    },
    {
      target: 'core',
      values: '0',
      method: 'grantRole(bytes32,address)',
      arguments: ['0xb02f76effb323167cad756bb4f3edbfb9d9291f9bfcdc72c9ceea005562f32eb', '{opsOptimisticTimelock}'],
      description: 'Grant METAGOVERNANCE_VOTE_ADMIN Role to OPS OA Timelock'
    },
    {
      target: 'core',
      values: '0',
      method: 'createRole(bytes32,bytes32)',
      arguments: [
        '0xa100760f521bbb2848bef0b72ea29301f6a6b0605d004243f0eea2b1c359f7c7',
        '0x899bd46557473cb80307a9dabc297131ced39608330a2d29b2d52b660c03923e'
      ],
      description: 'Create METAGOVERNANCE_TOKEN_STAKING Role'
    },
    {
      target: 'core',
      values: '0',
      method: 'grantRole(bytes32,address)',
      arguments: ['0xa100760f521bbb2848bef0b72ea29301f6a6b0605d004243f0eea2b1c359f7c7', '{feiDAOTimelock}'],
      description: 'Grant METAGOVERNANCE_TOKEN_STAKING Role to DAO Timelock'
    },
    {
      target: 'core',
      values: '0',
      method: 'grantRole(bytes32,address)',
      arguments: ['0xa100760f521bbb2848bef0b72ea29301f6a6b0605d004243f0eea2b1c359f7c7', '{opsOptimisticTimelock}'],
      description: 'Grant METAGOVERNANCE_TOKEN_STAKING Role to OPS OA Timelock'
    },
    {
      target: 'core',
      values: '0',
      method: 'createRole(bytes32,bytes32)',
      arguments: [
        '0x3bee38c33241595abfefa470fd75bfa1cc9cb01eff02cf6732fd2baea4ea4241',
        '0x899bd46557473cb80307a9dabc297131ced39608330a2d29b2d52b660c03923e'
      ],
      description: 'Create METAGOVERNANCE_GAUGE_ADMIN Role'
    },
    {
      target: 'core',
      values: '0',
      method: 'grantRole(bytes32,address)',
      arguments: ['0x3bee38c33241595abfefa470fd75bfa1cc9cb01eff02cf6732fd2baea4ea4241', '{feiDAOTimelock}'],
      description: 'Grant METAGOVERNANCE_GAUGE_ADMIN Role to DAO Timelock'
    },
    {
      target: 'core',
      values: '0',
      method: 'grantRole(bytes32,address)',
      arguments: ['0x3bee38c33241595abfefa470fd75bfa1cc9cb01eff02cf6732fd2baea4ea4241', '{opsOptimisticTimelock}'],
      description: 'Grant METAGOVERNANCE_GAUGE_ADMIN Role to OPS OA Timelock'
    },
    {
      target: 'core',
      values: '0',
      method: 'createRole(bytes32,bytes32)',
      arguments: [
        '0x17e41050a125542bb55c978885d43a19f95997bb3a31eef70860f3fd3c038c50',
        '0x899bd46557473cb80307a9dabc297131ced39608330a2d29b2d52b660c03923e'
      ],
      description: 'Create METAGOVERNANCE_GAUGE_STAKING Role'
    },
    {
      target: 'core',
      values: '0',
      method: 'grantRole(bytes32,address)',
      arguments: ['0x17e41050a125542bb55c978885d43a19f95997bb3a31eef70860f3fd3c038c50', '{feiDAOTimelock}'],
      description: 'Grant METAGOVERNANCE_GAUGE_STAKING Role to DAO Timelock'
    },
    {
      target: 'core',
      values: '0',
      method: 'grantRole(bytes32,address)',
      arguments: ['0x17e41050a125542bb55c978885d43a19f95997bb3a31eef70860f3fd3c038c50', '{opsOptimisticTimelock}'],
      description: 'Grant METAGOVERNANCE_GAUGE_STAKING Role to OPS OA Timelock'
    },
    {
      target: 'ratioPCVControllerV2',
      values: '0',
      method: 'withdrawRatioERC20',
      arguments: [
        '{agEurAngleUniswapPCVDeposit}', // deposit
        '{angle}', // token
        '{angleDelegatorPCVDeposit}', // to
        '10000' // basis poins
      ],
      description: 'Move all ANGLE tokens to the new Angle deposit'
    },
    {
      target: 'ratioPCVControllerV2',
      values: '0',
      method: 'withdrawRatio(address,address,uint256)',
      arguments: ['{agEurAngleUniswapPCVDeposit}', '{agEurUniswapPCVDeposit}', '10000'],
      description: 'Move all agEUR from old to new deposit'
    },
    {
      target: 'core',
      values: '0',
      method: 'revokeMinter(address)',
      arguments: ['{agEurAngleUniswapPCVDeposit}'],
      description: 'Revoke Minter from old Angle deposit'
    },
    {
      target: 'fei',
      values: '0',
      method: 'mint(address,uint256)',
      arguments: ['{agEurUniswapPCVDeposit}', '10050000000000000000000000'],
      description: 'Mint 10.05M FEI on the new agEUR Uniswap deposit'
    },
    {
      target: 'agEurUniswapPCVDeposit',
      values: '0',
      method: 'deposit()',
      arguments: [],
      description: 'Deposit agEUR/FEI to Uniswap v2'
    },
    {
      target: 'ratioPCVControllerV2',
      values: '0',
      method: 'withdrawRatioERC20',
      arguments: [
        '{agEurUniswapPCVDeposit}', // deposit
        '{angleAgEurFeiPool}', // token
        '{angleDelegatorPCVDeposit}', // to
        '10000' // basis poins
      ],
      description: 'Move all Uni-v2 LP tokens to the new Angle delegator deposit'
    },
    {
      target: 'angleDelegatorPCVDeposit',
      values: '0',
      method: 'lock()',
      arguments: [],
      description: 'Vote-lock ANGLE to veANGLE'
    },
    {
      target: 'angleDelegatorPCVDeposit',
      values: '0',
      method: 'setTokenToGauge(address,address)',
      arguments: [
        '{angleAgEurFeiPool}', // token address
        '{angleGaugeUniswapV2FeiAgEur}' // gauge address
      ],
      description: 'Set Uniswap-v2 agEUR/FEI pool tokens gauge address'
    },
    {
      target: 'angleDelegatorPCVDeposit',
      values: '0',
      method: 'voteForGaugeWeight(address,uint256)',
      arguments: [
        '{angleAgEurFeiPool}', // token address
        '10000' // weight
      ],
      description: 'Vote 100% weight for the FEI/agEUR Uniswap-v2 pool gauge'
    },
    {
      target: 'angleDelegatorPCVDeposit',
      values: '0',
      method: 'stakeAllInGauge(address)',
      arguments: [
        '{angleAgEurFeiPool}' // token
      ],
      description: 'Stake all Uni-v2 LP tokens in gauge'
    }
  ],
  description: `

TODO
`
};

export default fip_9001;

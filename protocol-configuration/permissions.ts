export const permissions = {
  MINTER_ROLE: [
    'uniswapPCVDeposit',
    'feiDAOTimelock',
    'dpiUniswapPCVDeposit',
    'pcvEquityMinter',
    'collateralizationOracleKeeper',
    'optimisticMinter',
    'daiFixedPricePSM',
    'ethPSM',
    'lusdPSM',
    'balancerDepositFeiWeth'
  ],
  BURNER_ROLE: [],
  GOVERN_ROLE: ['core', 'feiDAOTimelock', 'roleBastion'],
  PCV_CONTROLLER_ROLE: [
    'feiDAOTimelock',
    'ratioPCVControllerV2',
    'aaveEthPCVDripController',
    'pcvGuardian',
    'daiPCVDripController',
    'lusdPCVDripController',
    'ethPSMFeiSkimmer',
    'lusdPSMFeiSkimmer'
  ],
  GUARDIAN_ROLE: ['multisig', 'pcvGuardian', 'pcvSentinel'],
  ORACLE_ADMIN_ROLE: [
    'collateralizationOracleGuardian',
    'optimisticTimelock',
    'opsOptimisticTimelock',
    'tribalCouncilTimelock'
  ],
  SWAP_ADMIN_ROLE: ['pcvEquityMinter', 'optimisticTimelock'],
  BALANCER_MANAGER_ADMIN_ROLE: [],
  PSM_ADMIN_ROLE: [],
  TRIBAL_CHIEF_ADMIN_ROLE: ['optimisticTimelock', 'tribalChiefSyncV2'],
  FUSE_ADMIN: ['optimisticTimelock', 'tribalChiefSyncV2'],
  VOTIUM_ADMIN_ROLE: ['opsOptimisticTimelock', 'protocolPodTimelock'],
  PCV_GUARDIAN_ADMIN_ROLE: ['optimisticTimelock'],
  METAGOVERNANCE_VOTE_ADMIN: ['feiDAOTimelock', 'opsOptimisticTimelock'],
  METAGOVERNANCE_TOKEN_STAKING: ['feiDAOTimelock', 'opsOptimisticTimelock'],
  METAGOVERNANCE_GAUGE_ADMIN: ['feiDAOTimelock', 'optimisticTimelock'],
  ROLE_ADMIN: ['feiDAOTimelock', 'tribalCouncilTimelock'],
  POD_METADATA_REGISTER_ROLE: ['tribalCouncilSafe'],
  FEI_MINT_ADMIN: ['core', 'feiDAOTimelock', 'roleBastion'],
  POD_VETO_ADMIN: ['nopeDAO'],
  POD_ADMIN: ['tribalCouncilTimelock', 'podFactory'],
  PCV_MINOR_PARAM_ROLE: ['core', 'feiDAOTimelock', 'roleBastion', 'optimisticTimelock', 'opsOptimisticTimelock'],
  TOKEMAK_DEPOSIT_ADMIN_ROLE: ['optimisticTimelock']
};

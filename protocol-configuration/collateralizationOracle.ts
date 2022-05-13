const collateralizationAddresses = {
  fei: [
    'feiOATimelockWrapper',
    'rariPool8FeiPCVDepositWrapper',
    'rariPool6FeiPCVDepositWrapper',
    'rariPool19FeiPCVDepositWrapper',
    'rariPool24FeiPCVDepositWrapper',
    'rariPool27FeiPCVDepositWrapper',
    'rariPool18FeiPCVDepositWrapper',
    'rariPool90FeiPCVDepositWrapper',
    'aaveFeiPCVDepositWrapper',
    'rariPool79FeiPCVDepositWrapper',
    'rariPool128FeiPCVDepositWrapper',
    'rariPool22FeiPCVDepositWrapper',
    'feiBuybackLensNoFee',
    'convexPoolPCVDepositWrapper',
    'compoundFeiPCVDepositWrapper',
    'turboFusePCVDeposit'
  ],
  lusd: ['rariPool7LusdPCVDeposit', 'bammDeposit', 'lusdPSM', 'rariPool8LusdPCVDeposit'],
  dai: ['compoundDaiPCVDepositWrapper', 'daiFixedPricePSM', 'rariPool8DaiPCVDeposit', 'dpiToDaiLensDai'],
  usd: ['namedStaticPCVDepositWrapper', 'd3poolCurvePCVDeposit', 'd3poolConvexPCVDeposit'],
  bal: ['balancerDepositBalWeth', 'balancerLensVeBalBal'],
  cream: ['creamDepositWrapper'],
  weth: [
    'ethLidoPCVDepositWrapper',
    'compoundEthPCVDepositWrapper',
    'aaveEthPCVDepositWrapper',
    'uniswapPCVDeposit',
    'ethTokemakPCVDeposit',
    'ethPSM',
    'rariPool146EthPCVDeposit',
    'wethDepositWrapper',
    'balancerDepositFeiWeth',
    'balancerLensBpt30Fei70Weth',
    'balancerLensVeBalWeth'
  ],
  dpi: ['dpiToDaiLensDpi'],
  rai: ['raiPriceBoundPSM'],
  agEUR: ['agEurDepositWrapper', 'uniswapLensAgEurUniswapGauge', 'agEurUniswapPCVDeposit'],
  volt: ['voltDepositWrapper']
};

export default collateralizationAddresses;

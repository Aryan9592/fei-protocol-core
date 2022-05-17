import { ProposalCategory, ProposalsConfigMap } from '@custom-types/types';

import fip_105 from '@proposals/description/fip_105';
import swap_dpi_to_dai from '@proposals/description/swap_dpi_to_dai';
import liquidate_cream from '@proposals/description/liquidate_cream';
// import fip_xx_proposal from '@proposals/description/fip_xx';

const proposals: ProposalsConfigMap = {
  fip_105: {
    deploy: false, // deploy flag for whether to run deploy action during e2e tests or use mainnet state
    totalValue: 0, // amount of ETH to send to DAO execution
    proposal: fip_105, // full proposal file, imported from '@proposals/description/fip_xx.ts'
    proposalId: '',
    affectedContractSignoff: ['daiFixedPricePSMFeiSkimmer', 'core'],
    deprecatedContractSignoff: [],
    category: ProposalCategory.DAO
  },
  swap_dpi_to_dai: {
    deploy: true,
    proposalId: null,
    affectedContractSignoff: ['dpi', 'compoundDaiPCVDeposit', 'dpiToDaiSwapper', 'dpiToDaiLensDai', 'dpiToDaiLensDpi'],
    deprecatedContractSignoff: [
      'rariPool31FeiPCVDepositWrapper',
      'rariPool25FeiPCVDepositWrapper',
      'rariPool9RaiPCVDepositWrapper',
      'aaveRaiPCVDepositWrapper',
      'rariPool19DpiPCVDepositWrapper',
      'liquityFusePoolLusdPCVDeposit',
      'rariPool72FeiPCVDepositWrapper',
      'raiDepositWrapper',
      'rariPool31FeiPCVDeposit',
      'rariPool25FeiPCVDeposit',
      'rariPool9RaiPCVDeposit',
      'aaveRaiPCVDeposit',
      'rariPool19DpiPCVDeposit',
      'rariPool72FeiPCVDeposit',
      'dpiDepositWrapper'
    ],
    category: ProposalCategory.DAO,
    totalValue: 0,
    proposal: swap_dpi_to_dai
  },
  liquidate_cream: {
    deploy: true,
    totalValue: 0,
    proposal: liquidate_cream,
    proposalId: '',
    affectedContractSignoff: ['creamSushiswapSwapper', 'feiDAOTimelock', 'cream'],
    deprecatedContractSignoff: [],
    category: ProposalCategory.DAO
  }
};

export default proposals;

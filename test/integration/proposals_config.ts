import { ProposalCategory, ProposalsConfigMap } from '@custom-types/types';

import oa_cr_fix from '@proposals/description/oa_cr_fix';
import fip_82b from '@proposals/description/fip_82b';

// import fip_xx_proposal from '@proposals/description/fip_xx';

const proposals: ProposalsConfigMap = {
  /*
    fip_xx: {
      deploy: true, // deploy flag for whether to run deploy action during e2e tests or use mainnet state
      totalValue: 0, // amount of ETH to send to DAO execution
      proposal: fip_xx, // full proposal file, imported from '@proposals/description/fip_xx.ts'
      proposalId: '',
      affectedContractSignoff: [''],
      deprecatedContractSignoff: [''],
      category: ProposalCategory.DAO
    }
    */
  fip_82b: {
    deploy: false, // deploy flag for whether to run deploy action during e2e tests or use mainnet state
    totalValue: 0, // amount of ETH to send to DAO execution
    proposal: fip_82b,
    proposalId: '',
    affectedContractSignoff: [
      'core',
      'fuseGuardian',
      'optimisticMinter',
      'pcvEquityMinter',
      'indexDelegator',
      'ethTokemakPCVDeposit',
      'uniswapPCVDeposit',
      'lusdPSMFeiSkimmer',
      'ethPSMFeiSkimmer',
      'aaveEthPCVDripController',
      'daiPCVDripController',
      'lusdPCVDripController',
      'tribalCouncilTimelock',
      'feiDAOTimelock',
      'roleBastion',
      'pcvGuardianNew',
      'pcvGuardian',
      'opsOptimisticTimelock',
      'optimisticTimelock',
      'tribalChiefSyncV2'
    ],
    deprecatedContractSignoff: [],
    category: ProposalCategory.DAO
  },
  oa_cr_fix: {
    deploy: false, // deploy flag for whether to run deploy action during e2e tests or use mainnet state
    totalValue: 0, // amount of ETH to send to DAO execution
    proposal: oa_cr_fix, // full proposal file, imported from '@proposals/description/fip_xx.ts'
    proposalId: '',
    affectedContractSignoff: [],
    deprecatedContractSignoff: [],
    category: ProposalCategory.OA
  }
};

export default proposals;

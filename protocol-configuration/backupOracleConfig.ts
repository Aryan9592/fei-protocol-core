import { ethers } from 'hardhat';
import { BigNumberish } from 'ethers';

const toBN = ethers.BigNumber.from;
const BNe18 = (x: any) => ethers.constants.WeiPerEther.mul(toBN(x));

export const daiUsdcBackupOracleConfig: BackupOracleConfig = {
  twapPeriod: 600, // 10 minutes
  minPoolLiquidity: 50e6, // 50m
  uniswapPool: '0x5777d92f208679DB4b9778590Fa3CAB3aC9e2168',
  precision: BNe18(1)
};

export const ethUsdcBackupOracleConfig: BackupOracleConfig = {
  twapPeriod: 600, // 10 minutes
  minPoolLiquidity: 50e6, // 50m
  uniswapPool: '0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8',
  precision: BNe18(1)
};

export type BackupOracleConfig = {
  twapPeriod: number;
  minPoolLiquidity: number;
  uniswapPool: string;
  precision: BigNumberish;
};

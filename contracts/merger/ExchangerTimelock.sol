//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IExchanger {
    function exchange(uint256 amount) external;
}

/** 
 @title Send RGT straight to TRIBE timelock
 @author Joey Santoro
 @notice For Rari core contributors to trustlessly maintain incentive alignment
*/
contract ExchangerTimelock is Ownable {   
    using SafeERC20 for IERC20;

    IExchanger public immutable exchanger;
    address public immutable timelock;

    /// @notice guardian multisig
    address public constant guardian = 0xB8f482539F2d3Ae2C9ea6076894df36D1f632775;

    IERC20 public constant rgt =
        IERC20(0xD291E7a03283640FDc51b121aC401383A46cC623);
    IERC20 public constant tribe =
        IERC20(0xc7283b66Eb1EB5FB86327f08e1B5816b0720212B);

    constructor(IExchanger _exchanger, address _timelock) {
        exchanger = _exchanger;
        timelock = _timelock;
    }

    /// @notice exchange RGT to TRIBE and send to timelock
    function exchangeToTimelock() public {
        uint256 rgtBalance = rgt.balanceOf(address(this));

        rgt.approve(address(exchanger), rgtBalance);
        exchanger.exchange(rgtBalance);

        assert(rgt.balanceOf(address(this)) == 0);

        uint256 tribeBalance = tribe.balanceOf(address(this));

        tribe.safeTransfer(timelock, tribeBalance);

        assert(tribe.balanceOf(address(this)) == 0);
    }

    /// @notice guardian sends back RGT
    function recoverRGT() public {
        require(msg.sender == guardian);
        uint256 rgtBalance = rgt.balanceOf(address(this));
        rgt.transfer(owner(), rgtBalance);
    }
}   
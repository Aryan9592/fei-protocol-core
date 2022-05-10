// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.0;

import {TimelockController} from "@openzeppelin/contracts/governance/TimelockController.sol";
import {ControllerV1} from "@orcaprotocol/contracts/contracts/ControllerV1.sol";
import {MemberToken} from "@orcaprotocol/contracts/contracts/MemberToken.sol";
import {IGnosisSafe} from "../../../pods/interfaces/IGnosisSafe.sol";
import {PodFactory} from "../../../pods/PodFactory.sol";
import {PodExecutor} from "../../../pods/PodExecutor.sol";
import {IPodFactory} from "../../../pods/interfaces/IPodFactory.sol";
import {Core} from "../../../core/Core.sol";
import {TribeRoles} from "../../../core/TribeRoles.sol";
import {PodAdminGateway} from "../../../pods/PodAdminGateway.sol";

import {DSTest} from "../../utils/DSTest.sol";
import {mintOrcaTokens, getPodParamsWithTimelock, getCouncilPodParams, getPodParamsWithNoTimelock} from "../fixtures/Orca.sol";
import {DummyStorage} from "../../utils/Fixtures.sol";
import {Vm} from "../../utils/Vm.sol";
import {MainnetAddresses} from "../fixtures/MainnetAddresses.sol";

/// @notice Validate full pod operation including scheduling a transaction in the timelock and having the
///         podExecutor execute it
contract PodOperationIntegrationTest is DSTest {
    Vm public constant vm = Vm(HEVM_ADDRESS);

    DummyStorage dummyContract;
    TimelockController timelockContract;
    IPodFactory.PodConfig podConfig;
    PodExecutor podExecutor;

    address feiDAOTimelock = MainnetAddresses.FEI_DAO_TIMELOCK;
    address core = MainnetAddresses.CORE;
    address memberToken = MainnetAddresses.MEMBER_TOKEN;
    address podController = MainnetAddresses.ORCA_POD_CONTROLLER_V1_2;

    address podAdmin;
    address safe;
    address podTimelock;

    function setUp() public {
        vm.warp(1);
        vm.roll(1);

        // 1. Deploy Dummy contract to perform a transaction on
        dummyContract = new DummyStorage();
        assertEq(dummyContract.getVariable(), 5);

        // 2. Deploy podExecutor
        podExecutor = new PodExecutor(core);

        // 3. Deploy factory
        PodFactory factory = new PodFactory(core, memberToken, podController, address(podExecutor));
        PodAdminGateway podAdminGateway = new PodAdminGateway(core, memberToken, address(factory));
        podAdmin = address(podAdminGateway);

        mintOrcaTokens(address(factory), 2, vm);

        // Grant factory the PodAdmin role, to by default disable pod membership transfers
        vm.startPrank(feiDAOTimelock);
        Core(core).createRole(TribeRoles.POD_ADMIN, TribeRoles.GOVERNOR);
        Core(core).grantRole(TribeRoles.POD_ADMIN, address(factory));
        vm.stopPrank();

        podConfig = getPodParamsWithTimelock(podAdmin);
        vm.prank(feiDAOTimelock);
        (, podTimelock, safe) = factory.createOptimisticPod(podConfig);

        timelockContract = TimelockController(payable(podTimelock));
    }

    /// @notice Validate that can create a transaction in the pod and that it progresses to the timelock
    function testCreateAndExecutePodTransaction() public {
        // Schedule a transaction from the Pod's safe address to timelock. Transaction sets a variable on a dummy contract
        uint256 newDummyContractVar = 10;
        bytes memory timelockExecutionTxData = abi.encodePacked(
            bytes4(keccak256(bytes("setVariable(uint256)"))),
            newDummyContractVar
        );

        vm.prank(safe);
        timelockContract.schedule(
            address(dummyContract),
            0,
            timelockExecutionTxData,
            bytes32(0),
            bytes32("1"),
            podConfig.minDelay
        );

        // 4. Validate that transaction is in timelock
        bytes32 txHash = timelockContract.hashOperation(
            address(dummyContract),
            0,
            timelockExecutionTxData,
            bytes32(0),
            bytes32("1")
        );
        assertTrue(timelockContract.isOperationPending(txHash));

        // 5. Fast forward to execution time in timelock
        vm.warp(podConfig.minDelay + 10);
        vm.roll(podConfig.minDelay + 10);

        // 6. Execute transaction and validate state is updated
        podExecutor.execute(podTimelock, address(dummyContract), 0, timelockExecutionTxData, bytes32(0), bytes32("1"));

        assertTrue(timelockContract.isOperationDone(txHash));
        assertEq(dummyContract.getVariable(), newDummyContractVar);
    }

    /// @notice Validate that can batch execute transactions from a pod
    function testBatchExecutePodTransactions() public {
        // Schedule a transaction from the Pod's safe address to timelock. Transaction sets a variable on a dummy contract
        uint256 newDummyContractVarA = 10;
        bytes memory timelockExecutionTxDataA = abi.encodePacked(
            bytes4(keccak256(bytes("setVariable(uint256)"))),
            newDummyContractVarA
        );

        vm.prank(safe);
        timelockContract.schedule(
            address(dummyContract),
            0,
            timelockExecutionTxDataA,
            bytes32(0),
            bytes32("1"),
            podConfig.minDelay
        );

        uint256 newDummyContractVarB = 20;
        bytes memory timelockExecutionTxDataB = abi.encodePacked(
            bytes4(keccak256(bytes("setVariable(uint256)"))),
            newDummyContractVarB
        );

        vm.prank(safe);
        timelockContract.schedule(
            address(dummyContract),
            0,
            timelockExecutionTxDataB,
            bytes32(0),
            bytes32("1"),
            podConfig.minDelay
        );

        // 4. Validate that transaction is in timelock
        bytes32 txHashA = timelockContract.hashOperation(
            address(dummyContract),
            0,
            timelockExecutionTxDataA,
            bytes32(0),
            bytes32("1")
        );
        assertTrue(timelockContract.isOperationPending(txHashA));

        bytes32 txHashB = timelockContract.hashOperation(
            address(dummyContract),
            0,
            timelockExecutionTxDataB,
            bytes32(0),
            bytes32("1")
        );
        assertTrue(timelockContract.isOperationPending(txHashB));

        // 5. Fast forward to execution time in timelock
        vm.warp(podConfig.minDelay + 10);
        vm.roll(podConfig.minDelay + 10);

        // 6. Execute transaction and validate state is updated
        address[] memory timelocks = new address[](2);
        timelocks[0] = podTimelock;
        timelocks[1] = podTimelock;

        address[] memory targets = new address[](2);
        targets[0] = address(dummyContract);
        targets[1] = address(dummyContract);

        uint256[] memory values = new uint256[](2);
        values[0] = 0;
        values[1] = 0;

        bytes[] memory txDatas = new bytes[](2);
        txDatas[0] = timelockExecutionTxDataA;
        txDatas[1] = timelockExecutionTxDataB;

        bytes32[] memory predecessors = new bytes32[](2);
        predecessors[0] = bytes32(0);
        predecessors[1] = bytes32(0);

        bytes32[] memory salts = new bytes32[](2);
        salts[0] = bytes32("1");
        salts[1] = bytes32("1");

        podExecutor.executeBatch(timelocks, targets, values, txDatas, predecessors, salts);

        assertTrue(timelockContract.isOperationDone(txHashA));
        assertTrue(timelockContract.isOperationDone(txHashB));

        // Final updated value should be dummy value B
        assertEq(dummyContract.getVariable(), newDummyContractVarB);
    }
}

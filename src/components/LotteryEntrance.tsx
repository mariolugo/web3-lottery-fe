"use client";

import { abi, contractAddresses } from "@/constants";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { useNotification } from "web3uikit"

export function LotteryEntrance() {
  const [entranceFee, setEntranceFee] = useState("0");
  const [numberOfPlayers, setNumberOfPlayers] = useState("0");
  const [recentWinner, setRecentWinner] = useState("0");

  const dispatch = useNotification()

  const {
    chainId: chainIdHex,
    isWeb3Enabled,
    isWeb3EnableLoading,
  } = useMoralis();
  const chainId = parseInt(chainIdHex ?? "0");
  const raffleAddress =
    chainId in contractAddresses
      ? (contractAddresses as any)[chainId][0]
      : null;

  const {
    runContractFunction: enterRaffle,
    data: enterTxResponse,
    isFetching,
    isLoading,
  } = useWeb3Contract({
    abi,
    contractAddress: raffleAddress,
    functionName: "enterRaffle",
    msgValue: entranceFee,
    params: {},
  });

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress, // specify the networkId
    functionName: "getEntranceFee",
    params: {},
  });

  const { runContractFunction: getPlayersNumber } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getNumberOfPlayers",
    params: {},
  });

  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getRecentWinner",
    params: {},
  });

  async function updateUIValues() {
    // Another way we could make a contract call:
    // const options = { abi, contractAddress: raffleAddress }
    // const fee = await Moralis.executeFunction({
    //     functionName: "getEntranceFee",
    //     ...options,
    // })
    const entranceFeeFromCall = ((await getEntranceFee()) as any).toString();
    const numPlayersFromCall = ((await getPlayersNumber()) as any).toString();
    const recentWinnerFromCall = await getRecentWinner();
    setEntranceFee(entranceFeeFromCall);
    setNumberOfPlayers(numPlayersFromCall);
    setRecentWinner(recentWinnerFromCall as any);
  }

  async function handleEnterRaffle() {
    try {
      await enterRaffle({
        // onComplete:
        // onError:
        onSuccess: handleSuccess,
        onError: (error) => console.log(error),
      });
    } catch (error) {}
  }

  function handleNewNotification() {
    dispatch({
      type: "info",
      message: "Transaction Complete!",
      title: "Transaction Notification",
      position: "topR",
      icon: "bell",
    });
  }

  async function handleSuccess(tx: any) {
    try {
      await tx.wait(1);
      updateUIValues();
      handleNewNotification();
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUIValues();
    }
  }, [isWeb3Enabled]);

  return (
    <div>
      <p>Lottery</p>
      {raffleAddress ? (
        <>
          <button
            disabled={isWeb3EnableLoading}
            onClick={handleEnterRaffle}
            className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
          >
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
              Enter Raffle
            </span>
          </button>
          <p>Entrance Fee: {ethers.formatEther(entranceFee)}</p>
          <p>The current number of players is: {numberOfPlayers}</p>
          <p>The most previous winner was: {recentWinner}</p>
        </>
      ) : (
        <p>Please connect to a supported chain</p>
      )}
    </div>
  );
}

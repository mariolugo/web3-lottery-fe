"use client";

import { ethers } from "ethers";
import { Avatar, Dropdown, Navbar } from "flowbite-react";
import Moralis from "moralis-v1";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useMoralis, useMoralisWeb3Api } from "react-moralis";

export function Header() {
  const [balance, setBalance] = useState<string>();
  const Web3Api = useMoralisWeb3Api();
  const {
    enableWeb3,
    account,
    web3,
    isWeb3EnableLoading,
    isWeb3Enabled,
    deactivateWeb3,
  } = useMoralis();

  useEffect(() => {
    if (
      !isWeb3Enabled &&
      typeof window !== "undefined" &&
      window.localStorage.getItem("connected")
    ) {
      enableWeb3();
      // enableWeb3({provider: window.localStorage.getItem("connected")}) // add walletconnect
    }
  }, [isWeb3Enabled]);

  useEffect(() => {
    Moralis.onAccountChanged((newAccount) => {
      console.log(`Account changed to ${newAccount}`);
      if (newAccount == null) {
        window.localStorage.removeItem("connected");
        deactivateWeb3();
        console.log("Null Account found");
      }
    });
  }, []);

  useEffect(() => {
    if (account) {
      const getBalance = async () => {
        try {
          const totalBalance = await web3?.getBalance(account);
          if (totalBalance) {
            setBalance(
              parseFloat(ethers.formatEther(totalBalance?.toString())).toFixed(
                2
              )
            );
          }
        } catch (error) {
          console.error(error);
        }
      };
      getBalance();
    }
  }, [account]);

  async function handleConnect() {
    try {
      const ret = await enableWeb3();
      if (typeof ret !== "undefined") {
        // depends on what button they picked
        if (typeof window !== "undefined") {
          window.localStorage.setItem("connected", "injected");
          // window.localStorage.setItem("connected", "walletconnect")
        }
      }
    } catch (error) {
      console.log({ code: (error as any).code });
      if ((error as any).code === 4001) {
        alert("Rejected");
      }
      console.error(error);
    }
  }

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" className="flex items-center">
          <h2 className="text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl dark:text-white">
            Web3 Raffle
          </h2>
        </a>
        <div className="flex items-center md:order-2">
          {account ? (
            <div className="flex items-center">
              <h6 className="text-lg font-bold dark:text-white mr-4">
                ETH {balance} - {account.slice(0, 6)}...
                {account.slice(account.length - 4)}
              </h6>
              <Image
                className="w-10 h-10 rounded-full"
                height={40}
                width={40}
                src="/doflamingo.jpg"
                alt="user photo"
              />
            </div>
          ) : (
            <button
              disabled={isWeb3EnableLoading}
              onClick={handleConnect}
              className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
            >
              <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                Connect Wallet
              </span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

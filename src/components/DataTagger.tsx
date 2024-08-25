"use client";
import {
  convertPointsToWei,
  getRandomJoke,
  validateTag,
} from "@/api-utils/api-utils";
import { getScore, updateScore } from "@/database/db-utils";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";
import { useQuery } from "react-query";
import { getMessageHash, signMessage } from "@/contract-utils/contract-utils";
// import { toast } from "react-toastify";

export enum JOKE_TYPE {
  DAD = "dad",
  MAMA = "mama",
}

const contractJson = require("../../artifacts/src/contracts/RewardsRedemption.sol/RewardRedemption.json");

const DataTagger: React.FC = () => {
  const [wallet, setWallet] = useState("");
  const [score, setScore] = useState(0);
  const [randomNumber, setRandomNumber] = useState(Math.random());
  console.log("Component rendering");
  useEffect(() => {
    // Request access to the user's Ethereum account
    const fetchWalletAddress = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          setWallet(accounts[0]);
          // Fetch the user's current score
          const initialScore = accounts.length
            ? await getScore(accounts[0])
            : undefined;
          setScore(initialScore?.value || 0);
        } catch (error) {
          console.error("Error fetching wallet address", error);
        }
      } else {
        console.error("Ethereum provider not found");
      }
    };

    fetchWalletAddress();
  }, []);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["joke"],
    queryFn: () => getRandomJoke(randomNumber),
    refetchOnWindowFocus: false,
    suspense: true,
  });

  const handleTagging = (tag: JOKE_TYPE) => async () => {
    console.log(">>>>>>>");
    const diff = validateTag(tag, randomNumber) ? 10 : -10;
    if (wallet) {
      try {
        await updateScore(wallet, diff);
        // Update local state with the new score
        setScore((prevScore) => Math.max((prevScore ?? 0) + diff, 0));
      } catch (error) {
        console.error("Error updating score", error);
      }
    }
    setRandomNumber(Math.random());
  };

  useEffect(() => {
    refetch();
  }, [randomNumber, refetch]);

  const redeemReward = useCallback(
    () => async () => {
      const prevScore = score;
      await updateScore(wallet, -prevScore);
      setScore(0);
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const contractAddress =
          process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_BASE_SEPOLIA || "";

        const contract = new ethers.Contract(
          contractAddress,
          contractJson.abi,
          signer
        );
        const rewardClaimedFilter = contract.filters.RewardClaimed(wallet);

        contract.on(rewardClaimedFilter, (user, amount, orderId) => {
          // toast.success(
          //   `Reward claimed! Amount: ${ethers.utils.formatUnits(
          //     amount,
          //     "wei"
          //   )} wei. Order ID: ${orderId}`
          // );
          console.log(`Reward claimed by: ${user}`);
          console.log(`Amount: ${ethers.utils.formatUnits(amount, "wei")}`);
          console.log(`Order ID: ${orderId}`);
        });

        const amount = convertPointsToWei(score);
        const orderId = ethers.utils.formatBytes32String(
          Math.random().toString()
        );

        const messageHash = getMessageHash(wallet, amount, orderId);

        const signature = await signMessage(messageHash);

        const tx = await contract.claimReward(amount, orderId, signature, {
          gasLimit: ethers.utils.hexlify(500000), // Adjust gas limit as needed
        });

        await tx.wait();
      } catch (error) {
        //   toast.error("Reward claimed faile! Your points are stored");
        setScore(prevScore);
        await updateScore(wallet, prevScore);
        console.error("Error redeeming reward:", error);
      }
    },
    [score, wallet]
  );

  const disabled = useMemo(() => {
    return score < 100;
  }, [score]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center min-h-screen p-4 w-full">
        <p className="text-xl m-4 mb-10 font-bold p-6 w-[500px] min-h-[200px] border-2 border-gray-300  shadow-lg rounded">
          Loading...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center min-h-screen p-4 w-full">
        <p className="text-xl m-4 mb-10 font-bold p-6 w-[600px] min-h-[200px] border-2 border-gray-300  shadow-lg rounded">
          Error loading joke
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-4 w-full">
      <div className="flex flex-col justify-start w-[600px] my-10 font-mono">
        <div className="text-xl font-bold">Your Score: {score}</div>
        <div className="font-mono text-md text-slate-500">
          Get 10 points for tagging the joke correcly.
        </div>
        <div className="font-mono text-md text-slate-500">
          Redeem 1 gwei per 100 points (min. 100 points).
        </div>
        <button
          disabled={disabled}
          onClick={redeemReward}
          className="font-mono px-4 py-2 mt-4 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:bg-slate-400 disabled:text-gray-100 disabled:opacity-35"
        >
          Redeem Rewards
        </button>
      </div>
      <div className="flex flex-col text-xl m-10 mt-0 font-mono p-6 w-[600px] min-w-[600px] min-h-[240px] border-2 border-gray-300 shadow-lg rounded justify-between">
        <span> {data?.joke}</span>
        <div className="flex text-base justify-between">
          <button
            onClick={handleTagging(JOKE_TYPE.DAD)}
            className="font-mono px-4 py-2  w-[150px] bg-cyan-900 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Dad Joke
          </button>
          <button
            onClick={handleTagging(JOKE_TYPE.MAMA)}
            className="font-mono px-4 py-2 w-[150px] bg-transparent text-white font-semibold rounded-lg shadow-md border border-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            Yo Mama Joke
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTagger;

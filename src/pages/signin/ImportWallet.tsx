// @ts-ignore
import React, { useCallback, useEffect, useState } from "react";
import { useWallet } from "../../contexts/WalletContext";
import { walletService } from "../../utils/WalletService";
import { useNavigate } from "react-router-dom";
import { PasswordPage } from "./PasswordPage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons/faChevronLeft";
import { clearWalletData } from "../../utils/StoreService";

export default function ImportWallet() {
  const {
    setWallet,
    isGeneratedSeedPhrase,
    setIsGeneratedSeedPhrase,
    isPasswordCreated,
    setIsPasswordCreated,
  } = useWallet();

  const navigate = useNavigate();
  const [newSeedPhrase, setNewSeedPhrase] = useState("");
  const [tempSeedPhrase, setTempSeedPhrase] = useState("");

  useEffect(() => {
    if (isPasswordCreated) {
      navigate("/");
    }
  }, [isPasswordCreated, navigate]);

  const clearSeedPhrase = async () => {
    await clearWalletData();
    setNewSeedPhrase("");
    setTempSeedPhrase("");
    setIsGeneratedSeedPhrase(false);
    setWallet((prevWallet) => ({
      ...prevWallet,
      encryptedSeedPhrase: null,
      encryptedPrivateKey: null,
      password: null,
      principalId: null,
      accountId: null,
    }));
  };

  const handleImport = useCallback(
    async (seedPhrase: string, password: string) => {
      const result = await walletService.generateWallet(seedPhrase, password);
      if (result.success) {
        setWallet((prevWallet) => ({
          ...prevWallet,
          encryptedSeedPhrase: result.encryptedSeedPhrase,
          principalId: result.principalId,
          accountId: result.accountId,
          encryptedPrivateKey: result.encryptedPrivateKey,
          password: password,
        }));
        navigate("/");
      } else {
        console.error("Error importing wallet:", result.error);
      }
    },
    [setWallet, navigate]
  );

  if (!isPasswordCreated) {
    if (!isGeneratedSeedPhrase) {
      return (
        <main className="flex justify-center items-center h-screen p-6 flex-col gap-6">
          <button
            className="fixed left-5 top-5"
            onClick={() => {
              clearSeedPhrase();
              navigate("/login");
            }}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <p className="text-lg">Import Your Wallet</p>
          <textarea
            className="rounded-xl text-center shadow-sunken-sm duration-300 border border-white/10 p-6 w-[300px] h-[150px] text-lg bg-transparent outline-none"
            value={newSeedPhrase}
            onChange={(e) => {
              setNewSeedPhrase(e.target.value);
            }}
            placeholder="Enter your seed phrase"
          />
          <button
            onClick={() => {
              if (newSeedPhrase !== "") {
                setTempSeedPhrase(newSeedPhrase);
                setIsGeneratedSeedPhrase(true);
              }
            }}
            className={`bg-white text-black py-3 px-10 rounded-full ${
              newSeedPhrase !== "" ? "" : "opacity-30 cursor-not-allowed"
            }`}
          >
            Continue
          </button>
        </main>
      );
    }

    return (
      <PasswordPage
        backFunction={clearSeedPhrase}
        handlePassword={(password: string) => {
          handleImport(tempSeedPhrase, password);
          setIsPasswordCreated(true);
        }}
      />
    );
  }

  return <div className="flex justify-center items-center">Redirecting...</div>;
}

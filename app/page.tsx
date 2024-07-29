/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import { createWallet, hasPassword } from "./actions";
import { AlbyExtension } from "./components/AlbyExtension";
import { Topup } from "./components/Topup";
import { nwc } from "@getalby/sdk";
import Link from "next/link";

export default function Home() {
  const [wallet, setWallet] = React.useState<{
    connectionSecret: string;
    lightningAddress: string;
  }>();
  const [loading, setLoading] = React.useState(false);
  const [copied, setCopied] = React.useState<"nwcUrl" | "lightningAddress">();
  const [balance, setBalance] = React.useState(0);
  async function onSubmit() {
    setLoading(true);
    try {
      let password: string | undefined = undefined;
      if (await hasPassword()) {
        password = prompt("Please enter the mint password") || undefined;
      }
      setWallet(await createWallet(password));
    } catch (error) {
      console.error(error);
      alert("Something went wrong: " + error);
    }
    setLoading(false);
  }

  React.useEffect(() => {
    (async () => {
      setBalance(0);
      if (!wallet) {
        return;
      }
      const client = new nwc.NWCClient({
        nostrWalletConnectUrl: wallet.connectionSecret,
      });

      const unsub = await client.subscribeNotifications(
        (notification) => {
          if (notification.notification_type === "payment_received") {
            setBalance((current) => current + notification.notification.amount);
          }
        },
        ["payment_received"]
      );
      return () => {
        unsub();
      };
    })();
  }, [wallet]);

  return (
    <>
      <p className="font-semibold">NWC Mint</p>
      <div className="flex flex-col gap-4 max-w-lg border-2 rounded-xl p-4 items-center justify-center mt-4 mb-16">
        {!wallet && (
          <p>
            Mint a new wallet that you can use in any{" "}
            <a href="https://nwc.dev" target="_blank" className="font-semibold">
              NWC-powered
            </a>{" "}
            app: Damus, Amethyst, Alby Extension, Alby Account, Nostrudel,{" "}
            <a
              href="https://github.com/getAlby/awesome-nwc"
              target="_blank"
              className="link"
            >
              and many more
            </a>
          </p>
        )}

        {!wallet && (
          <>
            <button
              onClick={onSubmit}
              disabled={loading}
              className={`btn btn-primary ${loading && "btn-disabled"}`}
            >
              Mint Wallet
            </button>
          </>
        )}
        {wallet && (
          <>
            <p>New Wallet Created!</p>
            <p className="text-xs max-w-xs text-center">
              {"Make sure to copy it and save it somewhere safe."}
            </p>
            <div className="flex w-full gap-2 flex-wrap items-center justify-center">
              <button
                className={`w-80 btn btn-lg btn-primary ${
                  copied === "nwcUrl" && "btn-success"
                }`}
                onClick={async () => {
                  await navigator.clipboard.writeText(wallet.connectionSecret);
                  setCopied("nwcUrl");
                  setTimeout(() => {
                    setCopied(undefined);
                  }, 3000);
                }}
              >
                {copied === "nwcUrl" ? "Copied!" : "Copy"}
              </button>
              <a
                href={wallet.connectionSecret}
                className="w-80 btn btn-lg btn-primary"
              >
                Open in Damus/Amethyst
              </a>

              <AlbyExtension connectionSecret={wallet.connectionSecret} />
            </div>

            <p className="text-sm mt-4">
              Current balance: {Math.floor(balance / 1000)} sats
            </p>
            <Topup connectionSecret={wallet.connectionSecret} />

            <p className="mt-8 text-sm">Your lightning address is:</p>
            <p>
              <span className="font-mono font-semibold">
                {wallet.lightningAddress}
              </span>{" "}
              <button
                className={`btn btn-sm btn-primary ${
                  copied === "lightningAddress" && "btn-success"
                }`}
                onClick={async () => {
                  await navigator.clipboard.writeText(wallet.lightningAddress);
                  setCopied("lightningAddress");
                  setTimeout(() => {
                    setCopied(undefined);
                  }, 3000);
                }}
              >
                {copied === "lightningAddress" ? "Copied!" : "Copy"}
              </button>
            </p>
            <p className="text-xs max-w-xs text-center">
              {
                "It's like your email address, but people send you payments instead. You can share this publicly."
              }
            </p>
          </>
        )}
      </div>
      <p className="text-xs flex justify-center items-center gap-1 text-neutral-500">
        Powered by{" "}
        <a
          href="https://nwc.dev"
          target="_blank"
          className="link flex justify-center items-center gap-0.5"
        >
          <img width={16} src="/nwc.svg" alt="" /> NWC
        </a>{" "}
        and{" "}
        <a
          href="https://getalby.com"
          target="_blank"
          className="link flex justify-center items-center gap-0.5"
        >
          <img width={16} src="/alby-hub.svg" alt="" /> Alby Hub
        </a>
      </p>
      <div className="flex flex-col justify-center items-center mt-4">
        <Link href="/reserves" className="text-xs link mt-4">
          View reserves
        </Link>
        <a
          href="https://github.com/rolznz/nwc-mint?tab=readme-ov-file#api"
          className="text-xs link mt-4"
        >
          Developer API
        </a>
        <a
          href="https://github.com/rolznz/nwc-mint"
          className="text-xs link mt-4"
        >
          source
        </a>
      </div>
    </>
  );
}

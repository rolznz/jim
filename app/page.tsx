/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import { createNewConnectionSecret, hasPassword } from "./actions";
import { AlbyExtension } from "./components/AlbyExtension";
import { Topup } from "./components/Topup";
import { nwc } from "@getalby/sdk";
import Link from "next/link";

export default function Home() {
  const [connectionSecret, setConnectionSecret] = React.useState<string>();
  const [loading, setLoading] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [balance, setBalance] = React.useState(0);
  async function onSubmit() {
    setLoading(true);
    try {
      let password: string | undefined = undefined;
      if (await hasPassword()) {
        password = prompt("Please enter the mint password") || undefined;
      }
      setConnectionSecret(await createNewConnectionSecret(password));
    } catch (error) {
      console.error(error);
      alert("Something went wrong: " + error);
    }
    setLoading(false);
  }

  React.useEffect(() => {
    (async () => {
      setBalance(0);
      const client = new nwc.NWCClient({
        nostrWalletConnectUrl: connectionSecret,
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
  }, [connectionSecret]);

  return (
    <>
      <p className="font-semibold">NWC Mint</p>
      <div className="flex flex-col gap-4 max-w-lg border-2 rounded-xl p-4 items-center justify-center mt-4 mb-16">
        {!connectionSecret && (
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

        {!connectionSecret && (
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
        {connectionSecret && (
          <>
            <p>New Wallet Created!</p>
            <p className="text-xs">
              Current balance: {Math.floor(balance / 1000)} sats
            </p>
            <div className="flex w-full gap-2 flex-wrap items-center justify-center">
              <button
                className={`btn btn-lg btn-primary ${copied && "btn-success"}`}
                onClick={async () => {
                  await navigator.clipboard.writeText(connectionSecret);
                  setCopied(true);
                  setTimeout(() => {
                    setCopied(false);
                  }, 3000);
                }}
              >
                {copied ? "Copied!" : "Copy"}
              </button>
              <a href={connectionSecret} className="btn btn-lg btn-primary">
                Open in default app
              </a>

              <Topup connectionSecret={connectionSecret} />
              <AlbyExtension connectionSecret={connectionSecret} />
            </div>
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
      <Link href="/reserves" className="text-xs link mt-4">
        View reserves
      </Link>
    </>
  );
}

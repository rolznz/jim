"use client";
import React from "react";
import { createNewConnectionSecret } from "./actions";

export default function Home() {
  const [connectionSecret, setConnectionSecret] = React.useState<string>();
  const [loading, setLoading] = React.useState(false);
  async function onSubmit() {
    setLoading(true);
    try {
      setConnectionSecret(await createNewConnectionSecret());
    } catch (error) {
      console.error(error);
      alert("Something went wrong: " + error);
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-4 max-w-lg border-2 rounded-xl p-4">
      <p>
        Mint a new NWC Connection Secret that you can use in any NWC-powered
        app: Alby Extension, Alby Account, Damus, Amethyst, Nostrudel,{" "}
        <a
          href="https://github.com/getAlby/awesome-nwc"
          target="_blank"
          className="link"
        >
          and many more
        </a>
      </p>

      {!connectionSecret && (
        <>
          <button
            onClick={onSubmit}
            disabled={loading}
            className={`btn btn-primary ${loading && "btn-disabled"}`}
          >
            Mint Connection Secret
          </button>
        </>
      )}
      {connectionSecret && (
        <>
          <p className="text-xs">
            Copy the below connection secret into your favorite NWC-powered app!
          </p>
          <div className="flex w-full gap-2">
            <input
              className="flex-1 input input-bordered input-lg"
              autoFocus
              onFocus={(e) => e.target.select()}
              type="password"
              value={connectionSecret}
            />
            <button
              className="btn btn-lg btn-primary"
              onClick={async () => {
                await navigator.clipboard.writeText(connectionSecret);
              }}
            >
              Copy
            </button>
          </div>
          <p className="text-xs">
            Your Connection Secret starts with 0 balance. Make sure to top up it
            up first!
          </p>
          <p className="text-xs text-error">
            This is just a proof of concept. Please do not put more sats on here
            than you are willing to lose.
          </p>
        </>
      )}
    </div>
  );
}

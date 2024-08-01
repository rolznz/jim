# NWC Mint

Powered by [Alby Hub](https://getalby.com)

Create a mint in minutes that you can give to your community, friends or family. They get wallets powered by your Alby Hub.

App Connections have a 10 sat / 1% reserve to account for possible routing fees.

## API

You can also create new wallets via the API. Simply do a POST request to `/api/wallets` which will return a JSON response like:

```json
{
  "connectionSecret": "nostr+walletconnect://xxx?relay=yyy&secret=zzz&lud16=123456@nwc-mint.fly.dev",
  "lightningAddress": "123456@nwc-mint.fly.dev"
}
```

If a password is required, specify it in the `Authorization` header in the basic auth format, where the ID is an empty string. e.g. `"Authorization": "Basic OjEyMw=="` for password `123`.

## Development

Copy .env.example to .env.local and update the ALBY_HUB_URL and SESSION_COOKIE property.

You can get the SESSION_COOKIE by logging into Alby Hub and inspecting the request headers of network traffic in your browser dev tools of one of the XHR requests made to Alby Hub.

Then, run the development server:

```bash
yarn
yarn db:migrate:local
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Run on Fly

1. Get a fly account and install flyctl
2. Update fly.toml to have a different app name
3. Run fly launch
4. Set your fly secrets: `fly secrets set ALBY_HUB_URL="https://nwc...onalby.com" SESSION_COOKIE="session=..." PASSWORD="" BASE_URL="https://YOURAPPNAME.fly.dev"`

You can get the SESSION_COOKIE by logging into Alby Hub and inspecting the request headers of network traffic in your browser dev tools of one of the XHR requests made to Alby Hub.

### Updating

1. Run `fly deploy`

## TODOs

- [x] One click mint
- [x] Show balance
- [x] Topups
- [x] Open in Alby Extension
- [x] Open in default app
- [x] Copy NWC connection
- [x] show amount in custody, how many wallets minted, last used
- [x] create NWC connection secrets via REST API
- [x] password protect
- [x] basic lightning addresses
- [ ] rename (it's not a mint)
- [ ] scan QR
- [ ] daily record of reserves
- [ ] daily wallet creation rate limit
- [ ] per-connection limits (so one user cannot use all the liquidity provided by the service)
- [ ] extra open actions (Alby Account, Mobile Wallet, Web Wallet, Nostrudel?, ...) & instructions

## Warning

No responsibility is taken for loss of funds. Use at your own risk.

## Why was this created?

TLDR: make it easy to onboard new users without relying on large custodians.

With [Alby Hub](https://getalby.com) it's now super easy to run your own node in the cloud in minutes. But this is still a hurdle for some people. We want to onboard as many users to bitcoin and lightning as possible.

The easiest solution right now is custodial wallets. But they are giant honeypots and can be shut down at any time and more and more often are required to do KYC or stop operating in certain jurisdictions. They also often do not use open protocols, making it hard for developers to integrate with them.

NWC Mint is a custodial wallet, but it can be run by thousands of custodians - one per family, group or community.

These wallets can be created with **a single click** or **api call** making it incredibly easy for new wallets to be created by apps, without the app owner having to build a wallet into the app itself.

### Why not just use E-cash or Fedimint?

NWC Mint gives out NWC connections which interact with the lightning network directly rather than minting and melting e-cash tokens. There are pros and cons of both, this is just another option people can choose.

NWC is an amazing protocol that works in all environments and makes it super easy for developers to make lightning powered apps, and does not care which wallet a user uses. By making it easy for developers to create lightning apps, the hope is that many high quality apps are created, giving flexibility to users (Bring your own App, Bring your own Wallet) rather than being locked into closed ecosystems.

### Isn't this just like other subaccount software (LNbits User plugin, LNDHub)?

Yes. But:

- Alby Hub and this mint is much easier to run, making it more likely to be adopted
- Users receive NWC-powered wallets, rather than LNbits HTTP API or LNDHub protocol wallets.

### Final thoughts

Learning about bitcoin and lightning takes time. By providing liquidity for your friends, family or community, you can give them a great first experience. Once they gain more experience, they can then invest into running their own node.

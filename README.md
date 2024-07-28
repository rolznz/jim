# NWC Mint

Powered by [Alby Hub](https://getalby.com)

Create a mint in minutes that you can give to your community, friends or family. They get wallets powered by your Alby Hub.

A mint that gives out isolated NWC app connections. **WARNING: no responsibility is taken for loss of funds**

App Connections have a 10 sat / 1% reserve to account for possible routing fees.

## Development

Copy .env.example to .env.local and update the ALBY_HUB_URL and SESSION_COOKIE property.

You can get the SESSION_COOKIE by logging into Alby Hub and inspecting the request headers of network traffic in your browser dev tools of one of the XHR requests made to Alby Hub.

Then, run the development server:

```bash
yarn
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Run on Fly

1. Get a fly account and install flyctl
2. Update fly.toml to have a different app name
3. Run fly launch
4. Set your fly secrets: `fly secrets set ALBY_HUB_URL="https://nwc...onalby.com" SESSION_COOKIE="session=..." CSRF_TOKEN="..."`

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
- [ ] create NWC connection secrets via REST API
- [ ] password protect
- [ ] rate limit (how many connections can be created)
- [ ] per-connection limits
- [ ] basic lightning addresses
- [ ] extra open actions (Alby Account, Mobile Wallet, Web Wallet, Nostrudel?, ...) & instructions

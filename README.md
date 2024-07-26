# NWC Mint

A mint for Alby Hub that gives out isolated NWC app connections. **WARNING: no responsibility is taken for loss of funds**

## Development

Copy .env.example to .env.local and update the ALBY_HUB_URL, SESSION_COOKIE and CSRF_TOKEN property. You can get this by logging into Alby Hub and inspecting the request headers of network traffic in your browser dev tools and creating a new app. The CSRF_TOKEN must match the CSRF token in the Cookie header.

Then, run the development server:

```bash
yarn
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Run on Fly
1. Get a fly account and install flyctl
2. Update fly.toml to have a different name
3. Run fly launch
### Updating
1. Run `fly deploy`

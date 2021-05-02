# cf-ghost-mautic-api

> Used to allow Ghost to work with Mautic API

## Installation

1. Follow the instructions to [generate and deploy a worker](https://github.com/cloudflare/wrangler)
2. Use the index.js and router.js in this repo in your app.
3. Setup a custom integration on your ghost account.
4. Setup worker script with the following environment variables mapping values from your ghost account.

```
MAUTIC_DOMAIN: Value encrypted
MAUTIC_USERNAME: Value encrypted
MAUTIC_PASSWORD: Value encrypted
```

## Documentation

The use case scenario for creating this was to allow a Ghost data to pushed to Mautic.

* **member update** - use a Ghost member update webhook to call `MAUTIC_DOMAIN\member`.

## Need more help

Project sponsored by [influencerTips](https://www.influencer.tips/).

Feel very welcome to suggest improvements on a PR or via issues.

# InheritX

## Introduction

<!-- Ignore -->
<i>
InheritX is a blockchain-based application developed on <b>Internet Computer (ICP) </b> that allows users to create a digital will and bequeath their assets to designated beneficiaries in the event of their death.
</i>

#### Assets currently supported by InheritX

- Bitcoin (BTC)
- ck-Bitcoin (ckBTC)
- Internet Computer Protocol (ICP)

### NOTE

- Users who have an [INSEE](https://www.insee.fr/en/accueil) number or living in France are eligible to use this application
- This repo contains Backend Canisters Code, for Frontend Canister code visit [InheritX-UI](https://github.com/mzurs/InheritX-UI)

## Prerequisites

1. `DFX_VERSION= 0.15.1`
2. `AZLE_VERSION= 0.17.1`
3. `NodeJS_VERSION= 18.17.1`

## Setting Up and Running InheritX Locally

- <h3>Follow steps below</h3>

1. Install dependencies

   ```bash
   yarn install
   ```

2. Download & Start Bitcoin Node

   ```bash
   yarn bitcoin_node:download && yarn bitcoin_node:start
   ```

3. Start local replica ( in new terminal )

   ```bash
   yarn dfx_start
   ```

4. Deploy Canisters ( in new terminal )

   ```bash
   yarn deploy
   ```

## Testing

- See the [TESTING](TESTING.md) document

## License

This project is licensed under the MIT license, see [LICENSE](<[LICENSE](https://github.com/mzurs/InheritX/blob/main/LICENSE)>) for details.

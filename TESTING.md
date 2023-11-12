# Testing

### Note

#### Testing is done in separate way. Following are the requirements

- Install `gnome-terminal`, by running

  ```bash
  sudo apt-get install gnome-terminal
  ```

- Stop replica by running

  ```bash
  yarn cleanup:all
  ```

## Start Testing

1. Test Will Canister

   ```bash
   yarn test:will
   ```

2. Test ICRC Canister

   ```bash
   yarn test:icrc
   ```

3. Test Providers Canister

   ```bash
   yarn test:providers
   ```

4. Test Bitcoin Canister

   ```bash
   yarn test:btc
   ```

5. Test All Canisters

   ```bash
   yarn test:all
   ```

const bip39 = require('bip39');
const { BIP32Factory } = require('bip32');
const bitcoin = require('bitcoinjs-lib');
const ecc = require('tiny-secp256k1');
const fs = require('fs');
const path = require('path');

// Configurar o BIP32 com a implementação do secp256k1
const bip32 = BIP32Factory(ecc);

const seedPhrase = 'clutch captain shoe salt awake harvest setup primary inmate ugly among become'; // Exemplo de Seed
const baseDerivationPath = "m/84'/0'/0'/0";
const start = 1; // 0 é a sua Main
const numberOfAccounts = 10;  

async function deriveBitcoinWallets(seedPhrase, numberOfAccounts, baseDerivationPath) {
  try {
    console.log('Iniciando a derivação de wallets Bitcoin...');
    const seed = bip39.mnemonicToSeedSync(seedPhrase);
    const rootNode = bip32.fromSeed(seed, bitcoin.networks.bitcoin);

    // Criar arquivo CSV
    const filePath = path.join(__dirname, 'pksOrdinals.csv');
    const csvHeaders = 'Wallet,Address,PrivateKey\n';
    fs.writeFileSync(filePath, csvHeaders);

    for (let i = start; i < (numberOfAccounts + start); i++) {
      const path = `${baseDerivationPath}/${i}`;
      const derivedNode = rootNode.derivePath(path);
      const { address } = bitcoin.payments.p2wpkh({
        pubkey: Buffer.from(derivedNode.publicKey),
        network: bitcoin.networks.bitcoin,
      });

      const line = `${path},${address},${derivedNode.toWIF()}\n`;
      fs.appendFileSync(filePath, line);
      console.log(`Wallet: ${path} || Address: ${address} || Private Key: ${derivedNode.toWIF()}`);
    }

    console.log(`Derivação finalizada. Chaves salvas em: ${filePath}`);
  } catch (error) {
    console.error('Erro ao derivar wallets Bitcoin:', error.message);
  }
}

deriveBitcoinWallets(seedPhrase, numberOfAccounts, baseDerivationPath);

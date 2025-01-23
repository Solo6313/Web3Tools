const bip39 = require('bip39');
const { BIP32Factory } = require('bip32');
const ecc = require('tiny-secp256k1');
const { Keypair } = require('@solana/web3.js');
const fs = require('fs');
const path = require('path');

// Configurar o BIP32 com a implementação do secp256k1
const bip32 = BIP32Factory(ecc);

const seedPhrase = 'clutch captain shoe salt awake harvest setup primary inmate ugly among become'; // Exemplo de Seed
const baseDerivationPath = "m/44'/501'/0'/0";
const start = 1; // 0 é a sua Main
const numberOfAccounts = 10;

async function deriveSolanaWallets(seedPhrase, numberOfAccounts, baseDerivationPath) {
  try {
    console.log('Iniciando a derivação de wallets Solana...');
    const seed = bip39.mnemonicToSeedSync(seedPhrase);
    const rootNode = bip32.fromSeed(seed);

    // Criar arquivo CSV
    const filePath = path.join(__dirname, 'pksSolana.csv');
    const csvHeaders = 'Wallet,PublicKey,PrivateKey\n';
    fs.writeFileSync(filePath, csvHeaders);

    for (let i = start; i < (numberOfAccounts + start); i++) {
      const path = `${baseDerivationPath}/${i}`;
      const derivedNode = rootNode.derivePath(path);
      const privateKey = derivedNode.privateKey;
      const keypair = Keypair.fromSeed(privateKey);
      const line = `${path},${keypair.publicKey.toBase58()},${Buffer.from(keypair.secretKey).toString('hex')}\n`;
      fs.appendFileSync(filePath, line);
      console.log(`Wallet: ${path} || Public Key: ${keypair.publicKey.toBase58()} || Private Key: ${Buffer.from(keypair.secretKey).toString('hex')}`);
    }

    console.log(`Derivação finalizada. Chaves salvas em: ${filePath}`);
  } catch (error) {
    console.error('Erro ao derivar wallets Solana:', error.message);
  }
}

deriveSolanaWallets(seedPhrase, numberOfAccounts, baseDerivationPath);

const { HDNodeWallet, Mnemonic } = require('ethers');
const fs = require('fs');
const path = require('path');

// Seed phrase válida
const seedPhrase = 'clutch captain shoe salt awake harvest setup primary inmate ugly among become'; // Exemplo de Seed

// Caminho base para derivação (BIP-44 para EVM)
const baseDerivationPath = "m/44'/60'/0'/0";

// Número de contas que deseja derivar
const start = 1; // 0 é a sua Main 
const numberOfAccounts = 10;

async function derivePrivateKeys(seedPhrase, numberOfAccounts, baseDerivationPath) {
  try {
    console.log('Iniciando a derivação de chaves privadas para Ethereum...');
    const mnemonic = Mnemonic.fromPhrase(seedPhrase);
    const rootNode = HDNodeWallet.fromSeed(mnemonic.computeSeed());

    // Criar arquivo CSV
    const filePath = path.join(__dirname, 'pksEthereum.csv');
    const csvHeaders = 'Wallet,Address,PrivateKey\n';
    fs.writeFileSync(filePath, csvHeaders);

    for (let i = start; i < (numberOfAccounts + start); i++) {
      const path = `${baseDerivationPath}/${i}`;
      const derivedNode = rootNode.derivePath(path);
      const line = `${path},${derivedNode.address},${derivedNode.privateKey}\n`;
      fs.appendFileSync(filePath, line);
      console.log(`Wallet: ${path} || Endereço: ${derivedNode.address} || Private Key: ${derivedNode.privateKey}`);
    }

    console.log(`Derivação finalizada. Chaves salvas em: ${filePath}`);
  } catch (error) {
    console.error('Erro ao derivar chaves privadas:', error.message);
  }
}

// Executar a função
derivePrivateKeys(seedPhrase, numberOfAccounts, baseDerivationPath);

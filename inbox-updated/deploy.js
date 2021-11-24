// deploy code will go here
const HDWallerProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { abi, evm } = require('./compile');

const provider = new HDWallerProvider(
  //account mneumonic
  'swamp drastic slender turn panther room oyster pole cradle always trumpet knee',
  'https://rinkeby.infura.io/v3/80cf5c74845e41ab907d13281beb1cdb'
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('attempting to deploy from account', accounts[1]);

  const result = await new web3.eth.Contract(abi)
    .deploy({ data: evm.bytecode.object, arguments: ['Hi there!'] })
    .send({ gas: '1000000', from: accounts[1] })

  console.log('contract deploid to', result.options.address);
  provider.engine.stop();
};
deploy();

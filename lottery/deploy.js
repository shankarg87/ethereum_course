const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('Web3');
const { interface, bytecode } = require('./compile');

//console.log('interface is \n', interface);
//console.log('\n and bytecode is \n', bytecode);

const provider = new HDWalletProvider(
  'front since glide any thumb identify copy alarm cactus syrup price lottery',
  'https://rinkeby.infura.io/YtoEBWJvpC6Y6DPjuhrg'
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log('Attempting to deploy from account', accounts[0]);
  const result = await new web3.eth.Contract(JSON.parse(interface))
                            .deploy({data:bytecode})
                            .send({from: accounts[0], gas: '1000000'});
  console.log('Contract deployed to ', result.options.address);
};
deploy();

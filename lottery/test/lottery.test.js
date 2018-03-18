const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const {interface, bytecode} = require('../compile');

const provider = ganache.provider();
const web3 = new Web3(provider);

let accounts;
let lottery;

beforeEach ( async() => {
    accounts = await web3.eth.getAccounts();
    // Use one of those accounts to deploy
    // the contract
    lottery = await new web3.eth.Contract(JSON.parse(interface))
            .deploy({data:bytecode})
            .send({from: accounts[0], gas: '1000000'});
    lottery.setProvider(provider);
});

describe('Lottery', () => {
  it('deploys a contract', () => {
      assert.ok(lottery.options.address);
  });
  it ('allows one acount to enter', async () => {
    await lottery.methods.enter()
                            .send({from: accounts[0],
                                  value : web3.utils.toWei('0.02', 'ether')});
    const players = await lottery.methods.getPlayers()
                              .call({from: accounts[0]});
    assert.equal(accounts[0], players[0]);
    assert.equal(1, players.length);
  });
  it ('allows multiple acount to enter', async () => {
    await lottery.methods.enter()
                            .send({from: accounts[0],
                                  value : web3.utils.toWei('0.02', 'ether')});
    await lottery.methods.enter()
                          .send({from: accounts[1],
                                value : web3.utils.toWei('0.02', 'ether')});
    const players = await lottery.methods.getPlayers()
                              .call({from: accounts[0]});
    assert.equal(accounts[0], players[0]);
    assert.equal(accounts[1], players[1]);
    assert.equal(2, players.length);
  });
  it ('requires a minimum amount of ether', async () => {
    try {
      await lottery.methods.enter().send({from: accounts[0],
                                          value: 0});
      assert(false);
    }
    catch(err) {
      assert(err);
    }
  })
  // skipping one mentioned in the video
  
}); // End describe

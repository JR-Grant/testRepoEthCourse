// contract test code will go here
const assert = require('assert');
const ganache = require('ganache-cli');
//capital W due to it being a contructor function, web3 uses this contructor
//function to make instances of the web3 library
const Web3 = require('web3');
//creates an instance of web 3 and tells it to attempt to connect to the local test network.
const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require('../compile');
// At each test we want to deploy a new contract
// We then want to manipulate the contract and Make an assertion about the contract.
let accounts;
let inbox;
const INITIAL_STRING = 'Hi there!'
const SET_STRING = 'Goodbye!'

// INFURA RINKEBY API
// https://rinkeby.infura.io/v3/80cf5c74845e41ab907d13281beb1cdb
beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();

  //use one of those accounts to deploy the coontract
  inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: [INITIAL_STRING] })
    //the account from the array to be used
    .send({ from: accounts[0], gas: '1000000' })
});

describe('Inbox', () => {
  it('deploys a contract', () => {
    assert.ok(inbox.options.address);
  });

  it('has a default message', async () => {
    const message = await inbox.methods.message().call();
    assert.equal(message, INITIAL_STRING)
  });

  it('can set a message', async () => {
    await inbox.methods.setMessage(SET_STRING).send({ from: accounts[0] });
    const message = await inbox.methods.message().call();
    assert.equal(message, SET_STRING);
  });
});

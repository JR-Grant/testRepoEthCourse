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

beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();

  //use one of those accounts to deploy the coontract
  inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: ['Hi there!'] })
    //the account from the array to be used
    .send({ from: accounts[0], gas: '1000000' })
});

describe('Inbox', () => {
  it('deploys a contract', () => {
    console.log(inbox);
  });
});

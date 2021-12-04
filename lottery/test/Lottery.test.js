const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());


const { interface, bytecode } = require('../compile');

let lottery;
let accounts;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode})
    .send({ from: accounts[0], gas: '1000000'})
});

describe('Lottery Contract', () => {
  it('deploys a contract', () => {
    assert.ok(lottery.options.address);
  });

  it('allows one account to enter', async () => {
    //want to test that an account can enter
    await lottery.methods.enter().send({
      //check the account name
      from: accounts[0],
      //check the value they have sent in wei
      value: web3.utils.toWei('0.02', 'ether')
    });

    //ensure that get players returns list of players
    const players = await lottery.methods.getPlayers().call({
      from: accounts[0]
    });
    //asserts that the account that has joined is the account in the players array
    //should always be the value that it should be followed by the value that it is
    assert.equal(accounts[0], players[0]);
    assert.equal(1, players.length)


  });

  it('allows multiple accounts to enter', async () => {
    await lottery.methods.enter().send({
      //check the account name
      from: accounts[0],
      //check the value they have sent in wei
      value: web3.utils.toWei('0.02', 'ether')
    });
    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei('0.02', 'ether')
    });
    await lottery.methods.enter().send({
      from: accounts[2],
      value: web3.utils.toWei('0.02', 'ether')
    });

    //ensure that get players returns list of players
    const players = await lottery.methods.getPlayers().call({
      from: accounts[0]
    });
    //asserts that the account that has joined is the account in the players array
    //should always be the value that it should be followed by the value that it is
    assert.equal(accounts[0], players[0]);
    assert.equal(accounts[1], players[1]);
    assert.equal(accounts[2], players[2]);
    assert.equal(3, players.length);
  });

  it('does requires a minimum amount of ether to enter', async () => {
    //try catch statement to catch errors this is javascript basics
    try{
      await lottery.methods.enter().send({
        from: accounts[0],
        //sending an extremely small amount under the minimum
        value: 0
      });
      //assert false is run if the statement does not throw an error (we want it to)
      assert(false);
      //if the statement does throw an error then the assert(false) is skipped
    } catch (err) {
      assert(err);
    }
  });

  it('requires a manager to pick a winner', async () => {
    try {
      await lottery.methods.pickWinner().send({
        from: accounts[1]
      });
      //automatically fail code if this line is run
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it('sends money to the winner and resets the players array', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('2', 'ether')
    });

    //taking our initialBalanceof the player after entering with 2 eth
    const initialBalance = await web3.eth.getBalance(accounts[0]);
    //running the pickWinnerfunction, thus sending 2 eth to the only account
    //that account being the player that entered
    await lottery.methods.pickWinner().send({ from: accounts[0] });
    //stores the new balance after funds havve been transferred
    const finalBalance = await web3.eth.getBalance(accounts[0]);
    //stores and asserts the difference with gas costs accounted for
    const difference = finalBalance - initialBalance;
    console.log(difference);
    assert(difference > web3.utils.toWei('1.8', 'ether'));

    //asserts that the players array has been reset after pickWinner
    const players = await lottery.methods.getPlayers().call({
      from: accounts[0]
    });
    assert(players.length == 0);

  });
});

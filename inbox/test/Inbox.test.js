// contract test code will go here
const assert = require('assert');
const ganache = require('ganache-cli');
//capital W due to it being a contructor function, web3 uses this contructor
//function to make instances of the web3 library
const Web3 = require('web3');
//creates an instance of web 3 and tells it to attempt to connect to the local test network.
const web3 = new Web3(ganache.provider());

// contract test code will go here
const assert = require('assert');
const ganache = require('ganache-cli');
//capital W due to it being a contructor function, web3 uses this contructor
//function to make instances of the web3 library
const Web3 = require('web3');
//creates an instance of web 3 and tells it to attempt to connect to the local test network.
const web3 = new Web3(ganache.provider());

//creating an arbitrary class for testing purposes
class Car {
  park() {
    return 'stopped';
  }

  drive(){
    return 'vroom';
  }
}

//ensures that variable is available over the whole scope.
//let as opposed to const as the value changes throughout.
let car;
//testing class Car
//running npm run test wull run the tests
beforeEach(() => {
  //initialises object before each it statement
  car = new Car();
});

describe('Car', () => {
  it('can park', () => {
    //passess if both values are equal
    assert.equal(car.park(), 'stopped');
  });

  it('can drive', () =>{
    assert.equal(car.drive(), 'vroom');
  });
});

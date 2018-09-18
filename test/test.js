var assert = require('assert');
var expect = require('chai').expect;
var should = require('chai').should();

describe("check tests are running", () => {
  it("ran a test", () => {
    expect(true).to.equal(true);
  })
})

describe("should get the desired response from the Etsy API", function(){
  it("recieved an Object", function(){
    expect(typeof etsyData).to.equal("object")
  })

//   //how to add OR includes "bridal"?
//   it("listing description contains 'wedding'.")
//     expect(etsyData.results.description.includes('wedding').to.equal(true))
})

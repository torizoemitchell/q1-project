const expect = chai.expect

describe("check tests are running", () => {
  it("ran a test", () => {
    expect(true).to.equal(true);
  })
})

describe("countdown works properly", () => {
  it("converts the given date to unix time", () => {
    let countDownForm = document.getElementById('countdown-button')
    countDownForm.click()
    expect(givenDateToUnixTime('2018-09-29T15:00')).to.equal(1538254800000);
  })
  it("converts distance to days/hours/mins/secs", () => {
    expect(convertDistance(890453068)).to.equal('10d 7h 20m 53s​');
  })
})

describe("month lookup", () => {
  it("properly assigns a month name based on month (number) from date", () => {
    expect(monthLookup['01']).to.equal('Jan');
    expect(monthLookup['10']).to.equal('Oct');
  })
})

describe("displaying event time", () => {
  it("properly converts given military time to standard time", () => {
    expect(militaryToStandardTime('13:00')).to.equal('1:00pm')
    expect(militaryToStandardTime('10:00')).to.equal('10:00am')
  })
})




//})

//1538233200000
//convertDistance(890453068)   '10d 7h 20m 53s​'

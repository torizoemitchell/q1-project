const expect = chai.expect

describe("check tests are running", () => {
  it("ran a test", () => {
    expect(true).to.equal(true);
  })
})

describe("Countdown works properly", () => {
  it("converts the given date to unix time", () => {

    document.getElementsByClassName('your-date')[0].value = '2018-09-29T15:00'
    let countDownForm = document.getElementById('countdown')
    countDownForm.submit()
    expect(givenDateToUnixTime('givenDate')).to.equal(1569769200);
  })
})

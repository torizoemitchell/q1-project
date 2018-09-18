//categories: other, fashion, expo, party, networking
//endpoint: https://www.eventbriteapi.com/v3/events/search/?subcategories=6003&token=VZOCWIOLMEUN4MRKIOHI
document.addEventListener('DOMContentLoaded', function(event){
  //console.log("ready!")
  //globals-----------------------------------------------
  let monthLookup = {
    '01': 'Jan',
    '02': 'Feb',
    '03': 'Mar',
    '04': 'Apr',
    '05': 'May',
    '06': 'Jun',
    '07': 'Jul',
    '08': 'Aug',
    '09': 'Sep',
    '10': 'Oct',
    '11': 'Nov',
    '12': 'Dec'}
//timer---------------------------------------------------
  //check to see if a date is stored in local storage, if so, start countown
  if(localStorage.getItem('countdown') !== null){
    //start countdown
  }

  //add event Listener to countdown button
  let countDownForm = document.getElementById('countdown')

  let countDownButton = document.getElementsByClassName('count-down')[0]

  countDownForm.addEventListener('submit', startCountDown)

  function startCountDown(event){
    event.preventDefault()
    //set date we're counting down to
    //convert format of given date to Unix time (miliseconds)
    let givenDate = document.getElementsByClassName('your-date')[0].value
    console.log("givenDate: ", givenDate)
    let countDownToInMS = givenDateToUnixTime(givenDate)

    //update the timer every 1 second
    let timerInterval = setInterval(function(){
      //get today's date and time in Unix time
      let now = new Date().getTime()
      //calculate the difference between now and countdown time
      let distance = countDownToInMS - now
      console.log("distance: ", distance)
      //convert distance into days/hours/mins/seconds
      displayTimerText = convertDistance(distance)

      //display
      let displayTimer = document.getElementById('timer')
      console.log('displayTimer: ', displayTimer)
      displayTimer.innerText = displayTimerText
      localStorage.setItem('countdown', displayTimerText)

  }, 1000)
  }

  function givenDateToUnixTime (givenDate){
    let countDownYear = givenDate.substring(0,4)
    let countDownMonth = monthLookup[givenDate.substring(5,7)]
    let countDownDay = givenDate.substring(8,10)
    let countDownHour = givenDate.substring(11)
    let countDownTo = `${countDownDay} ${countDownMonth} ${countDownYear} ${countDownHour}:00`
    return Date.parse(countDownTo)
  }

  function convertDistance(distance){
    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);
    return `${days}d ${hours}h ${minutes}m ${seconds}s`
  }


//get data from eventbrite---------------------------------------------

  //get data from localStorage
  if(localStorage.getItem('locationUrl') === null){
    var defaultUrl = 'https://www.eventbriteapi.com/v3/events/search/?sort_by=distance&location.address=Denver&subcategories=6003&token=VZOCWIOLMEUN4MRKIOHI'
  } else{
    var defaultUrl = localStorage.getItem('locationUrl')
    document.getElementsByClassName('nearest-major-city')[0].value = localStorage.getItem('nearestMajorCity')
  }

  //populate cards will populate cards with the given url. change the url to populate with location-specific data
  function populateCards(url){
    axios.get(url)
      .then(function(response){
        //loop to populate cards
        for(let i = 0; i <= 3; i++){
          //title----------------
          let events = response.data.events
          let cardTitle = document.getElementsByClassName('event-title')[i]
          //console.log('cardTitle: ', cardTitle )
          cardTitle.innerText = events[i].name.text.substring(0,80)

          //description------------
          let cardText = document.getElementsByClassName('card-text')[i]
          //console.log("cardText", cardText)
          //trim description
          let description = events[i].description.text.substr(0, 100)
          cardText.innerText = description

          //link---------------------
          let eventLink = document.getElementsByClassName('event-link')[i]
          let moreInfo = events[i].url
          eventLink.setAttribute('href', moreInfo)

          //image---------------------
          let cardImage = document.getElementsByClassName('card-img-top')[i]
          let eventImage = events[i].logo.url
          cardImage.setAttribute('src', eventImage)

          //time-------------------------
          let cardTime = document.getElementsByClassName('event-time')[i]
          let eventTime = events[i].start.local
          let eventYear = eventTime.substring(0,4)
          let eventDay = eventTime.substring(8,10)
          //Bug here?
          let eventMonth = eventTime.substring(5,7)
          let eventHour = eventTime.substring(11,16)
          cardTime.innerText = `${monthLookup[eventMonth]} ${eventDay}, ${eventYear} ${eventHour}`
        }
      })
    }
    populateCards(defaultUrl)


  // ----filter location----------------------------------------------
  let filterLocationsButton = document.getElementsByClassName('filter-results')[0]

  filterLocationsButton.addEventListener('click', filterLocation)

  function filterLocation(event){
    event.preventDefault()
    let nearestMajorCity =
    document.getElementsByClassName('nearest-major-city')[0].value
    //determine new URL based on input
    let filteredUrl = 'https://www.eventbriteapi.com/v3/events/search/?sort_by=distance&location.address=' + nearestMajorCity + '&subcategories=6003&token=VZOCWIOLMEUN4MRKIOHI'
    //call populate cards with new url
    populateCards(filteredUrl)
    //save location info in local storage
    localStorage.setItem('locationUrl', filteredUrl)
    console.log("nearestMajorCity: ", nearestMajorCity)
    localStorage.setItem('nearestMajorCity', nearestMajorCity)
  }

//get data from Etsy---------------------------------------------------------------
  console.log("etsydata2: ", etsyData)
  console.log('type of etsyData: ', (typeof etsyData))





})

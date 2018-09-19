//global functions that need to be availale for test script to access-------------------------------------------------
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

  //use populate functions in a for loop, i is the iterator
  function populateCardTitle(i, desiredInnerText, classname){
    let cardTitle = document.getElementsByClassName(classname)[i]
    cardTitle.innerText = desiredInnerText.substring(0,50)
  }

  function populateCardDescription(i, desiredInnerText, classname){
    let cardText = document.getElementsByClassName(classname)[i]
    cardText.innerText = desiredInnerText.substr(0, 100)
  }

  function populateCardLink(i, link, classname){
    let eventLink = document.getElementsByClassName(classname)[i]
    eventLink.setAttribute('href', link)
  }

//When the page is loaded, begin DOM manipulation
document.addEventListener('DOMContentLoaded', function(event){

  //timer---------------------------------------------------
  //add event Listener to countdown button
  let countDownForm = document.getElementById('countdown')
  countDownForm.addEventListener('submit', startCountDown)
  function startCountDown(event){
    event.preventDefault()
    //set date we're counting down to
    //convert format of given date to Unix time (miliseconds)
    let givenDate = document.getElementsByClassName('your-date')[0].value
    console.log("givenDate in unix: ", Date.parse(givenDate))
    let countDownToInMS = givenDateToUnixTime(givenDate)
    console.log("countDownToInMS: ", countDownToInMS)
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


  //****EVENTBRITE SECTION----------------------------------
  //
  // check to see if there is data from localStorage--------
  if(localStorage.getItem('locationUrl') === null){
    var defaultUrl = 'https://www.eventbriteapi.com/v3/events/search/?sort_by=distance&location.address=Denver&subcategories=6003&token=VZOCWIOLMEUN4MRKIOHI'
  } else{
    var defaultUrl = localStorage.getItem('locationUrl')
    document.getElementsByClassName('nearest-major-city')[0].value = localStorage.getItem('nearestMajorCity')
  }

  //filter location-----------------------------------------
  let filterLocationsButton = document.getElementsByClassName('filter-results')[0]

  filterLocationsButton.addEventListener('click', filterLocation)

  function filterLocation(event){
    event.preventDefault()
    let nearestMajorCity =
    document.getElementsByClassName('nearest-major-city')[0].value
    //determine new URL based on input
    let filteredUrl = 'https://www.eventbriteapi.com/v3/events/search/?sort_by=distance&location.address=' + nearestMajorCity + '&subcategories=6003&token=VZOCWIOLMEUN4MRKIOHI'
    //call populate cards with new url
    populateEventBriteCards(filteredUrl)
    //save location info in local storage
    localStorage.setItem('locationUrl', filteredUrl)
    console.log("nearestMajorCity: ", nearestMajorCity)
    localStorage.setItem('nearestMajorCity', nearestMajorCity)
  }

  //populate Eventbrite cards with default url--------------
  populateEventBriteCards(defaultUrl)
  function populateEventBriteCards(url){
    axios.get(url)
      .then(function(response){
        //loop to populate the first 4 cards
        for(let i = 0; i <= 3; i++){
          let events = response.data.events
          //title----------------
          populateCardTitle(i, events[i].name.text.substring(0,80), 'event-title eventbrite')

          //description------------
          populateCardDescription(i, events[i].description.text, 'card-text eventbrite')


          //link---------------------
          populateCardLink(i, events[i].url, 'event-link eventbrite')


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

  //****ETSY SECTION--------------------------------------
  //
  //console.log('etsyData: ', etsyData)
  // poplulate Etsy data--------------------------
  populateEtsyCards(etsyData)
  function populateEtsyCards(etsyData){
    //loop through cards to populate
    for(let i = 0; i <= 3; i++){
      let listings = etsyData.results

      //title
      populateCardTitle(i, listings[i].title, 'event-title etsy')

      //description
      populateCardDescription(i, listings[i].description, 'card-text etsy')

      //link
      populateCardLink(i, listings[i].url, 'event-link etsy')

      //image
      let listingId = listings[i].listing_id
      //create src attribute for the api call with the listing ID
      let imageRequestURL = "https://openapi.etsy.com/v2/listings/" + listingId + "/images.js?callback=getImageData&api_key=oiatbz455mez7qs7sm7yh0wc"
      let etsyImageRequest = document.getElementById('etsy-image-request').setAttribute('src', imageRequestURL)
    }
  }






})

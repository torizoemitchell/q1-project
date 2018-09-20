//THINGS YOU CAN DO*****************************************
//global scope, so the test script can access
function givenDateToUnixTime (givenDate){
  let countDownYear = givenDate.substring(0,4)
  let countDownMonth = monthLookup[givenDate.substring(5,7)]
  let countDownDay = givenDate.substring(8,10)
  let countDownHour = givenDate.substring(11)
  //it's recommended to use Date.parse with this format, which is why the previous steps are neccessary/best practice:
  let countDownTo = `${countDownDay} ${countDownMonth} ${countDownYear} ${countDownHour}:00`
  return Date.parse(countDownTo)
}

function givenDateToHumanDate (givenDate){
  let countDownYear = givenDate.substring(0,4)
  let countDownMonth = monthLookup[givenDate.substring(5,7)]
  let countDownDay = givenDate.substring(8,10)
  let countDownHour = militaryToStandardTime(givenDate.substring(11))
  return `${countDownMonth} ${countDownDay},  ${countDownYear} at ${countDownHour}`
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

  function militaryToStandardTime(militaryTime){
    let retString = ''
    let hours = parseInt(militaryTime.substring(0,2))
    let mins = militaryTime.substring(3)
    if(hours === 12){
      retString = `${hours}:${mins}pm`
    }else if(hours > 12){
      let standardHour = (hours - 12)
      retString = `${standardHour}:${mins}pm`
    }else if(hours < 12){
      retString = `${hours}:${mins}am`
    }
    return retString
  }

  //functions to populate entire sections of cards:
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
      populateEtsyImage(i, listings[i].listing_id, 'card-img-top etsy')
    }
  }
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
          populateEventBriteImage(i, events[i].logo.url, 'card-img-top eventbrite')

          //time-------------------------
          populateCardWithStandardTime(i, events[i].start.local, 'event-time')
        }
      })
    }

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

  function populateCardWithStandardTime(i, desiredInnerText, classname){
    let eventTime = desiredInnerText
    let cardTime = document.getElementsByClassName(classname)[i]
    let eventYear = eventTime.substring(0,4)
    let eventDay = eventTime.substring(8,10)
    let eventMonth = eventTime.substring(5,7)
    let eventHour = eventTime.substring(11,16)
    let standardHour = militaryToStandardTime(eventHour)
    cardTime.innerText = `${monthLookup[eventMonth]} ${eventDay}, ${eventYear} ${standardHour}`
  }

  //we DO NOT populate Images the same way from eventbrite and etsy apis
  function populateEventBriteImage(i, imageUrl, classname){
    let cardImage = document.getElementsByClassName(classname)[i]
    cardImage.setAttribute('src', imageUrl)
  }

  function populateEtsyImage(i, listingId, classname){
      let imageRequestURL = "https://openapi.etsy.com/v2/listings/" + listingId + "/images.js?callback=getData&api_key=oiatbz455mez7qs7sm7yh0wc"
      //makes a request to the api to get the images associated with the listing Id
      $.ajax({
        url: imageRequestURL,
        dataType: 'jsonp',
        success: function(data) {
          if (data.ok) {
            //console.log("etsyImageData: ", data )
            let imageUrl = data.results[0].url_170x135
            //console.log("imageUrl: ", imageUrl)
            let cardImage = document.getElementsByClassName(classname)[i]
            cardImage.setAttribute('src', imageUrl)
          } else {
              alert(data.error);
          }
        }
      });
  }


  //filter location in eventbrite section:
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




//DO THE THINGS*********************************************
//When the page is loaded, begin DOM manipulation
document.addEventListener('DOMContentLoaded', function(event){


  //TIMER***************************************************
  //check to see if there is data from localStorage, if it's there, start the countdown using that date-----------
  if(localStorage.getItem('countDownToInMS') !== null){
    startCountDown(localStorage.getItem('countDownToInMS'), localStorage.getItem('givenDateHumanReadable'))
  }

  let timerSection = document.getElementById('timer')
  //add event Listener to countdown button
  var countDownForm = document.getElementById('countdown')
  countDownForm.addEventListener('submit', startInitialCountDown)

  function startInitialCountDown(event){
    event.preventDefault()
    //set date we're counting down to
    //convert format of given date to Unix time (miliseconds)
    let givenDate = document.getElementsByClassName('your-date')[0].value
    let givenDateHumanReadable = givenDateToHumanDate(givenDate)
    localStorage.setItem("givenDateHumanReadable", givenDateHumanReadable)
    let countDownToInMS = givenDateToUnixTime(givenDate)
    //stores miliseconds as a string:
    localStorage.setItem("countDownToInMS", countDownToInMS)
    startCountDown(countDownToInMS, givenDateHumanReadable)

  }

  function startCountDown(countDownToInMS, givenDateHumanReadable){
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
    }, 1000)
    //show date
    let yourDateUnhidden = document.getElementById('your-date-hidden')
    yourDateUnhidden.innerText = `your date :       ${givenDateHumanReadable}`
    //hide form and add change button
    let countDownForm = document.getElementById('countdown')
    console.log('countdownForm: ', countDownForm)
    countDownForm.style.display = 'none'
    let changeDateButton = document.getElementsByClassName('btn-sm btn-outline-dark change-date')[0]
    changeDateButton.removeAttribute('hidden')
    changeDateButton.addEventListener('click', () =>{
      //clear all values
      givenDate = ''
      localStorage.removeItem('countDownToInMS')
      localStorage.removeItem('givenDateHumanReadable')
      //hide countdown
      let yourDateUnhidden = document.getElementById('your-date-hidden')
      yourDateUnhidden.innerText = ''
      clearInterval(timerInterval)
      let displayTimer = document.getElementById('timer')
      displayTimer.innerText = ''
      //show form again
      countDownForm.style.display = 'block'
      //hide change Date changeDate
      changeDateButton.setAttribute('hidden', true)
    })
  }


  //EVENTBRITE SECTION**************************************

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

  //populate Eventbrite cards with default url--------------
  populateEventBriteCards(defaultUrl)


  //ETSY SECTION********************************************

  // poplulate Etsy data------------------------------------
  populateEtsyCards(etsyData)

})

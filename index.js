//categories: other, fashion, expo, party, networking
//endpoint: https://www.eventbriteapi.com/v3/events/search/?subcategories=6003&token=VZOCWIOLMEUN4MRKIOHI
document.addEventListener('DOMContentLoaded', function(event){
  //console.log("ready!")

//get data from eventbrite---------------------------------------------

  //get data from localStorage
  if(localStorage.getItem('locationUrl') === null){
    var defaultUrl = 'https://www.eventbriteapi.com/v3/events/search/?sort_by=distance&location.address=Denver&subcategories=6003&token=VZOCWIOLMEUN4MRKIOHI'
  } else{
    var defaultUrl = localStorage.getItem('locationUrl')
    document.getElementsByClassName('nearest-major-city')[0].value = localStorage.getItem('nearestMajorCity')
    console.log('got local Storage data')
  }

  //populate cards will populate cards with the given url. change the url to populate with location-specific data
  function populateCards(url){
    axios.get(url)
      .then(function(response){
        console.log(response)

        //------------populate cards-----------------

        //loop to populate cards
        for(let i = 0; i <= 3; i++){
          //title----------------
          let events = response.data.events
          //console.log('events: ', events)
          let cardTitle = document.getElementsByClassName('event-title')[i]
          //console.log('cardTitle: ', cardTitle )
          cardTitle.innerText = events[i].name.text

          //description------------
          let cardText = document.getElementsByClassName('card-text')[i]
          //console.log("cardText", cardText)
          //trim description
          let description = events[i].description.text.substr(0, 200)
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
          cardTime.innerText = eventTime
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


})

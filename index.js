//categories: other, fashion, expo, party, networking
//endpoint: https://www.eventbriteapi.com/v3/events/search/?subcategories=6003&token=VZOCWIOLMEUN4MRKIOHI
document.addEventListener('DOMContentLoaded', function(event){
  //console.log("ready!")


//get data from eventbrite---------------------------------------------
  let url = 'https://www.eventbriteapi.com/v3/events/search/?subcategories=6003&token=VZOCWIOLMEUN4MRKIOHI'
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
        console.log("eventLink: ", eventLink)
        let moreInfo = events[i].url
        console.log("more info: ", moreInfo)
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



})

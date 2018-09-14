//categories: other, fashion, expo, party, networking
//endpoint: https://www.eventbriteapi.com/v3/events/search/?subcategories=6003&token=VZOCWIOLMEUN4MRKIOHI
document.addEventListener('DOMContentLoaded', function(event){
  console.log("ready!")
  let url = 'https://www.eventbriteapi.com/v3/events/search/?subcategories=6003&token=VZOCWIOLMEUN4MRKIOHI'
  axios.get(url)
    .then(function(response){
      console.log(response)

      //------------populate cards-----------------
      //title----------------
      let events = response.data.events
      //console.log('events: ', events)
      let cardTitle = document.getElementsByClassName('event-title')[0]
      //console.log('cardTitle: ', cardTitle )
      cardTitle.innerText = events[0].name.text

      //description------------
      let cardText = document.getElementsByClassName('card-text')[0]
      //console.log("cardText", cardText)
      //trim description
      let description = events[0].description.text.substr(0, 200)
      cardText.innerText = description

      //link---------------------
      let eventLink = document.getElementById('event-link')
      //console.log("eventLink: ", eventLink)
      let moreInfo = events[0].url
      eventLink.setAttribute('href', moreInfo)

      //image---------------------
      let cardImage = document.getElementsByClassName('card-img-top')[0]
      let eventImage = events[0].logo.url
      cardImage.setAttribute('src', eventImage)

      //time-------------------------
      let cardTime = document.getElementsByClassName('event-time')[0]
      let eventTime = events[0].start.local
      cardTime.innerText = eventTime
    })



})

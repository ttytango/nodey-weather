// console.log("Client Side Javascript file loaded!")

const weatherForm = document.querySelector('form')
const search = document.querySelector('input')
const messageOne = document.querySelector('#message-one')
const messageTwo = document.querySelector('#message-two')



const getWeatherData = ((address) => {
    fetch(`/weather?address=${ address }`).then((response) => response.json()).then((data) => {
        if (data.error) {
            messageOne.textContent = data.error
        } else {
            messageOne.textContent = data.location
            messageTwo.textContent = data.feelsLike
        }
    })
})

weatherForm.addEventListener(`submit`, (event) => {
        event.preventDefault()

        const location = search.value;
        messageOne.textContent = ""
        messageTwo.textContent = ""
        getWeatherData(location)
            // console.log(location)
    })
    // getWeatherData('London')
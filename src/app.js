const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const request = require('postman-request')
const app = express()

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')


// Setup handlebars enging and views location

app.set('view engine', 'hbs')
app.set('views', viewsPath)
    // app.set('views', partialsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', { title: 'Weather App', name: 'Tim Simonson' })
})

// Routes

app.get('/about', (req, res) => {
    res.render('about', { title: 'About Me', name: 'Tim Simonson' })
})

app.get('/help', (req, res) => {
    res.render('help', { title: 'Help', name: 'Tim Simonson', message: 'This is the help page' })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: "You must provide your address to search"
        })
    } else {
        geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
            if (error) {
                return res.send({ error })
            }

            const localAddress = { "latitude": latitude, "longitude": longitude, "location": location };
            // console.log(weatherData)
            const weatherUrlTwo = `http://api.weatherstack.com/current?access_key=23a6cac88d11b198493103860a76bf8b&query=${ localAddress.latitude },${ localAddress.longitude }`
                // console.log(weatherUrlTwo)
            request({ url: weatherUrlTwo, json: true }, (error, response) => {
                const data = response.body.current
                const dataCrunch = `It is currently ${ data.temperature } degrees outside. Yet it feels like ${ data.feelslike } degrees.`
                res.send({
                    latitude: localAddress.latitude,
                    longitude: localAddress.longitude,
                    location: localAddress.location,
                    weather: data,
                    feelsLike: dataCrunch
                })
            })

        })

    }
})



app.get('/help/*', (req, res) => {
    res.render('404', { title: '404 Error', message: "Help article is not found", name: "Tim Simonson" })
})

app.get('*', (req, res) => {
    res.render('404', { title: '404 Error', message: "This page is not found", name: "Tim Simonson" })
})

app.listen(3333, () => {
    console.log('listening on port 3333')
})
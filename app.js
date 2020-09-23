const API_TOKEN = ''

const AccuWeatherApi = axios.create({
    baseURL: 'http://dataservice.accuweather.com'
})

var app = new Vue({
    el: '#app',
    data: {
        city: null,
        cityKey: null,
        weatherData: null,
        icon: null,
        iconsFolder: './assets/img/',
        loadingWeatherData: false
    },
    methods: {
        searchCity: async function(){
            this.cities = await AccuWeatherApi.get(
                '/locations/v1/cities/autocomplete?apikey=' + API_TOKEN + '&q=' + this.city + '&language=pt-br')
                .then(function(response){
                    if(response.data){
                        return response.data
                    } else {
                        console.error('Error when list the citys, try again!')
                    }
                })
        },
        getWeather: async function(){
            this.loadingWeatherData = true
            this.weatherData = await AccuWeatherApi.get('/forecasts/v1/daily/1day/' + this.cityKey + '?apikey=' + API_TOKEN + '&language=pt-br&metric=true')
            .then(function(response){
                if(response.data){
                    return response.data
                } else {
                    console.error('Error when access Weather API, try again!')
                }
            })
            if(this.weatherData){
                this.setIcon(this.weatherData.DailyForecasts[0].Day.IconPhrase)
            }
            console.log(this.weatherData)
            this.loadingWeatherData = false
        },
        setIcon: function(text){
            if(text.includes('ensolarado')){
                this.icon = 'sun.png'
            } if(text.includes('nublado')){
                this.icon = 'partly-cloudy.png'
            }
        },
        newSearch: function(){
            this.city = null
            this.weatherData = null
            this.cityKey = null
        }
    },
    watch: {
        city: function(val){
            var optionSelected = document.querySelector("#dl_cities option[value='"+val+"']")
            if(optionSelected){
                this.cityKey = optionSelected.dataset.value
            }
        }
    }
})
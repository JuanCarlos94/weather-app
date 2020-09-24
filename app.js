const API_TOKEN = 'SH6mt3GETgPEyP3WhAz75N4MauW0Q1Rk'

const AccuWeatherApi = axios.create({
    baseURL: 'http://dataservice.accuweather.com'
})

var app = new Vue({
    el: '#app',
    data: {
        cities: [],
        city: null,
        cityKey: null,
        weatherData: null,
        icon: null,
        iconsFolder: './assets/img/',
        loadingWeatherData: false,
        messageError: null
    },
    methods: {
        searchCity: async function(){
            let messageError = this.messageError
            try{
                this.cities = await AccuWeatherApi.get(
                    '/locations/v1/cities/autocomplete?apikey=' + API_TOKEN + '&q=' + this.city + '&language=pt-br')
                    .then(function(response){
                        if(response.data){
                            return response.data
                        }
                        throw 'Erro ao buscar cidades, tente novamente, se o erro persistir verifique seu acesso à API.'
                    }).catch(function(error){
                        throw 'Erro ao buscar cidades, tente novamente, se o erro persistir verifique seu acesso à API.'
                    })
            } catch(e){
                this.messageError = e
            }
        },
        getWeather: async function(){
            this.loadingWeatherData = true
            try{
                this.weatherData = await AccuWeatherApi.get('/forecasts/v1/daily/1day/' + this.cityKey + '?apikey=' + API_TOKEN + '&language=pt-br&metric=true')
                .then(function(response){
                    if(response.data){
                        return response.data
                    }
                    throw 'Erro ao carregar as informações do clima, tente novamente, se o erro persistir verifique seu acesso à API.'
                }).catch(function(e){
                    throw 'Erro ao carregar as informações do clima, tente novamente, se o erro persistir verifique seu acesso à API.'
                })
                if(this.weatherData){
                    this.setIcon(this.weatherData.DailyForecasts[0].Day.IconPhrase)
                }
            } catch(e){
                this.messageError = e
            }
            this.loadingWeatherData = false
        },
        setIcon: function(text){
            if(text.includes('ensolarado')){
                this.icon = 'sun.png'
                return
            } if(text.includes('Predominantemente nublado')){
                this.icon = 'partly-cloudy.png'
                return
            } if(text.includes('nublado')){
                this.icon = 'cloudy.png'
                return
            } if(text.includes('nevando')){
                this.icon = 'snowing.png'
                return
            } if(text.includes('Pancadas de chuva')){
                this.icon = 'raining.png'
                return
            } if(text.includes('chuva')){
                this.icon = 'light-rain.png'
                return
            } else {
                this.icon = 'celsius.jpg'
                return
            }
        },
        newSearch: function(){
            this.city = null
            this.weatherData = null
            this.cityKey = null
        },
        setMessageError: function(message){
            this.messageError = message
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
```ts
PlugIn tool is installing....
Plug-In is installing: weather-suite  v1.0.0
Plug-In intsall successfully and save it weather-suite  and 1!..
Plugin Install successfully in the registry

📡 Fetching Live Real-Time Weather from OpenWeatherMap API...

{
  success: true,
  status: 'success',
  message: 'Live wather for Lucknow , IN fetch suuccssfully city ',
  data: {
    city: 'Lucknow',
    country: 'IN',
    temperature: 26.99,
    feelsLike: 31.13,
    tempMin: 26.99,
    tempMax: 26.99,
    humidity: '94%',
    pressure: '1004 hPa',
    condition: 'Rain',
    description: 'light rain',
    windSpeed: '1.03 m/s',
    coordinates: { lat: 26.85, lon: 80.9167 }
  },
  rawData: {
    data: {
      coord: { lon: 80.9167, lat: 26.85 },
      weather: [
        {
          id: 500,
          main: 'Rain',
          description: 'light rain',
          icon: '10n'
        }
      ],
      base: 'stations',
      main: {
        temp: 26.99,
        feels_like: 31.13,
        temp_min: 26.99,
        temp_max: 26.99,
        pressure: 1004,
        humidity: 94,
        sea_level: 1004,
        grnd_level: 990
      },
      visibility: 10000,
      wind: { speed: 1.03, deg: 0 },
      rain: { '1h': 0.57 },
      clouds: { all: 100 },
      dt: 1786985610,
      sys: {
        type: 1,
        id: 9176,
        country: 'IN',
        sunrise: 1786925329,
        sunset: 1786972347
      },
      timezone: 19800,
      id: 1264733,
      name: 'Lucknow',
      cod: 200
    }
  },
  error: null,
  meta: {
    executionTimeMs: 889,
    timestamps: 1786985998130,
    requestId: 'a14ef350-3ef3-4a44-979a-167033f838bd',
    agent: { name: 'get_live_weather', version: '1.0.0', status: 'complete' },
    toolDetails: {
      name: 'get_live_weather',
      description: 'Fetches current live temperature and humidity',
      version: '1.0.0'
    }
  }
}
```

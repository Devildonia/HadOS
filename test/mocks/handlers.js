import { http, HttpResponse } from 'msw';

export const handlers = [
    // Mock the Radio API fetch in WebampApp.js
    http.get('https://de1.api.radio-browser.info/json/stations/bytag/90s', () => {
        return HttpResponse.json([
            {
                name: "Mock 90s Radio Station",
                url_resolved: "http://stream.mock/90s",
                countrycode: "US"
            },
            {
                name: "Retro Hits 90s",
                url_resolved: "http://stream.mock/retro",
                countrycode: "UK"
            }
        ]);
    }),

    // Add other mocks here as needed (like Weather API or asset fetches)
];

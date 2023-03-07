This project is inspired by my own convenience. Currently, HSL(Helsinki Regional Transport) app offers transportation timetables only if the user selects a certain route or selects stops as their "favorite" stops from their account. However, there is currently no website/application which displays all the available transportation schedules nearby the current user's location or selected street address within the Uusimaa region (Helsinki/Espoo/Vantaa). Using this application (HSL home info), users can conveniently look up the real-time transportation schedules nearby their home/work/or wherever.

Currently, map integration is missing but will be constantly improved and added in the future.

The project is using HSL's Routing API ([digitransit Routing API](https://digitransit.fi/en/developers/apis/1-routing-api/)) to get the latest transportation schedule and the stop information and front-end is own-made using React.js. The project is deployed and is available at [here](https://d2v9b00naokpu1.cloudfront.net/schedule).


# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

The project is deployed at AWS cloudfront. However, if you want to run the project locally, in project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.
# Documentation

## What the App does

1. Displays list of the top 15 most populous cities in the world.
2. You can remove cities from the initial list.
3. You can set/remove your favourite cities from the initial list.
4. You can view details of a city including its weather information.
5. You can create, edit, and delete notes in the details page of a city.
6. You can set/remove a city as favourite within its details page.
7. You can toggle between celsius and fahrenheit temperature values.
8. You can search for cities and add them as favourites in their details page.
9. The app can get a user's current location (with permission of course) and display details of the city.
10. The App works offline using IndexDB as storage.

## What the App cannot do

1. Times displayed in the app are not in real time.

## Notable Tools

1. React Query - for caching and persisting data.
2. DraftJs - for writing notes.
3. Styled Components - for styles.

## Development

1. Clone the repo
2. Install dependencies: `yarn install`
3. Create a .env file and declare the environment variables as it is in .env.example file.
4. Run tests with `yarn test`
5. Run the app with `yarn start`

# Services

* **Data Services** - the primary function of these services is to access the database, there may be some abstraction and logic applied to the data but it is fairly light
* **Logic Services** - an abstraction of some kind of logic with no direct database interaction
* **Hybrid Services** - a combination of Data and Logic services, these services interact with the data but also offer a level of abstraction beyond the string data services

All services are exported as ES6 classes that are then instantiated where needed, making them easy to mock in testing.

Any service that interacts with the database will take the database connection pool as an argument upon construction.

## Data Services

### Tea Categories

### Teas

### Users

## Logic Services

### Authentication

### encryption

## Hybrid Services

### Password

### Sessions

The sessions service deals with user sessions. Each time a user logs in, they get a session that is stored in the database and included in the token. This allows the user to be logged in via multiple devices and for logging out on one device to not effect the login status on other devices. The session is removed upon logout.

* `start(userId)` - create a session row for the user, returns a promise of the session ID
* `end(sessionId)` - removes the session row, returns a promise of the operation
* `verify(userId, sessionId)` -  determines if the session exists, returns a promise of true or false

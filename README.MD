

# Rate limiter

### 

This program implements a rate limiter built in a time-boxed approach. The rate limiter grants or denies request access to given endpoints, based on the amount of remaining tokens available. 

A token bucket algorithm has been utilised to calculate the amount of tokens, based on each given endpoints' burst and sustained limit.

### To run program

1. `npm i` to install all necessary dependencies
2. In the terminal, run `node main.js`
3. To test in the browser, run encoded URL with any of the provided endpoints in config.json, i.e. http://localhost:3000/take?endpoint=GET%20/user/:id or http://localhost:3000/take?endpoint=PATCH%20/user/:id or http://localhost:3000/take?endpoint=POST%20/userinfo

### To run tests

1. `npx mocha` + `test_file.test.js`

### Dependencies

The `express` library has been utilized to implement the server side functionalities.

The `mocha` libraries have been utilized for basic testing of the various modules, with the goal of improving maintainability. 

Additionally, I utilize `dotenv` to securely store API keys and endpoints.

### Other known considerations - i.e. edge cases (if I were to scale the solution)

1. Concurrent requests: there might be potential race conditions in the event multiple requests are made simulateneously to the same endpoint where the token count is not properly synchronized. Given more time, I'd consider implementing a locking/sync mechanism to cover this edge case.
2. We are assuming positive burst and sustained rates but in a real world scenario, there could potentially be negative or zero burst and sustained rates.
3. Token expiry: currently we are not handling the edge case where a token might expire, but it is a reasonable expectation to handle in a real-world scenario.
4. Token refills calculation: as we're using the Date.now() object to calculate last refill time, we run the risk of encountering precision issues over time, when calculating the number of tokens to refill. Ideally, we'd want to improve the algorithm to improve the precision of calculation.
5. Test: ideally we'd want to also write some tests to cover the middleware section of the code

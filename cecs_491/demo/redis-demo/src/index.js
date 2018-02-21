
// IMPORTANT:
//  Code was structured so that the outputs are displayed in a synchronous manner.
//  It is advisable to look at flatIndex.js to understand the ioredis APIs


import Redis from 'ioredis';

// Production approach for handling uncaught errors
// Redis.Promise.onPossiblyUnhandledRejection((error) => {
//     console.log(error.command)
//     console.log(error.command.args)
// });

console.log('Connecting to redis server');

// By default connect to local Redis server - 127.0.0.1:6379
const db = new Redis({
    showFriendlyErrorStack: true,  // Not for production use
    reconnectOnError: function (err) {
        console.log(err.message)
        return false;
    }
});

/*
// Example of other ways to connect to Redis server
const db = new Redis({
    port: 6379,
    host: '127.0.0.1',
    family: 4, // 4 (IPv4) or 6 (IPv6)
    password: 'auth',
    db: 0
});

const db = new Redis('redis://:authpassword@127.0.0.1:6380/4')
*/



// Start from a clean data store
db.flushall()
    .then(() => {
        console.log('-------------- Starting demo ------------------')
    }).then(() => {
        console.log('**Saving a datum')
        // ============ Saving a datum
        db.set('Person', 'Johnny Appleseed')
            .then(() => {
                // ============= Retrieving a datum
                db.get('Person', (err, res) => {
                    console.log(`Callback get - ${res}`);
                }).then(() => {
                    db.get('Person').then((res) => {
                        console.log(`Promise get - ${res}`);
                        console.log('---------------------------');
                    })

                    // ============ Saving a list (allows for dupes, in order)
                    .then(() => {
                        console.log('**Saving a list (allows for dupes, in order)');
                        db.rpush('Names', ['John', 'Jane', 'Bob', 'John'])
                            .then(() => {
                                // ============== Retrieving a list
                                db.lrange('Names', 0, -1)
                                    .then((res) => {
                                        console.log(`Entire List - ${res}`);
                                        console.log('---------------------------');
                                    })

                                    // ============= Saving a "set" (no dupes, no order)
                                    .then(() => {
                                        console.log('**Saving a "set" (no dupes, no order)');

                                        db.sadd('Cities', ['Los Angeles', 'Hollywood', 'Torrence'])
                                            .then(() => {
                                                // ============== Retrieving set
                                                db.smembers('Cities')
                                                    .then((res) => {
                                                        console.log(`Entire Set - ${res}`);
                                                        console.log('---------------------------')
                                                    })

                                                // ================ Saving a complex type aka "Hashes"
                                                .then(() => {

                                                    console.log('**Saving hashes')
                                                    db.hset('Users::01', 'lastName', 'Appleseed');
                                                    db.hset('Users::01', 'firstName', 'Johnny');
                                                    db.hset('Users::01', 'Occupation', 'Farmer');
                                                    db.hset('Users::01', 'Rank', 'Folk Hero');

                                                    db.hmset('Users::02', {
                                                        lastNane: 'Anthony',
                                                        firstName: 'Susan',
                                                        Occupation: 'Activist',
                                                        Rank: 'Historical Figure'
                                                    }).then(() => {
                                                        // Does not work to get all users
                                                        db.hgetall('Users').then((res) => {
                                                            // Note that logging inside a template literal will return [object Object] for res
                                                            console.log(`Users - ${res}`)
                                                            console.log(res)
                                                        }).then(() => {
                                                            // ============== Retrieving a complex type aka "Hahses"
                                                            db.hgetall('Users::01').then((res) => {
                                                                console.log('Users:01')
                                                                console.log(res)
                                                            }).then(() => {
                                                                db.hgetall('Users::02').then((res) => {
                                                                    console.log('Users:02')
                                                                    console.log(res)
                                                                }).then(() => console.log('---------------------------'))


                                                                // ============== Hash Scan Approach
                                                                .then(() => {
                                                                    console.log('**Adding Users Index')
                                                                    db.hmset('Users', {
                                                                        "user::01": "Johnny",
                                                                        "user::02": "Susan"
                                                                    }).then(() => {
                                                                        // ============ Scanning for a pattern
                                                                        let stream = db.hscanStream('Users', {
                                                                            match: 'user::*'
                                                                        });

                                                                        stream.on('data', function (resultKeys) {
                                                                            // `resultKeys` is an array of strings representing key names
                                                                            for (var i = 0; i < resultKeys.length; i++) {
                                                                            console.log(resultKeys[i]);
                                                                            }
                                                                        });
                                                                        stream.on('end', function () {
                                                                            console.log('---------------------------');
                                                                            console.log('----------------------- Demo Complete --------------------');
                                                                        });
                                                                    })
                                                                });
                                                            });
                                                        });
                                                    });
                                                });
                                            });

                                    });
                            });
                    });

                });
            });
    });




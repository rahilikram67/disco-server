const axios = require("axios")


const { Promise } = require("bluebird")
Promise.map([
    axios.get("https://www.google.com"),
    axios.get("").catch(e => { }),
    axios.get("https://www.facebook.com"),
], function (i) {
    //console.log("Shooting operation", i?.status);
    return i?.status
}, { concurrency: 10 }).then(console.log)
const bootcampers = require("../data/bootcampers.json");
const facts = require("../data/facts.json");

let provided = [];

facts.forEach(fact => {
    if (fact.reveal === "True") {
        provided = [...provided, fact.who];
    }
});

let needed = bootcampers.filter(bootcamper => {
    if (provided.indexOf(bootcamper) === -1) {
        return true;
    }
});

console.log({
    Facts: facts.length,
    Bootcapmers: bootcampers.length,
    Missing: needed.length,
    Who: needed
});

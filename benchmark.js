const Benchmark = require("benchmark");
const suite = new Benchmark.Suite();

const testArray = new Array(1000).fill(0).map((_, i) => i);

Array.prototype.loop = function(callback) {
        let l = this.length,
            array = this,
            i = 0;
        for (; i < l; i++) {
            callback(array[i]);
        }
}

suite.add("forEach", function() {
        let sum = 0;
        testArray.forEach(elem => sum = sum + elem);
    })

    .add("loop", function() {
        let sum = 0;
        testArray.loop(elem => sum = sum + elem);
    })

    .add("map", function() {
        let sum = 0;
        testArray.map(elem => { sum = sum + elem; return elem; });
    })

    .add("for of", function() {
        let sum = 0;
        for (let elem of testArray) {
            sum = sum + elem;
        }
    })

    .add("for i", function() {
        let sum = 0;
        let l = testArray.length;
        let i = 0;
        for (; i < l; i++) {
            let elem = testArray[i]
            sum = sum + elem;
        }
    })

    .add("for i--", function() {
        let sum = 0;
        let i = testArray.length - 1;
        for (; i >= 0; i--) {
            let elem = testArray[i];
            sum = sum + elem;
        }
    })

    .add("while", function() {
        let sum = 0;
        let l = testArray.length;
        let i = 0;
        while (i < l) {
            let elem = testArray[i];
            sum = sum + elem;
            i++;
        }
    })

    .on("cycle", function(event) {
        console.log(String(event.target));
    })

    .on("complete", function() {
        console.log("Fastest is: " + this.filter("fastest").map("name"));
    })

    .run();
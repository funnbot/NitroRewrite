const Benchmark = require("benchmark");
const suite = new Benchmark.Suite();

const a = false,
    b = false,
    c = false,
    d = false,
    e = false,
    f = false,
    g = false;


suite.add("old all false", function() {
        if (!a && !b && !c && !d && !e && !f && !g) return;
        else return;
    })
    .add("new all false", function() {
        if (!a * !b * !c * !d * !e * !f * !g) return;
        else return;
    })
    .add("old one false", function() {
        if (!a || !b || !c || !d || !e || !f || !g) return;
        else return;
    })
    .add("new one false", function() {
        if (!a + !b + !c + !d + !e + !f + !g) return;
        else return;
    })
    .add("old all true", function() {
        if (a && b && c && d && e && f && g) return;
        else return;
    })
    .add("new all true", function() {
        if (!!a * !!b * !!c * !!d * !!e * !!f * !!g) return;
        else return;
    })
    .add("old one true", function() {
        if (a || b || c || d || e || f || g) return;
        else return;
    })
    .add("new one true", function() {
        if (!!a + !!b + !!c + !!d + !!e + !!f + !!g) return;
        else return;
    })

    .on("cycle", function(event) {
        console.log(String(event.target));
    })

    .on("complete", function() {
        console.log("Fastest is: " + this.filter("fastest").map("name"));
    })

    .run();

/*
const testArray = new Array(1000).fill(0).map((_, i) => i);

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
    })*/
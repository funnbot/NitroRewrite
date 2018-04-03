const Benchmark = require("benchmark");
const suite = new Benchmark.Suite();

const a = false,
    b = false,
    c = false,
    d = false,
    e = false,
    f = false,
    g = false;

suite.add("string smol", function() {
    const t1 = "294875209348572093847520938475209345720934570298475";
    const t2 = "294875209348572093847520938475209345720934570298475"
    return t1 == t2;
})

.add("bigint smol", function() {
    const t1 = 294875209348572093847520938475209345720934570298475n;
    const t2 = 394875209348572093847520938475209345720934570298475n;
    return t1 === t2;
})

.add("string med", function() {
    const t1 = "2948752093485720938475209384752093457209345702984752394582094582093485029345709186234817249857239485720394571209384248973252774329";
    const t2 = "3948752093485720938475209384752093457209345702984752394582094582093485029345709186234817249857239485720394571209384248973252774329"
    return t1 === t2;
})

.add("bigint med", function() {
    const t1 = 2948752093485720938475209384752093457209345702984752394582094582093485029345709186234817249857239485720394571209384248973252774329n;
    const t2 = 3948752093485720938475209384752093457209345702984752394582094582093485029345709186234817249857239485720394571209384248973252774329n;
    return t1 === t2;
})

.add("string huge", function() {
    const t1 = "29487520934857209384752093847520934572093457029847523945820945820934850293457091862348172498572394857203945712093849294852039846502934870294652948652934856029452098379068059162346198240571293601956102938470149586103298471049568102938471093568103984710945836";
    const t2 = "39487520934857209384752093847520934572093457029847523945820945820934850293457091862348172498572394857203945712093849294852039846502934870294652948652934856029452098379068059162346198240571293601956102938470149586103298471049568102938471093568103984710945836"
    return t1 === t2;
})

.add("bigint huge", function() {
    const t1 = 29487520934857209384752093847520934572093457029847523945820945820934850293457091862348172498572394857203945712093849294852039846502934870294652948652934856029452098379068059162346198240571293601956102938470149586103298471049568102938471093568103984710945836n;
    const t2 = 39487520934857209384752093847520934572093457029847523945820945820934850293457091862348172498572394857203945712093849294852039846502934870294652948652934856029452098379068059162346198240571293601956102938470149586103298471049568102938471093568103984710945836n;
    return t1 === t2;
})

.on("cycle", function(event) {
    console.log(String(event.target));
})

.on("complete", function() {
    console.log("Fastest is: " + this.filter("fastest").map("name"));
})

.run();

/*suite.add("old all false", function() {
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

    .run();*/

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
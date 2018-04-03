class Bank {
    constructor(user) {
        this.user = user;
    }

    user() {
        return this.user;
    }

    async credit(amount=0,from=null,desc="Unknown") {
        var root = this;
        var promise = this.user.balance().then(function(bal) {
            root.user.balance(bal+amount).then(function() {
                if (from != null) {
                    from.balance().then(function(balf) {
                        from.balance(balf-amount).then(function() {
                            return(true);
                        })
                    })
                } else {
                    return(true);
                }
            })
        });
        return await promise;
    }

    async debit(amount=0,to=null,desc="Unknown") {
        return credit(-amount,to,desc);
    }

    async balance() {
        var promise = this.user.balance().then(function(bal) {
            return(bal);
        });
        return await promise;
    }

    async setBalance(amount=0) {
        var promise = this.user.balance(amount).then(function() {
            return(true);
        });
        return await promise;
    }
}

module.exports = Bank;

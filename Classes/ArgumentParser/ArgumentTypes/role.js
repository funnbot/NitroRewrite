const idReg = /^(<@&)?[0-9]{17,19}>?$/;
const numReg = /[^0-9]/g;

class RoleArgument {
    static parse(val, msg, arg) {
        if (idReg.test(val)) {
            const id = val.replace(numReg, "");
            var [role, error] = findRoleByID(id, msg);
        } else {
            var [role, error] = findRoleByString(val, msg);
        }
        return { valid: !!role, val: role, error }
    }

    static default () {
        return null;
    }
}

function findRoleByString(val, msg) {
    let matches = msg.guild.roles.filter(r => r.name.toLowerCase().includes(val.toLowerCase()));
    if (matches.size > 1) return [null, matches.size + " roles found, please specify"]; 
    if (matches.size === 1) return [matches.first(), null];

    return [null, "Role with the name `" + val + "` not found."];
}

function findRoleByID(id, msg) {
    const role = msg.guild.roles.get(id);
    return [role, "Role with ID `" + id + "` not found."];
}

module.exports = RoleArgument;
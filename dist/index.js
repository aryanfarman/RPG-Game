"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
const speed = 5;
class Hero {
    constructor(name) {
        this.name = "";
        this.xp = 10;
        this._health = 100;
        this._strength = 10;
        this.name = name;
        this.log = (0, debug_1.default)("app:hero");
        const timeHandler = setInterval(() => {
            //this.log("hi from",this.name);
            this.strength--;
            if (this.heroDead()) {
                clearInterval(timeHandler);
            }
        }, 5000 / speed);
    }
    ;
    set strength(s) {
        this._strength = s;
    }
    ;
    get strength() {
        return this._strength;
    }
    set health(h) {
        this._health = h;
    }
    ;
    get health() {
        return this._health;
    }
    ;
    attack(myClan0, toClan) {
        setTimeout(() => {
            toClan.army.forEach(hero => {
                if (hero.heroDead()) {
                    toClan.army.splice(toClan.army.indexOf(hero), 1);
                    this.log(`Hero ${hero.name} from clan ${toClan.name} died!`);
                }
            });
            myClan0.army.forEach(hero => {
                if (hero.heroDead()) {
                    toClan.army.splice(toClan.army.indexOf(hero), 1);
                    this.log(`Hero ${hero.name} from clan ${myClan0.name} died!`);
                }
            });
            clearTimeout();
        }, 1000);
    }
    heroDead() {
        return this.health <= 0 || this.strength <= 0;
    }
    ;
}
class Knight extends Hero {
    constructor(name = `Knight${Knight.kId++}`) {
        super(name);
        this.sword = 5;
    }
    attack(myClan0, toClan) {
        super.attack(myClan0, toClan);
        const log = (0, debug_1.default)("app:KnightAttack");
        if (!this.sword) {
            //cant attack no weapon
            return;
        }
        let AC = toClan.army.length;
        if (this.xp >= 15) {
            this.sword += 1;
        }
        const target = toClan.army[Math.floor(Math.random() * AC)];
        if (target) {
            this.sword--;
            (target.health < 20) ? target.health = 0 : target.health -= 20;
            this.xp++;
            log(`${this.name}[${this.health}][${this.strength}]  from ${myClan0.name} attacks ${target.name}[${target.health}] from ${toClan.name}`);
        }
    }
}
Knight.kId = 1;
class Archer extends Hero {
    constructor() {
        super(`Archer${Archer.aId++}`);
        this.bow = 30;
    }
    attack(myClan0, toClan) {
        super.attack(myClan0, toClan);
        if (!this.bow) {
            //can not attack
            return;
        }
        let AC = toClan.army.length;
        if (this.xp >= 15) {
            this.bow += 6;
        }
        const targets = [];
        const log = (0, debug_1.default)("app:archerAttack");
        let str = "";
        str += `${this.name}[${this.health}][${this.strength}]  from ${myClan0.name} attacks `;
        if (AC) {
            for (let i = 0; i < AC; i++) {
                if (i == 3) {
                    break;
                }
                targets.push(toClan.army[Math.floor(Math.random() * AC)]);
                (targets[i].health < 10) ? targets[i].health = 0 : targets[i].health -= 10;
                str += `${targets[i].name}[${targets[i].health}] `;
                this.bow -= 2;
            }
            str += `from ${toClan.name}`;
            log(str);
            this.xp++;
        }
    }
}
Archer.aId = 1;
class Soldier extends Hero {
    constructor(name = `Soldier${Soldier.sId++}`) {
        super(name + Soldier.sId++);
        this.sword = 1;
        this.xp = 7;
    }
    attack(myClan0, toClan) {
        super.attack(myClan0, toClan);
        if (!this.sword) {
            //can not attack
            return;
        }
        if (this.xp > 9) {
            const index = myClan0.army.indexOf(this);
            const oldName = this.name;
            myClan0.army[index] = new Knight(`upgraded${oldName}`);
        }
        let AC = toClan.army.length;
        const target = toClan.army[Math.floor(Math.random() * AC)];
        const log = (0, debug_1.default)("app:soldierAttack");
        if (target) {
            (target.health < 10) ? target.health = 0 : target.health -= 10;
            log(`${this.name}[${this.health}][${this.strength}]  from ${myClan0.name} attacks ${target.name}[${target.health}] from ${toClan.name}`);
            this.xp++;
        }
    }
}
Soldier.sId = 1;
class Worker {
    constructor() {
    }
}
class Food {
    constructor(name, kCal) {
        this._kCal = kCal;
        this._name = name;
        this.log = (0, debug_1.default)("app:food");
    }
    get name() {
        return this._name;
    }
    get cal() {
        return this._kCal;
    }
}
class Clan {
    constructor(name, army, foods, workers) {
        this.army = [];
        this.foods = [];
        this.workers = [];
        this.flag = false;
        this.name = name;
        this.army = army;
        this.foods = foods;
        this.workers = workers;
    }
    attackTo(toClan) {
        const myVal = setInterval(() => {
            this.army.forEach((hero) => {
                if (!hero.heroDead() && this.checkStatus(toClan)) {
                    hero.attack(this, toClan);
                    toClan.defenceFrom(this);
                }
                else if (!this.checkStatus(toClan)) {
                    clearInterval(myVal);
                }
            });
            if (!this.checkStatus(toClan)) {
                clearInterval(myVal);
            }
        }, 1000);
    }
    defenceFrom(fromClan) {
        if (this.army.length && fromClan.army.length) {
            this.army.forEach((hero) => {
                if (!hero.heroDead()) {
                    hero.attack(this, fromClan);
                }
            });
        }
        else {
            this.checkStatus(fromClan);
        }
    }
    checkStatus(toClan) {
        const log = (0, debug_1.default)("app:ClanStatus");
        if (!this.army.length && !toClan.army.length) {
            log(`The war between "${this.name}" and "${toClan.name}" was equal!`);
            return false;
        }
        else if (!this.army.length && toClan.army.length) {
            log(`clan "${this.name}" defeated from "${toClan.name}"!`);
            let beforeCapturing = toClan.army.length;
            this.workers.forEach((worker, i) => {
                if (i % 2 == 0 && this.workers.length) {
                    toClan.army.push(new Soldier("CapturedSoldier"));
                }
            });
            this.workers.splice(0, 10);
            log(`new soldiers captured : ${toClan.army.length - beforeCapturing}`);
            log(`${toClan.name}'s new army :`);
            toClan.army.forEach((hero, i) => {
                log(`Hero${i} : ${hero.name}[${hero.health}][${hero.strength}]`);
            });
            toClan.eating();
            return false;
        }
        else if (this.army.length && toClan.army.length) {
            return true;
        }
        //if(this.army.length && !toClan.army.length)
        else if (this.army.length && !toClan.army.length && !this.flag) {
            this.flag = true;
            log(`clan "${this.name}" won the battle against "${toClan.name}" !`);
            let beforeCapturing = this.army.length;
            toClan.workers.forEach((worker, i) => {
                if (i % 2 == 0 && toClan.workers.length) {
                    this.army.push(new Soldier("CapturedSoldier"));
                }
            });
            toClan.workers.splice(0, 10);
            log(`new soldiers captured : ${this.army.length - beforeCapturing}`);
            log(`${this.name}'s new army :`);
            this.army.forEach((hero, i) => {
                log(`Hero${i} : ${hero.name}[${hero.health}][${hero.strength}]`);
            });
            this.eating();
            return false;
        }
        else {
            return false;
        }
    }
    eating() {
        const log = (0, debug_1.default)("app:eating");
        this.army.forEach(hero => {
            const food = this.foods.pop();
            if (food) {
                log(`${hero.name}[${hero.strength}] eating ${food.name}[${food.cal}] .`);
                hero.strength += food.cal;
            }
        });
    }
}
const knight1 = new Knight();
const archer1 = new Archer();
const soldier1 = new Soldier();
const soldier11 = new Soldier();
const knight2 = new Knight();
const archer2 = new Archer();
const soldier2 = new Soldier();
const knight3 = new Knight();
const archer3 = new Archer();
const soldier3 = new Soldier();
const knight4 = new Knight();
const archer4 = new Archer();
const soldier4 = new Soldier();
const workers1 = new Array();
for (let i = 0; i < 10; i++) {
    workers1.push(new Worker());
}
const foods1 = new Array(10);
for (let i = 0; i < 20; i++) {
    foods1.push(new Food("banana", 10));
}
const clan1 = new Clan("Warriors", [knight1, archer1, soldier1], foods1, workers1);
const clan2 = new Clan("Builders", [knight2, archer2, soldier2], foods1, workers1);
const clan3 = new Clan("Ruthless-Killers", [knight3, archer3, soldier3, soldier11], foods1, workers1);
const clan4 = new Clan("Peace Seekers", [knight4, archer4, soldier4], foods1, workers1);
clan1.attackTo(clan2);
clan3.attackTo(clan4);
clan1.attackTo(clan3);

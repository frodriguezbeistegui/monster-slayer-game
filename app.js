function getRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
}

const app = Vue.createApp({
    data() {
        return {
            playerHealth: 100,
            monsterHealth: 100,
            canUseSpecialAttack: 0,
            winner: null,
            logMessages: []
        }
    },
    computed: {
        monsterBarStyles() {
            if (this.monsterHealth < 0) {
                return {
                    width: '0%'
                }
            }
            return {
                width: this.monsterHealth + '%'
            }
        },
        playerBarStyles() {
            if (this.playerHealth < 0) {
                return {
                    width: '0%'
                }
            }
            return {
                width: this.playerHealth + '%'
            }
        },
        mayUseSpecialAttack() {
            return this.canUseSpecialAttack < 2;
        },
    },
    watch: {
        playerHealth(value) {
            if (value <= 0 && this.monsterHealth <= 0) {
                // a draw
                this.winner = 'draw'
            } else if (value <= 0) {
                // player lost
                this.winner = 'monster'
            }
        },
        monsterHealth(value) {
            if (value <= 0 && this.playerHealth <= 0) {
                // a draw
                this.winner = 'draw'
            } else if (value <= 0) {
                // monster lost
                this.winner = 'player'
            }
        }
    },
    methods: {
        attackMonster() {
            const attackValue = getRandomValue(5, 12)
            this.monsterHealth -= attackValue;
            this.attackPlayer();
            this.addLogMessage('player', 'Attack', attackValue)
        },
        attackPlayer() {
            this.canUseSpecialAttack++; 
            const attackValue = getRandomValue(8, 15)
            this.playerHealth -= attackValue;
            this.addLogMessage('monster', 'Attack', attackValue)
        },
        specialAttackMonster() {
            const attackValue = getRandomValue(10, 20);
            this.monsterHealth -= attackValue;
            this.attackPlayer();
            this.canUseSpecialAttack = 0
            this.addLogMessage('player', 'Special-attack', attackValue)
        },
        healPlayer() {
            this.currentRound++
            const healValue = getRandomValue(8, 20);
            if (this.playerHealth + healValue > 100) {
                this.playerHealth = 100;
            } else {
                this.playerHealth += healValue;
            }
            this.attackPlayer();
            this.addLogMessage('player', 'heal', healValue);
        },
        restartGame() {
            this.playerHealth = 100;
            this.monsterHealth = 100;
            this.canUseSpecialAttack = 0;
            this.winner = null;
            this.logMessages = [];
        },
        surrender() {
            this.winner = 'monster'
        },
        addLogMessage(who, what, value) {
            this.logMessages.unshift({
                actionBy: who,
                actionType: what,
                actionValue: value
            });
        }
    },
})

app.mount('#game')

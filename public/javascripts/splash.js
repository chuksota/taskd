import {getLeaderboard } from "./productivityScore.js";

//leaderboard-------------------------------------------------------------------
const leaderboard = document.querySelector(".score-display")

async function setLeaderboard() {
    const { scoreboard } = await getLeaderboard()
    scoreboard.forEach((score, i) => {
        let userScore = document.createElement('li')

        let username = document.createElement('span')
        username.innerHTML = `${i+1}.${score.userName}`
        userScore.appendChild(username)

        // let spacer = document.createElement('span')
        // spacer.innerHTML='---'
        // userScore.appendChild(spacer)

        let pScore = document.createElement('span')
        pScore.innerHTML = `${score.productivityScore}`
        userScore.appendChild(pScore)

        leaderboard.appendChild(userScore)
    });

    return scoreboard
}

window.addEventListener("DOMContentLoaded", async (event) => {
    setLeaderboard()
})

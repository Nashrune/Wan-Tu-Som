document.addEventListener('DOMContentLoaded', () => {
    let userScore = 0;
    let computerScore = 0;
    const maxScore = 5;
    let winSoundPlaying = false;
    let loseSoundPlaying = false;

    const userScore_span = document.getElementById('user-label');
    const computerScore_span = document.getElementById('computer-label');
    const scoreElement = document.getElementById('score');
    const result_p = document.querySelector('.result > p');
    const batu_div = document.getElementById('batu');
    const air_div = document.getElementById('air');
    const burung_div = document.getElementById('burung');
    const endGameMessage = document.getElementById('end-game-message');
    const resultMessage = document.getElementById('result-message');
    const restartBtn = document.getElementById('restart-btn');

    const clickSound = document.getElementById('click-sound');
    const winSound = document.getElementById('win-sound');
    const loseSound = document.getElementById('lose-sound');

    function playSound(sound, loop = false, volume = 1.0) {
        sound.currentTime = 0; // Rewind to the start
        sound.volume = volume; // Set volume
        sound.loop = loop; // Set loop
        sound.play().catch(error => console.error('Error playing sound:', error));
    }

    function stopSound(sound) {
        sound.pause();
        sound.currentTime = 0; // Reset to the start
        sound.loop = false; // Ensure loop is disabled
    }

    function getComputerChoice() {
        const choices = ['batu', 'air', 'burung'];
        const randomNumber = Math.floor(Math.random() * 3);
        return choices[randomNumber];
    }

    function convertToWord(choice) {
        if (choice === 'batu') return "Batu";
        if (choice === 'air') return "Air";
        return "Burung";
    }

    function win(userChoice, computerChoice) {
        userScore++;
        scoreElement.innerHTML = `${userScore} - ${computerScore}`;
        result_p.innerHTML = `${convertToWord(userChoice)} beats ${convertToWord(computerChoice)}. You win!`;
        
        // If user wins and the score reaches the max score
        if (userScore >= maxScore) {
            resultMessage.innerHTML = "Congratulations! You won the game!";
            endGameMessage.classList.remove('hidden');
            playSound(winSound, true, 0.5); // Play win sound with 50% volume and loop
            winSoundPlaying = true;
            if (loseSoundPlaying) stopSound(loseSound);
        }
    }

    function lose(userChoice, computerChoice) {
        computerScore++;
        scoreElement.innerHTML = `${userScore} - ${computerScore}`;
        result_p.innerHTML = `${convertToWord(computerChoice)} beats ${convertToWord(userChoice)}. You lose!`;

        // If computer wins and the score reaches the max score
        if (computerScore >= maxScore) {
            resultMessage.innerHTML = "Sorry, you lost the game.";
            endGameMessage.classList.remove('hidden');
            playSound(loseSound, true); // Play lose sound with default volume and loop
            loseSoundPlaying = true;
            if (winSoundPlaying) stopSound(winSound);
        }
    }

    function draw(userChoice, computerChoice) {
        result_p.innerHTML = `${convertToWord(userChoice)} equals ${convertToWord(computerChoice)}. It's a draw!`;
    }

    function resetGame() {
        userScore = 0;
        computerScore = 0;
        scoreElement.innerHTML = `${userScore} - ${computerScore}`;
        result_p.innerHTML = "Make your move";
        endGameMessage.classList.add('hidden');
        // Stop any playing sounds
        if (winSoundPlaying) stopSound(winSound);
        if (loseSoundPlaying) stopSound(loseSound);
        winSoundPlaying = false;
        loseSoundPlaying = false;
    }

    function game(userChoice) {
        if (userScore >= maxScore || computerScore >= maxScore) return;

        playSound(clickSound); // Play click sound when a choice is made

        const computerChoice = getComputerChoice();
        
        // Add immediate visual feedback
        document.getElementById(userChoice).classList.add('selected');
        setTimeout(() => document.getElementById(userChoice).classList.remove('selected'), 300);

        switch (userChoice + computerChoice) {
            case 'batuburung':
            case 'airbatu':
            case 'burungair':
                win(userChoice, computerChoice);
                break;
            case 'batuaie':
            case 'airburung':
            case 'burungbatu':
                lose(userChoice, computerChoice);
                break;
            case 'batubatu':
            case 'airair':
            case 'burungburung':
                draw(userChoice, computerChoice);
                break;
        }
    }

    batu_div.addEventListener('click', () => game('batu'));
    air_div.addEventListener('click', () => game('air'));
    burung_div.addEventListener('click', () => game('burung'));
    restartBtn.addEventListener('click', resetGame);
});

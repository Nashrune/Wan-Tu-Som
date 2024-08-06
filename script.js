document.addEventListener('DOMContentLoaded', () => {
    let userScore = 0;
    let computerScore = 0;
    const maxScore = 5;
    let gameEnded = false;

    const userScoreSpan = document.getElementById('user-label');
    const computerScoreSpan = document.getElementById('computer-label');
    const scoreElement = document.getElementById('score');
    const resultP = document.querySelector('.result > p');
    const batuDiv = document.getElementById('batu');
    const airDiv = document.getElementById('air');
    const burungDiv = document.getElementById('burung');
    const endGameMessage = document.getElementById('end-game-message');
    const finalResult = document.getElementById('final-result');
    const restartBtn = document.getElementById('restart-btn');

    const clickSound = document.getElementById('click-sound');
    const winSound = document.getElementById('win-sound');
    const loseSound = document.getElementById('lose-sound');

    const userChoiceImg = document.getElementById('user-choice-img');
    const computerChoiceImg = document.getElementById('computer-choice-img');
    const resultText = document.getElementById('result-text');

    const idleImgSrc = 'images/idle.png'; // Set default image for user
    const idleCompImgSrc = 'images/idle.png'; // Set default image for computer

    let userChoices = [];

    function playSound(sound, loop = false, volume = 1.0) {
        sound.currentTime = 0;
        sound.volume = volume;
        sound.loop = loop;
        sound.play().catch(error => console.error('Error playing sound:', error));
    }

    function stopSound(sound) {
        sound.pause();
        sound.currentTime = 0;
        sound.loop = false;
    }

    function getRandomChoice() {
        const choices = ['batu', 'air', 'burung'];
        return choices[Math.floor(Math.random() * choices.length)];
    }

    function getComputerChoice() {
        if (userChoices.length < 3) {
            return getRandomChoice();
        }

        // Analyze recent user choices
        const userLastChoices = userChoices.slice(-3);
        const frequency = { 'batu': 0, 'air': 0, 'burung': 0 };

        userLastChoices.forEach(choice => frequency[choice]++);

        // Predict the user's next move based on the most frequent recent choice
        const mostFrequentChoice = Object.keys(frequency).reduce((a, b) => frequency[a] > frequency[b] ? a : b);

        // Define winning move based on the user's most frequent choice
        const counterChoice = {
            'batu': 'air',
            'air': 'burung',
            'burung': 'batu'
        };

        // 99.4% chance to use counter strategy based on observed pattern
        if (Math.random() < 0.994) {
            return counterChoice[mostFrequentChoice];
        } else {
            // 0.6% chance to choose randomly
            return getRandomChoice();
        }
    }

    function updateChoices(userChoice, computerChoice) {
        userChoiceImg.src = `images/${userChoice}.png`;
        computerChoiceImg.src = `images/${computerChoice}.png`;
        computerChoiceImg.classList.add('flipped');

        userChoiceImg.classList.add('animate');
        computerChoiceImg.classList.add('animate');

        setTimeout(() => {
            userChoiceImg.classList.remove('animate');
            computerChoiceImg.classList.remove('animate');
            computerChoiceImg.classList.remove('flipped');
        }, 2000);
    }

    function updateScore() {
        scoreElement.textContent = `${userScore} - ${computerScore}`;
    }

    function displayResult(winner) {
        if (winner === 'user') {
            resultP.textContent = 'You Win!';
            playSound(winSound, false, 0.5);
        } else if (winner === 'computer') {
            resultP.textContent = 'You Lose!';
            playSound(loseSound, false, 0.5);
        } else {
            resultP.textContent = 'It\'s a Tie!';
        }

        if (userScore >= maxScore) {
            finalResult.textContent = 'Congratulations, You Won the Game!';
            endGameMessage.classList.remove('hidden');
            stopSound(loseSound);
            gameEnded = true;
        } else if (computerScore >= maxScore) {
            finalResult.textContent = 'Sorry, You Lost the Game!';
            endGameMessage.classList.remove('hidden');
            stopSound(winSound);
            gameEnded = true;
        }
    }

    function handleChoice(choice) {
        if (gameEnded) return;

        clickSound.play();
        const computerChoice = getComputerChoice();
        userChoices.push(choice);
        updateChoices(choice, computerChoice);

        if (choice === computerChoice) {
            displayResult('tie');
        } else {
            const winner = determineWinner(choice, computerChoice);
            if (winner === 'user') {
                userScore++;
            } else if (winner === 'computer') {
                computerScore++;
            }
            updateScore();
            displayResult(winner);
        }
    }

    batuDiv.addEventListener('click', () => handleChoice('batu'));
    airDiv.addEventListener('click', () => handleChoice('air'));
    burungDiv.addEventListener('click', () => handleChoice('burung'));

    restartBtn.addEventListener('click', () => {
        userScore = 0;
        computerScore = 0;
        userChoices = [];
        updateScore();
        endGameMessage.classList.add('hidden');
        userChoiceImg.src = idleImgSrc;
        computerChoiceImg.src = idleCompImgSrc;
        computerChoiceImg.classList.add('flipped');
        resultP.textContent = 'Choose Batu, Air, or Burung to start the game!';
        gameEnded = false;
        stopSound(winSound);
        stopSound(loseSound);
    });

    function determineWinner(userChoice, computerChoice) {
        const winningConditions = {
            'batu': 'burung',
            'air': 'batu',
            'burung': 'air'
        };

        if (userChoice === computerChoice) return 'tie';
        return winningConditions[userChoice] === computerChoice ? 'user' : 'computer';
    }
});

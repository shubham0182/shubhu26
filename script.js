// --- PASSWORD ---
const CORRECT_PASSWORD = "shubhu"; 
// ----------------

const messageContainer = document.getElementById('message-container');
const flowerNameElement = document.getElementById('flower-name-reveal');
const signatureElement = document.getElementById('shubham-signature');
const flashOverlay = document.getElementById('flash-overlay');
const desktopSuggestion = document.getElementById('desktop-suggestion');
let flowerInterval = null;
let surpriseRevealed = false;
let petalCreationRate = 60; // Base rate (60ms)

function createRosePetal() {
    // Petal creation logic (unchanged)
    const petal = document.createElement('div');
    petal.classList.add('rose-petal');
    
    const startX = Math.random() * 100;
    const duration = Math.random() * 6 + 7;
    const delay = Math.random() * 3;
    const opacity = Math.random() * 0.4 + 0.6;
    const rotationZ = Math.random() * 720 - 360;
    const rotationX = Math.random() * 180 - 90;
    const wobbleX = Math.random() * 40 - 20;

    petal.style.left = `${startX}vw`;
    petal.style.opacity = opacity;
    
    petal.style.setProperty('--rand-x', wobbleX);
    petal.style.setProperty('--rand-deg', rotationZ);
    petal.style.setProperty('--rand-x-rot', rotationX);

    petal.style.animation = `fallAndWobble ${duration}s linear ${delay}s infinite`;

    document.body.appendChild(petal);
    
    setTimeout(() => {
        petal.remove();
    }, (duration + delay) * 1000 + 500);
}

function startFlowerAnimation(rate) {
    // Clears any existing interval and sets a new one with the given rate
    if (flowerInterval) {
        clearInterval(flowerInterval);
    }
    flowerInterval = setInterval(createRosePetal, rate); 
}

function runCaptureSequence() {
    const CAPTURE_DURATION_MS = 10000; // 10 seconds

    // 1. Initial Flash
    flashOverlay.style.transition = 'opacity 0.05s ease-out';
    flashOverlay.style.opacity = '1';
    setTimeout(() => {
        flashOverlay.style.transition = 'opacity 0.5s ease-in';
        flashOverlay.style.opacity = '0';
    }, 50);

    // 2. Start Capture Mode Visuals & Boost Flowers
    messageContainer.classList.add('capture-mode');
    
    // Speed up petal creation significantly (e.g., from 60ms to 20ms)
    startFlowerAnimation(20); 

    // 3. End Sequence after 10 seconds
    setTimeout(() => {
        messageContainer.classList.remove('capture-mode');
        
        // Return flower creation to the base rate
        startFlowerAnimation(petalCreationRate); 

    }, CAPTURE_DURATION_MS);

}

function showSignature() {
    setTimeout(() => {
        signatureElement.style.opacity = '1';
    }, 1000); 
}

function revealSurprise() {
    if (surpriseRevealed) {
         // If already revealed, treat the tap as the video capture trigger
        runCaptureSequence();
        return;
    }

    // Initial reveal logic
    startFlowerAnimation(petalCreationRate);
    flowerNameElement.classList.add('revealed');
    surpriseRevealed = true;
    messageContainer.style.cursor = 'default';
    showSignature();
}

function checkPassword() {
    const inputElement = document.getElementById('password');
    const password = inputElement.value;
    const form = document.getElementById('password-form');
    const errorMessage = document.getElementById('error-message');

    if (password === CORRECT_PASSWORD) {
        // If correct, proceed to fade out the form and show the message
        form.style.opacity = '0';
        form.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            form.style.display = 'none';
            
            messageContainer.style.display = 'block';
            setTimeout(() => {
                messageContainer.style.opacity = '1';
                messageContainer.style.transform = 'translateY(0)';
            }, 50); 
        }, 500);
        errorMessage.textContent = ''; 
    } else {
        errorMessage.textContent = '❌ Invalid Key. Try again.';
        errorMessage.classList.add('shake');
        inputElement.value = '';
        
        errorMessage.addEventListener('animationend', () => {
            errorMessage.classList.remove('shake');
        }, { once: true });
    }
}
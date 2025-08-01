const deck = document.getElementById("deck");
// Array of card image paths
const cardImages = [
  // Major Arcana
  "00-TheFool.webp",
  "01-TheMagician.webp",
  "02-TheHighPriestess.webp",
  "03-TheEmpress.webp",
  "04-TheEmperor.webp",
  "05-TheHierophant.webp",
  "06-TheLovers.webp",
  "07-TheChariot.webp",
  "08-Strength.webp",
  "09-TheHermit.webp",
  "10-WheelOfFortune.webp",
  "11-Justice.webp",
];
// This function renders the deck of cards, shuffling them and creating card elements.
function renderDeck() {
  deck.innerHTML = "";
  //shuffle(cardImages);
  cardImages.forEach((imgSrc, i) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.style.opacity = "0";
    //card.style.transform = "scale(1)";

    card.innerHTML = `
      <div class="card-inner">
        <div class="card-back"></div>
        <div class="card-front"
         style="background-image: url('../cards/${imgSrc}')"></div>
      </div>
    `;
    // Add click sound effect
    card.addEventListener("click", () => {
      // ? Play card flip sound IMMEDIATELY on any click
      const flipAudio = document.getElementById("card-flip-audio");
      if (flipAudio && soundEnabled) {
        flipAudio.volume = 0.8;
        flipAudio.currentTime = 0;
        flipAudio.play();
      }
      // If card is already flipped, open modal with image
      if (card.classList.contains("flipped")) {
        const cardFront = card.querySelector(".card-front");
        const imgSrc = cardFront.style.backgroundImage.slice(5, -2);
        const isReversed = cardFront.classList.contains("reversed");
        openModal(imgSrc, isReversed);
        return;
      }
      // If not flipped, flip the card
      card.classList.add("flipped");
    });
    deck.appendChild(card);
    // Animation GSAP : apparition en cascade
    // Calcul du centre du deck
    const deckRect = deck.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const deckCenterX = deckRect.left + deckRect.width / 2;
    const cardCenterX = cardRect.left + cardRect.width / 2;
    const offsetX = deckCenterX - cardCenterX;

    gsap.fromTo(card, { opacity: 0, y: 200, x: offsetX, scale: 0.9},
      {
        opacity: 1,
        y: 0,
        scale: 1,
        delay: i * 0.2,
        duration: 0.7,
        ease: "bounce.out",
        onComplete: () => {
          card.style.transform = ""; // Supprime le style inline transform
          card.style.scale = ""; // Supprime le style inline transform
        }
      }
    );
  });
}
// Initial render of the deck
renderDeck();

// Sound toggle logic
const soundToggleIcon = document.getElementById("sound-toggle-icon");
const soundIconImg = document.getElementById("sound-icon-img");
let soundEnabled = true;
// Sound icons
const SOUND_ON_ICON = "../assets/sound-on.svg";
const SOUND_OFF_ICON = "../assets/sound-off.svg";

// Load preference from localStorage if available
if (localStorage.getItem("mysticDrawSound") !== null) {
  soundEnabled = localStorage.getItem("mysticDrawSound") === "true";
}
updateSoundIcon();

soundToggleIcon.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  localStorage.setItem("mysticDrawSound", soundEnabled);
  updateSoundIcon();
});

// ? Updates the sound toggle icon based on the current sound state
function updateSoundIcon() {
  if (soundEnabled) {
    soundIconImg.src = SOUND_ON_ICON;
    soundIconImg.alt = "Sound On";
  } else {
    soundIconImg.src = SOUND_OFF_ICON;
    soundIconImg.alt = "Sound Off";
  }
}

// PARTICLES
particlesJS("particles-js", {
  particles: {
    number: {
      value: 50,
      density: {
        enable: true,
        value_area: 800,
      },
    },
    color: {
      value: "#d4c7f7",
    },
    shape: {
      type: "circle",
    },
    opacity: {
      value: 0.6,
      random: true,
    },
    size: {
      value: 3,
      random: true,
    },
    move: {
      enable: true,
      speed: 1,
      direction: "none",
      random: true,
      out_mode: "out",
    },
  },
  interactivity: {
    events: {
      onhover: {
        enable: false,
      },
      onclick: {
        enable: false,
      },
    },
  },
  retina_detect: true,
});
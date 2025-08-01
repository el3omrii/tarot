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
// this function creates a fake deck of cards for the initial loading animation
function fakeDeck() {
  const deck = document.getElementById("fake-deck");
  deck.innerHTML = "";
   Array(10).fill().forEach((_, i) => {
    const card = document.createElement("div");
    card.classList.add("card");
    deck.appendChild(card);
   });
}
fakeDeck();
// shuffle animation related functions
let cards = document.querySelectorAll(".card");
let cardsMidIndex = Math.floor(cards.length / 2);
let yOffset = 60;
let scaleOffset = 0.02;
let duration = 0.8;
let scaleDuration = duration / 3;
let tl = gsap.timeline({ repeat: 2, yoyoEase: true });

function driftIn() {
  return gsap.timeline().from(".cards", {
    yPercent: -yOffset / 3,
    duration,
    ease: "power2.inOut",
    yoyoEase: true
  });
}

function driftOut() {
  return gsap.timeline().to(".cards", {
    yPercent: yOffset / 3,
    duration,
    ease: "power2.inOut",
    yoyoEase: true
  });
}

function scaleCards() {
  return gsap
    .timeline()
    .to(".card", {
      scale: (i) => {
        if (i <= cardsMidIndex) {
          return 1 - i * scaleOffset;
        } else {
          return 1 - (cards.length - 1 - i) * scaleOffset;
        }
      },
      delay: duration / 3,
      duration: scaleDuration,
      ease: "expo.inOut",
      yoyoEase: true
    })
    .to(".card", { scale: 1, duration: scaleDuration });
}

function shuffleCards() {
  return gsap
    .timeline()
    .set(".card", {
      y: (i) => -i * 0.5
    })
    .fromTo(
      ".card",
      {
        rotate: 45,
        yPercent: -yOffset
      },
      {
        duration,
        rotate: 65,
        yPercent: yOffset,
        stagger: duration * 0.03,
        ease: "expo.inOut",
        yoyoEase: true
      }
    );
}

function shuffleDeckAnimation() {
  // ? Play shuffling sound IMMEDIATELY on any click
    const shuffleAudio = document.getElementById("shuffle-audio");
    if (shuffleAudio && soundEnabled) {
      shuffleAudio.volume = 0.8;
      shuffleAudio.currentTime = 0;
      shuffleAudio.play();
    }
  tl.add(driftIn())
    .add(shuffleCards(), "<")
    .add(scaleCards(), "<")
    .add(driftOut(), "<55%")
    .then(() => {
      // After the shuffle animation, remove the fake deck and render the real deck
      document.getElementById("fake-deck").remove();
      renderDeck();
    });
}
document.addEventListener("DOMContentLoaded", () => {
  // Start the shuffle animation when the DOM is fully loaded
  shuffleDeckAnimation();
});
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

    gsap.fromTo(card, { opacity: 0, y: 200, scale: 0.9},
      {
        opacity: 1,
        y: 0,
        scale: 1,
        delay: i * 0.2,
        duration: 0.7,
        ease: "power2.out",
        onComplete: () => {
          card.style.transform = ""; // Supprime le style inline transform
          card.style.scale = ""; // Supprime le style inline transform
        }
      }
    );
  });
}

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
let flipCount = 0;
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
  //"09-TheHermit.webp",
  "10-WheelOfFortune.webp",
  "11-Justice.webp",
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
  //"10-WheelOfFortune.webp",
  "11-Justice.webp",
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
  //"11-Justice.webp",
];
// This function uses the Fisher-Yates algorithm to shuffle the array in place.
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
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
  shuffle(cardImages);
  let cardDrawn = false; // Pour savoir si une carte a déjà été tirée

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
      // Si une carte a déjà été tirée
      if (cardDrawn) {      
        // If card is already flipped, open modal with image
        if (card.classList.contains("flipped")) {
          const cardFront = card.querySelector(".card-front");
          const imgSrc = cardFront.style.backgroundImage.slice(5, -2);
          const isReversed = cardFront.classList.contains("reversed");
          openModal(imgSrc, isReversed);
        }
          return;
      }
      // If not flipped, flip the card
      card.classList.add("flipped");
      cardDrawn = true; 
      // Désactive toutes les autres cartes
      document.querySelectorAll("#deck .card").forEach(c => {
        if (c !== card) {
          c.classList.add("inactive");
          c.style.pointerEvents = "none";
        } else {
           c.classList.remove("inactive");
           c.style.pointerEvents = "auto";
        }
      });
    
      // Effet sonore
      const flipAudio = document.getElementById("card-flip-audio");
      if (flipAudio && soundEnabled) {
        flipAudio.volume = 0.8;
        flipAudio.currentTime = 0;
        flipAudio.play();
      }
      const cardFront = card.querySelector(".card-front");
      const imgSrc = cardFront.style.backgroundImage.slice(5, -2);
  
      setTimeout(() => openModal(imgSrc), 2000);

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
          card.style.rotate = ""; // Supprime le style inline transform
          card.style.translate = ""; // Supprime le style inline transform
        }
      }
    );
  });
}

// Modal functionality
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-image");
const closeBtn = document.querySelector(".close-button");

// This function opens the modal with the selected card image and its meanings.
function openModal(imgSrc, isReversed = false) {
  modalImg.src = imgSrc;
  modal.classList.remove("hidden");
  document.body.classList.add("modal-open");

  // Extract card filename
  const cardFile = imgSrc.split("/").pop();
  const meaning = cardMeanings[cardFile];

  // Set card name and meanings
  const cardNameElem = document.getElementById("card-name");
  const uprightElem = document.getElementById("meaning-upright");
  const reversedElem = document.getElementById("meaning-reversed");
  const adviceElem = document.getElementById("card-advice");

  if (meaning) {
    cardNameElem.textContent = meaning.name;
    uprightElem.textContent = isReversed ? "" : meaning.upright;
    reversedElem.textContent = isReversed ? meaning.reversed : "";
    uprightElem.style.display = isReversed ? "none" : "block";
    reversedElem.style.display = isReversed ? "block" : "none";
    adviceElem.textContent = isReversed ? meaning.advice.reversed : meaning.advice.upright;
    adviceElem.style.display = "block";
  } else {
    cardNameElem.textContent = "";
    uprightElem.textContent = "";
    reversedElem.textContent = "";
    uprightElem.style.display = "none";
    reversedElem.style.display = "none";
    adviceElem.textContent = "";
    adviceElem.style.display = "none";
  }

  // Animate image
  modalImg.classList.remove("animate");
  void modalImg.offsetWidth;
  modalImg.classList.add("animate");
}

function closeModal() {
  modal.classList.add("hidden");
  modalImg.src = "";
  document.body.classList.remove("modal-open"); // Show footer
}

// Click outside or on button to close
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  } 
  else if (e.target === closeBtn) {
    closeModal();
  }
});

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

//Card meanings
// Card meanings data
const cardMeanings = {
  // Major Arcana
  "00-TheFool.webp": {
    name: "The Fool",
    upright: "Beginnings, innocence, spontaneity, a free spirit.",
    reversed: "Holding back, recklessness, risk-taking.",
    advice: {
      upright: "Embrace new opportunities with an open mind and heart.",
      reversed: "Pause and consider the risks before acting impulsively.",
    },
  },
  "01-TheMagician.webp": {
    name: "The Magician",
    upright: "Manifestation, resourcefulness, power, inspired action.",
    reversed: "Manipulation, poor planning, untapped talents.",
    advice: {
      upright: "Use your skills and willpower to manifest your goals.",
      reversed: "Focus your energy and avoid manipulation.",
    },
  },
  "02-TheHighPriestess.webp": {
    name: "The High Priestess",
    upright: "Intuition, sacred knowledge, divine feminine.",
    reversed: "Secrets, disconnected from intuition, withdrawal.",
    advice: {
      upright: "Trust your intuition and seek inner wisdom.",
      reversed: "Reconnect with your inner voice and reflect.",
    },
  },
  "03-TheEmpress.webp": {
    name: "The Empress",
    upright: "Femininity, beauty, nature, nurturing, abundance.",
    reversed: "Creative block, dependence on others.",
    advice: {
      upright: "Nurture yourself and others; embrace creativity.",
      reversed: "Find your own strength and creativity.",
    },
  },
  "04-TheEmperor.webp": {
    name: "The Emperor",
    upright: "Authority, structure, control, fatherhood.",
    reversed: "Domination, excessive control, rigidity.",
    advice: {
      upright: "Take control and lead with confidence.",
      reversed: "Be flexible and avoid being overly controlling.",
    },
  },
  "05-TheHierophant.webp": {
    name: "The Hierophant",
    upright: "Tradition, conformity, morality, ethics.",
    reversed: "Rebellion, subversiveness, new approaches.",
    advice: {
      upright: "Seek guidance from tradition or a mentor.",
      reversed: "Consider new perspectives and question tradition.",
    },
  },
  "06-TheLovers.webp": {
    name: "The Lovers",
    upright: "Love, harmony, relationships, values alignment.",
    reversed: "Imbalance, misalignment of values, disharmony.",
    advice: {
      upright: "Make choices aligned with your values.",
      reversed: "Restore balance and communicate openly.",
    },
  },
  "07-TheChariot.webp": {
    name: "The Chariot",
    upright: "Control, willpower, success, determination.",
    reversed: "Lack of control, aggression, self-doubt.",
    advice: {
      upright: "Stay focused and drive forward with confidence.",
      reversed: "Regain control and avoid rash actions.",
    },
  },
  "08-Strength.webp": {
    name: "Strength",
    upright: "Courage, persuasion, influence, compassion.",
    reversed: "Self-doubt, weakness, insecurity.",
    advice: {
      upright: "Face challenges with compassion and resolve.",
      reversed: "Believe in yourself and your abilities.",
    },
  },
  "09-TheHermit.webp": {
    name: "The Hermit",
    upright: "Soul-searching, introspection, being alone.",
    reversed: "Isolation, loneliness, withdrawal.",
    advice: {
      upright: "Take time for introspection and seek inner truth.",
      reversed: "Reconnect with others and share your wisdom.",
    },
  },
  "10-WheelOfFortune.webp": {
    name: "Wheel of Fortune",
    upright: "Good luck, karma, life cycles, destiny.",
    reversed: "Bad luck, resistance to change, breaking cycles.",
    advice: {
      upright: "Embrace change and trust the cycles of life.",
      reversed: "Let go of resistance and accept change.",
    },
  },
  "11-Justice.webp": {
    name: "Justice",
    upright: "Justice, fairness, truth, law.",
    reversed: "Unfairness, lack of accountability, dishonesty.",
    advice: {
      upright: "Act with integrity and seek balance.",
      reversed: "Take responsibility and correct injustices.",
    },
  },
  "12-TheHangedMan.webp": {
    name: "The Hanged Man",
    upright: "Pause, surrender, letting go, new perspectives.",
    reversed: "Delays, resistance, stalling.",
    advice: {
      upright: "Let go and see things from a different angle.",
      reversed: "Release resistance and allow change.",
    },
  }
};

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
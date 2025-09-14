let flipCount = 0;
const deck = document.getElementById("deck");
// Array of card image paths
const cardImages = [
  // Major Arcana
  "01.jpg",
  "02.jpg",
  "03.jpg",
  "04.jpg",
  "05.jpg",
  "06.jpg",
  "07.jpg",
  "08.jpg",
  "09.jpg",
  "10.jpg",
  "11.jpg",
  "12.jpg",
  "13.jpg",
  "14.jpg",
  "15.jpg",
  "16.jpg",
  "17.jpg",
  "18.jpg",
  "19.jpg",
  "20.jpg",
  "21.jpg",
  "22.jpg",
  "23.jpg",
  "24.jpg",
  "25.jpg",
  "26.jpg",
  "27.jpg",
  "28.jpg",
  "29.jpg",
  "30.jpg",
  "31.jpg",
  "32.jpg",
  "33.jpg"   
];
let cardMeaning = {};
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
   cardImages.forEach((imgSrc, i) => {
    const card = document.createElement("div");
    card.innerHTML = `
      <div class="deck-card" style="background-image: url('../../cards/${imgSrc}');">
      </div>`;
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
      //document.getElementById("deck").style.height = "100vw";
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
        <div class="card-back" style="background-image: url('../../cards/${imgSrc}"></div>
        <div class="card-front">
          <div class="name"></div>
          <div class="divider"></div>
          <div class="action"></div>
          <div class="prayer"></div>
        </div>
      </div>
    `;
    // Add click sound effect
    card.addEventListener("click", async () => {
      // Si une carte a déjà été tirée
      if (cardDrawn) {      
        // If card is already flipped, open modal with image
        if (card.classList.contains("flipped")) {
          const cardFront = card.querySelector(".card-back");
          const imgSrc = cardFront.style.backgroundImage.slice(5, -2);
          console.log(imgSrc);
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
      const imgSrc = card.querySelector(".card-back").style.backgroundImage.slice(5, -2);
      let params = new URLSearchParams(document.location.search);
      cardMeaning = await fetch(`https://oracle-api-lovat.vercel.app/api/cards?token=${params.get('token')}&card=${imgSrc.split('/').pop()}`)
                                .then(response => response.json())
      cardFront.querySelector(".name").textContent = cardMeaning.name;
      cardFront.querySelector(".action").textContent = cardMeaning.action;
      cardFront.querySelector(".prayer").textContent = cardMeaning.prayer;
      setTimeout(() => {
        // Ouvre la modal avec l'image de la carte
        openModal(imgSrc)
      }, 2000);
      document.getElementById("replay").style.opacity = "1";

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
          if( i === cardImages.length -1 ) {
            // Enable all cards after the last animation
            const logo = document.createElement("div");
            logo.classList.add("infinity");
            deck.appendChild(logo);
            logo.style.opacity = "1";
          }
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

  // Set card name and meanings
  const cardNameElem = document.getElementById("card-name");
  const actionElem = document.getElementById("meaning-action");
  const prayerElem = document.getElementById("meaning-prayer");

  if (cardMeaning) {
    cardNameElem.textContent = cardMeaning.name;
    actionElem.textContent = cardMeaning.action;
    actionElem.style.display = "block";

    prayerElem.textContent = cardMeaning.prayer;
    prayerElem.style.display = "block";
  } else {
    actionElem.textContent = "";
    actionElem.style.display = "none";

    prayerElem.textContent = "";
    prayerElem.style.display = "none";
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
const SOUND_ON_ICON = "../../assets/sound-on.svg";
const SOUND_OFF_ICON = "../../assets/sound-off.svg";

// Load preference from localStorage if available
if (localStorage.getItem("drawSound") !== null) {
  soundEnabled = localStorage.getItem("drawSound") === "true";
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
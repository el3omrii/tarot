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
    card.addEventListener("click", () => {
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
      console.log(imgSrc);
      cardFront.querySelector(".name").textContent = cardMeanings[imgSrc.split("/").pop()].name;
        cardFront.querySelector(".action").textContent = cardMeanings[imgSrc.split("/").pop()].action;
        cardFront.querySelector(".prayer").textContent = cardMeanings[imgSrc.split("/").pop()].prayer;
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
  const meaning = cardMeanings[cardFile];

  // Set card name and meanings
  const cardNameElem = document.getElementById("card-name");
  const actionElem = document.getElementById("meaning-action");
  const prayerElem = document.getElementById("meaning-prayer");

  if (meaning) {
    cardNameElem.textContent = meaning.name;
    actionElem.textContent = meaning.action;
    actionElem.style.display = "block";

    prayerElem.textContent = meaning.prayer;
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

//Card meanings
// Card meanings data
const cardMeanings = {
  "01.jpg": {
    "name": "Protection",
    "action": "Allume une bougie blanche et visualise une lumière dorée autour de toi. Tu peux aussi disposer un peu de sel autour de ton espace pour renforcer la barrière énergétique. N’hésite pas à pulvériser le parfum Huit Sacré.",
    "prayer": "Je suis entouré(e) d’une bulle de lumière qui me protège."
  },
  "02.jpg": {
    "name": "Purification",
    "action": "Passe un bâton d’encens ou de la sauge blanche avec une tresse de foin dans chaque pièce. Tu peux aussi utiliser de l’eau ou du sel pour purifier ton espace. N’hésite pas à pulvériser le parfum Huit Sacré.",
    "prayer": "Je libère mon environnement de toute énergie lourde."
  },
  "03.jpg": {
    "name": "Gratitude",
    "action": "Écris trois choses pour lesquelles tu es reconnaissant(e). Lis-les à voix haute pour ancrer la gratitude.",
    "prayer": "Je remercie la vie pour tout ce qu’elle m’offre."
  },
  "04.jpg": {
    "name": "Méditation",
    "action": "Installe-toi confortablement et fais 5 minutes de méditation guidée. Inspire et expire profondément, en te concentrant sur ta lumière intérieure.",
    "prayer": "Je m’accorde un moment de paix intérieure."
  },
  "05.jpg": {
    "name": "Ancrage",
    "action": "Marche pieds nus dans la nature ou visualise des racines sous tes pieds.",
    "prayer": "Je suis solide, stable et connecté(e) à la terre."
  },
  "06.jpg": {
    "name": "Énergie solaire",
    "action": "Place-toi quelques minutes au soleil, les bras ouverts, pour recevoir l’énergie lumineuse. Visualise la lumière qui entre dans ton corps et te remplit de vitalité.",
    "prayer": "Je me recharge grâce à la lumière du soleil."
  },
  "07.jpg": {
    "name": "Intention magique",
    "action": "Écris une intention sur un papier, place-la sous un cristal, puis visualise-la avec force et conviction. N’hésite pas à pulvériser le parfum Huit Sacré.",
    "prayer": "Je crée ma réalité avec amour et conviction."
  },
  "08.jpg": {
    "name": "Rituel de lune",
    "action": "Regarde la lune et exprime un vœu ou une intention. Écris-le sur un papier que tu garderas près de toi.",
    "prayer": "Je fais un vœu à la lune et je l’exprime avec confiance."
  },
  "09.jpg": {
    "name": "Nettoyage énergétique",
    "action": "Fais brûler un bâton d’encens ou de la sauge avec une tresse de foin autour de toi pour purifier l’atmosphère. N’hésite pas à pulvériser le parfum Huit Sacré.",
    "prayer": "Je libère mon corps et mon esprit de toute énergie négative."
  },
  "10.jpg": {
    "name": "Sourire intérieur",
    "action": "Ferme les yeux, inspire profondément et souris intérieurement. Ressens la joie et la paix qui s’installent en toi.",
    "prayer": "Je souris à la vie et à moi-même."
  },
  "11.jpg": {
    "name": "Connexion spirits",
    "action": "Appelle un ange ou un guide spirituel, demande-lui un signe. Sois attentif(ve) aux synchronicités de la journée.",
    "prayer": "Je demande l’aide et la protection de mes anges."
  },
  "12.jpg": {
    "name": "Cristal de confiance",
    "action": "Tiens un cristal dans ta main, visualise-toi rempli(e) de confiance et de force intérieure. N’hésite pas à pulvériser le parfum Huit Sacré.",
    "prayer": "Je suis fort(e) et sûr(e) de moi."
  },
  "13.jpg": {
    "name": "Libération",
    "action": "Écris ce que tu souhaites libérer, brûle ou enterre le papier en visualisant la libération de cette énergie.",
    "prayer": "Je me libère des blocages et des peurs."
  },
  "14.jpg": {
    "name": "Bienveillance",
    "action": "Envoie une pensée de bienveillance à quelqu’un ou à toi-même. Tu peux aussi écrire un message positif à quelqu’un.",
    "prayer": "Je répands la lumière et la bonté autour de moi."
  },
  "15.jpg": {
    "name": "Magie du sel",
    "action": "Place un petit bol de sel dans ta pièce pour absorber les énergies négatives. Change-le régulièrement.",
    "prayer": "Le sel absorbe les énergies négatives et protège mon foyer."
  },
  "16.jpg": {
    "name": "Guérison des cheveux",
    "action": "Masse ton cuir chevelu avec une huile énergétique en visualisant la lumière qui circule dans tes cheveux. Pense à une intention de vitalité et de confiance.",
    "prayer": "Je nourris mes cheveux d’énergie et de vitalité."
  },
  "17.jpg": {
    "name": "Rituel de l’eau sacrée",
    "action": "Place un verre d’eau sur ton autel ou près de ton lit la nuit. Exprime une intention de purification ou de guérison. Bois l’eau le matin ou arrose une plante avec.",
    "prayer": "L’eau sacrée nettoie et recharge mon énergie."
  },
  "18.jpg": {
    "name": "Appel aux spirits guides",
    "action": "Écris une lettre à un esprit guide ou à un ange. Demande conseil ou protection. Brûle la lettre (en sécurité) ou garde-la sous ton oreiller. N’hésite pas à pulvériser le parfum Huit Sacré.",
    "prayer": "Je demande conseil et protection à mes guides."
  },
  "19.jpg": {
    "name": "Nettoyage de l’aura",
    "action": "Visualise-toi entouré(e) d’une lumière dorée. Immerge-toi mentalement dans une cascade de lumière blanche pour nettoyer et purifier ton aura. N’hésite pas à pulvériser le parfum Huit Sacré.",
    "prayer": "Mon aura brille de lumière pure."
  },
  "20.jpg": {
    "name": "Offrande à la nature",
    "action": "Dépose une fleur, une pierre ou un petit mot de gratitude dans la nature, en remerciant la terre pour son soutien et son énergie.",
    "prayer": "Je remercie la terre pour son soutien."
  },
  "21.jpg": {
    "name": "Rituel du sel protecteur",
    "action": "Place un peu de sel dans un petit sachet ou un bol à l’entrée de ta maison ou de ta chambre pour absorber les énergies négatives. N’hésite pas à pulvériser le parfum Huit Sacré.",
    "prayer": "Le sel protège mon foyer et ceux qui y vivent."
  },
  "22.jpg": {
    "name": "Prière de libération",
    "action": "Récite une prière ou une affirmation pour libérer une émotion ou une situation qui te pèse. Visualise-la s’envoler dans la lumière.",
    "prayer": "Je libère ce qui me pèse et je retrouve ma légèreté."
  },
  "23.jpg": {
    "name": "Soin énergétique à distance",
    "action": "Pense à une personne à qui tu veux envoyer de la lumière. Visualise-la entourée d’une bulle de protection et de bien-être. N’hésite pas à pulvériser le parfum Huit Sacré. N’hésite pas également à utiliser un petit Huit Sacré.",
    "prayer": "J’envoie de la lumière et de l’amour à ceux que j’aime."
  },
  "24.jpg": {
    "name": "Rituel de la nouvelle lune",
    "action": "Écris un vœu ou une intention sur un papier lors de la nouvelle lune. Place-le sous un cristal ou une bougie, puis visualise-le avec conviction. N’hésite pas à pulvériser le parfum Huit Sacré. N’hésite pas également à utiliser un petit Huit Sacré.",
    "prayer": "Je plante une graine d’intention pour la nouvelle lune."
  },
  "25.jpg": {
    "name": "Protection du sommeil",
    "action": "Avant de dormir, demande à tes guides ou à un ange de veiller sur ton sommeil. Place un cristal de quartz sous ton oreiller. N’hésite pas à pulvériser le parfum Huit Sacré. N’hésite pas également à utiliser un petit Huit Sacré.",
    "prayer": "Je suis protégé(e) pendant mon sommeil."
  },
  "26.jpg": {
    "name": "Méditation guidée par les guides",
    "action": "Assieds-toi confortablement, ferme les yeux, et demande à un guide spirituel de t’accompagner dans une méditation. Sois attentif(ve) aux messages ou sensations. N’hésite pas à pulvériser le parfum Huit Sacré.",
    "prayer": "Je suis accompagné(e) par mes guides."
  },
  "27.jpg": {
    "name": "Rituel de la bougie blanche",
    "action": "Allume une bougie blanche et récite une prière ou une intention de protection, de purification ou de clarté. N’hésite pas à pulvériser le parfum Huit Sacré.",
    "prayer": "La bougie blanche purifie et protège mon espace."
  },
  "28.jpg": {
    "name": "Nettoyage de l’espace",
    "action": "Passe un bâton d’encens ou de la sauge blanche et une tresse de foin dans chaque pièce pour purifier l’atmosphère et chasser les énergies lourdes. N’hésite pas à pulvériser le parfum Huit Sacré. N’hésite pas également à utiliser un petit Huit Sacré.",
    "prayer": "Mon espace est purifié et harmonieux."
  },
  "29.jpg": {
    "name": "Rituel de gratitude quotidienne",
    "action": "Ecris trois choses pour lesquelles tu es reconnaissant(e) et lis-les à voix haute pour ancrer la gratitude dans ta journée.",
    "prayer": "Je remercie la vie pour chaque cadeau reçu."
  },
  "30.jpg": {
    "name": "Connexion à la source",
    "action": "Visualise une lumière dorée qui descend du ciel et remplit tout ton corps. Ressens la connexion à l’énergie universelle ou à la source. N’hésite pas à pulvériser le parfum Huit Sacré. N’hésite pas également à utiliser un petit Huit Sacré.",
    "prayer": "Je suis un canal de lumière et d’amour."
  },
  "31.jpg": {
    "name": "Rituel d’ancrage",
    "action": "Visualise un cordon de lumière argentée qui relie ton ventre au cœur d’amour de la Terre et un cordon de lumière dorée qui relie ta tête au cœur d’amour de l’univers. Laisse ces énergies bienfaitrices circuler en toi à chaque respiration. Essaie de marcher pieds nus dans la nature ou visualise des racines qui partent de tes pieds et s’enfoncent dans la terre pour t’ancrer et te stabiliser. N’hésite pas à pulvériser le parfum Huit Sacré. N’hésite pas également à utiliser un petit Huit Sacré.",
    "prayer": "Je me relie au cœur d’amour de la Terre et à la lumière de l’univers."
  },
  "32.jpg": {
    "name": "Bouclier de protection",
    "action": "Visualise-toi entouré(e) d’un bouclier de lumière dorée ou violette, impénétrable aux énergies négatives. N’hésite pas à pulvériser le parfum Huit Sacré. N’hésite pas également à utiliser un petit Huit Sacré.",
    "prayer": "Je suis entouré(e) d’un bouclier de lumière infranchissable."
  },
  "33.jpg": {
    "name": "Atelier créatif",
    "action": "Crée un dessin, une peinture ou un collage inspiré par la spiritualité.",
    "prayer": "Je m’exprime librement à travers la création."
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
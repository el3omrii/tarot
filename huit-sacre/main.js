// This script initializes the AOS (Animate On Scroll) library for scroll animations.
function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
window.addEventListener('load', aosInit);
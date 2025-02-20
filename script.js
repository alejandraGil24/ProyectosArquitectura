document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 500);
  });

  gsap.ticker.lagSmoothing(0);

  const stickySection = document.querySelector(".sticky");
  const slidesContainer = document.querySelector(".slides");
  const slider = document.querySelector(".slider");
  const slides = document.querySelectorAll(".slide");

  const stickyHeight = window.innerHeight * 3;
  const totalMove = slidesContainer.scrollWidth - slider.offsetWidth;
  const slideWidth = slides[0].offsetWidth;

  ScrollTrigger.create({
    trigger: stickySection,
    start: "top top",
    end: `+=${stickyHeight}px`,
    scrub: 1,
    pin: true,
    pinSpacing: true,
    onUpdate: (self) => {
      const progress = self.progress;
      const mainMove = progress * totalMove;

      gsap.set(slidesContainer, { x: -mainMove });

      const currentSlide = Math.floor(mainMove / slideWidth);
      const sliderProgress = (mainMove % slideWidth) / slideWidth;

      slides.forEach((slide, index) => {
        const image = slide.querySelector("img");

        if (image) {
          if (index === currentSlide || index === currentSlide + 1) {
            const relativeProgress =
              index === currentSlide
                ? sliderProgress
                : Math.max(sliderProgress - 1, 0);
            const parallaxAmount = relativeProgress * slideWidth * 0.05;

            gsap.set(image, {
              x: parallaxAmount,
              scale: 1,
            });
          } else {
            gsap.set(image, {
              x: 0,
              scale: 1,
            });
          }
        }
      });
    },
  });

  function isTouchDevice() {
    return "ontouchstart" in window || navigator.maxTouchPoints;
  }

  if (isTouchDevice()) {
    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });

    slider.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleGesture();
    });

    function handleGesture() {
      const touchMove = touchStartX - touchEndX;
      const moveAmount = (touchMove / window.innerWidth) * totalMove;

      gsap.to(slidesContainer, { x: `+=${moveAmount}` });
    }
  }
});

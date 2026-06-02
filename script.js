const storySection = document.querySelector(".story");

if (storySection) {
  const revealStory = () => storySection.classList.add("is-visible");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          revealStory();
          observer.disconnect();
        }
      },
      { threshold: 0.28 }
    );

    observer.observe(storySection);
  } else {
    revealStory();
  }
}

const shopTrack = document.querySelector(".shop-track");
const shopPrev = document.querySelector(".shop-prev");
const shopNext = document.querySelector(".shop-next");
const shopFilters = document.querySelectorAll(".shop-filters button");

if (shopTrack && shopPrev && shopNext) {
  const scrollProducts = (direction) => {
    const card = shopTrack.querySelector(".shop-card:not([hidden])");
    const gap = parseFloat(getComputedStyle(shopTrack).columnGap) || 0;
    const amount = card ? (card.getBoundingClientRect().width + gap) * 2 : shopTrack.clientWidth;

    shopTrack.scrollBy({
      left: direction * amount,
      behavior: "smooth",
    });
  };

  shopPrev.addEventListener("click", () => scrollProducts(-1));
  shopNext.addEventListener("click", () => scrollProducts(1));

  const matchesShopFilter = (card, filter) => {
    if (filter === "all") return true;
    if (filter === "stock") return Boolean(card.querySelector(".shop-stock"));
    return card.dataset.category === filter;
  };

  shopFilters.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      shopFilters.forEach((item) => {
        const isActive = item === button;
        item.classList.toggle("is-active", isActive);
        item.setAttribute("aria-pressed", String(isActive));
      });

      shopTrack.querySelectorAll(".shop-card").forEach((card) => {
        card.hidden = !matchesShopFilter(card, filter);
      });

      shopTrack.scrollTo({ left: 0, behavior: "smooth" });
    });
  });
}

const articleTrack = document.querySelector(".article-grid");
const articlePrev = document.querySelector(".article-prev");
const articleNext = document.querySelector(".article-next");

if (articleTrack && articlePrev && articleNext) {
  const scrollArticles = (direction) => {
    const card = articleTrack.querySelector(".article-card");
    const gap = parseFloat(getComputedStyle(articleTrack).columnGap) || 0;
    const amount = card ? card.getBoundingClientRect().width + gap : articleTrack.clientWidth;

    articleTrack.scrollBy({
      left: direction * amount,
      behavior: "smooth",
    });
  };

  articlePrev.addEventListener("click", () => scrollArticles(-1));
  articleNext.addEventListener("click", () => scrollArticles(1));
}

const csrBanner = document.querySelector(".csr-banner");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (csrBanner && !reduceMotion) {
  let mouseX = 0;
  let frameRequested = false;

  const updateCsrParallax = () => {
    const rect = csrBanner.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const scrollProgress = (rect.top + rect.height / 2 - viewportHeight / 2) / viewportHeight;
    const y = Math.max(-24, Math.min(24, -scrollProgress * 34));
    const x = mouseX * 14;

    csrBanner.style.setProperty("--csr-parallax-x", `${x.toFixed(2)}px`);
    csrBanner.style.setProperty("--csr-parallax-y", `${y.toFixed(2)}px`);
    frameRequested = false;
  };

  const requestParallaxUpdate = () => {
    if (!frameRequested) {
      frameRequested = true;
      window.requestAnimationFrame(updateCsrParallax);
    }
  };

  csrBanner.addEventListener("pointermove", (event) => {
    const rect = csrBanner.getBoundingClientRect();
    mouseX = ((event.clientX - rect.left) / rect.width - 0.5) * -1;
    requestParallaxUpdate();
  });

  csrBanner.addEventListener("pointerleave", () => {
    mouseX = 0;
    requestParallaxUpdate();
  });

  window.addEventListener("scroll", requestParallaxUpdate, { passive: true });
  window.addEventListener("resize", requestParallaxUpdate);
  requestParallaxUpdate();
}

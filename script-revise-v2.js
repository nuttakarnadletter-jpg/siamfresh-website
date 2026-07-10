const ACCESS_PASSWORD = "rp-siamfresh";
const ACCESS_KEY = "siamfresh-design-access";
const PREVIEW_HOME = "revise-v2.html";

const isReviseV2Page = () => /(?:^|\/)revise-v2\.html$/.test(window.location.pathname);

const goToPreviewHome = () => {
  if (!isReviseV2Page()) {
    window.location.replace(PREVIEW_HOME);
  }
};

const buildLoginGate = () => {
  if (sessionStorage.getItem(ACCESS_KEY) === "true") {
    document.body.classList.remove("auth-pending");
    goToPreviewHome();
    return;
  }

  const login = document.createElement("section");
  login.className = "design-login";
  login.setAttribute("aria-label", "Design access login");
  login.innerHTML = `
    <div class="design-login-card">
      <img src="assets/logo2.svg" alt="Siam Fresh" />
      <h2>เข้าสู่หน้า Preview</h2>
      <p>กรอกรหัสเข้าชมเพื่อดูดีไซน์ Siam Fresh</p>
      <form class="design-login-form">
        <input type="password" name="password" placeholder="รหัสเข้าชม" autocomplete="current-password" aria-label="รหัสเข้าชม" />
        <button type="submit">เข้าสู่หน้าออกแบบ</button>
        <span class="design-login-error" aria-live="polite"></span>
      </form>
    </div>
  `;

  document.body.appendChild(login);

  const form = login.querySelector("form");
  const input = login.querySelector("input");
  const error = login.querySelector(".design-login-error");

  const unlock = () => {
    sessionStorage.setItem(ACCESS_KEY, "true");
    goToPreviewHome();
  };

  document.body.classList.add("auth-pending");

  window.setTimeout(() => input.focus(), 0);

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (input.value.trim() === ACCESS_PASSWORD) {
      unlock();
      return;
    }

    error.textContent = "รหัสไม่ถูกต้อง กรุณาลองอีกครั้ง";
    input.select();
  });
};

const isPreviewWorkspace = () => {
  const path = window.location.pathname;
  return /(?:^|\/)index\.html$/.test(path)
    || /(?:^|\/)revise\.html$/.test(path)
    || /(?:^|\/)revise-v2\.html$/.test(path);
};

if (document.body.dataset.auth === "off" || !isPreviewWorkspace()) {
  document.body.classList.remove("auth-pending");
} else {
  buildLoginGate();
}

const siteHeader = document.querySelector(".site-header");
const mainNav = document.querySelector(".main-nav");

if (siteHeader && mainNav) {
  const navMq = window.matchMedia("(max-width: 1100px)");
  const navDropdowns = [...mainNav.querySelectorAll(".nav-dropdown")];
  const navToggle = document.createElement("button");
  navToggle.className = "nav-toggle";
  navToggle.type = "button";
  navToggle.setAttribute("aria-label", "Open menu");
  navToggle.setAttribute("aria-expanded", "false");
  if (!mainNav.id) {
    mainNav.id = "primary-navigation";
  }
  navToggle.setAttribute("aria-controls", mainNav.id);
  navToggle.innerHTML = `
    <img class="nav-toggle-icon nav-toggle-icon-menu" src="assets/icon-menu.svg" alt="" aria-hidden="true" />
    <img class="nav-toggle-icon nav-toggle-icon-close" src="assets/icon-close.svg" alt="" aria-hidden="true" />
  `;

  const headerActions = siteHeader.querySelector(".header-actions");
  if (headerActions) {
    headerActions.before(navToggle);
  } else {
    siteHeader.appendChild(navToggle);
  }

  const setNavOpen = (isOpen) => {
    siteHeader.classList.toggle("is-nav-open", isOpen);
    document.body.classList.toggle("is-nav-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    if (!isOpen) {
      navDropdowns.forEach((dropdown) => {
        dropdown.classList.remove("is-submenu-open");
        dropdown.querySelector(":scope > a")?.setAttribute("aria-expanded", "false");
      });
    }
  };

  navToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    setNavOpen(!siteHeader.classList.contains("is-nav-open"));
  });

  navDropdowns.forEach((dropdown) => {
    const dropdownLink = dropdown.querySelector(":scope > a");
    if (!dropdownLink) return;

    dropdownLink.setAttribute("aria-expanded", "false");

    dropdownLink.addEventListener("click", (event) => {
      if (!navMq.matches) return;

      event.preventDefault();
      const shouldOpen = !dropdown.classList.contains("is-submenu-open");

      navDropdowns.forEach((item) => {
        item.classList.remove("is-submenu-open");
        item.querySelector(":scope > a")?.setAttribute("aria-expanded", "false");
      });

      dropdown.classList.toggle("is-submenu-open", shouldOpen);
      dropdownLink.setAttribute("aria-expanded", String(shouldOpen));
    });
  });

  mainNav.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link) return;

    if (link.closest(".nav-submenu") || !link.closest(".nav-dropdown")) {
      setNavOpen(false);
    }
  });

  document.addEventListener("click", (event) => {
    if (!navMq.matches || !siteHeader.classList.contains("is-nav-open")) return;
    if (!siteHeader.contains(event.target)) {
      setNavOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setNavOpen(false);
    }
  });

  navMq.addEventListener("change", () => setNavOpen(false));
}

const reviseHeroSlides = document.querySelectorAll(".revise-hero-media img");
const reviseHeroButtons = document.querySelectorAll(".revise-hero-controls button");
const reviseHeroPrev = document.querySelector(".revise-hero-prev");
const reviseHeroNext = document.querySelector(".revise-hero-next");
const reviseHero = document.querySelector(".revise-hero");

if (reviseHeroSlides.length && reviseHeroButtons.length) {
  let currentHeroSlide = 0;

  const showHeroSlide = (index) => {
    currentHeroSlide = (index + reviseHeroSlides.length) % reviseHeroSlides.length;

    reviseHeroSlides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === currentHeroSlide);
    });

    reviseHeroButtons.forEach((button, buttonIndex) => {
      button.classList.toggle("is-active", buttonIndex === currentHeroSlide);
    });

    if (reviseHero) {
      reviseHero.dataset.overlay = reviseHeroSlides[currentHeroSlide].dataset.overlay || "fruits";
    }
  };

  reviseHeroButtons.forEach((button, index) => {
    button.addEventListener("click", () => showHeroSlide(index));
  });

  reviseHeroPrev?.addEventListener("click", () => showHeroSlide(currentHeroSlide - 1));
  reviseHeroNext?.addEventListener("click", () => showHeroSlide(currentHeroSlide + 1));

  window.setInterval(() => {
    showHeroSlide(currentHeroSlide + 1);
  }, 6500);
}

const newsTrack = document.querySelector(".news-track");
const newsPrev = document.querySelector(".news-prev");
const newsNext = document.querySelector(".news-next");

if (newsTrack && newsPrev && newsNext) {
  const scrollNews = (direction) => {
    const firstCard = newsTrack.querySelector("article");
    const gap = parseFloat(getComputedStyle(newsTrack).columnGap) || 22;
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width + gap : newsTrack.clientWidth;
    newsTrack.scrollBy({ left: direction * cardWidth, behavior: "smooth" });
  };

  newsPrev.addEventListener("click", () => scrollNews(-1));
  newsNext.addEventListener("click", () => scrollNews(1));
}

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
    if (filter === "best") return card.querySelector(".shop-badge")?.textContent.trim() === "Best Seller";
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

const certModal = document.getElementById("about-cert-modal");
const certTrack = document.querySelector(".about-cert-static .about-cert-track");
const certModalTitle = document.getElementById("about-cert-modal-title");
const certModalCopy = document.querySelector(".about-cert-modal-copy");
const certModalMedia = document.querySelector(".about-cert-modal-media");
const certCloseTriggers = document.querySelectorAll("[data-cert-close]");

if (certModal && certTrack && certModalTitle && certModalCopy && certModalMedia) {
  let lastFocusedCert = null;

  const closeCertModal = () => {
    certModal.hidden = true;
    document.body.style.overflow = "";
    if (lastFocusedCert) {
      lastFocusedCert.focus();
    }
  };

  const openCertModal = (button) => {
    const title = button.dataset.certTitle || "";
    const description = button.dataset.certDescription || "";
    const image = button.dataset.certImage || "";
    const badge = button.dataset.certBadge || "";

    certModalTitle.textContent = title;
    certModalCopy.textContent = description;
    certModalMedia.innerHTML = "";

    if (image) {
      const img = document.createElement("img");
      img.src = image;
      img.alt = title;
      certModalMedia.appendChild(img);
      certModalMedia.hidden = false;
    } else if (badge) {
      const badgeEl = document.createElement("span");
      badgeEl.className = "about-cert-badge";
      badgeEl.textContent = badge;
      certModalMedia.appendChild(badgeEl);
      certModalMedia.hidden = false;
    } else {
      certModalMedia.hidden = true;
    }

    lastFocusedCert = button;
    certModal.hidden = false;
    document.body.style.overflow = "hidden";
    certModal.querySelector(".about-cert-modal-close")?.focus();
  };

  certTrack.addEventListener("click", (event) => {
    const button = event.target.closest(".about-cert-logo");
    if (button) {
      openCertModal(button);
    }
  });

  certCloseTriggers.forEach((trigger) => {
    trigger.addEventListener("click", closeCertModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !certModal.hidden) {
      closeCertModal();
    }
  });
}

const awardsTrack = document.querySelector(".about-awards-track");
const awardsPrev = document.querySelector(".about-awards-prev");
const awardsNext = document.querySelector(".about-awards-next");

if (awardsTrack && awardsPrev && awardsNext) {
  const scrollAwards = (direction) => {
    const card = awardsTrack.querySelector(".about-awards-card");
    const gap = Number.parseFloat(getComputedStyle(awardsTrack).columnGap || getComputedStyle(awardsTrack).gap) || 0;
    const amount = card ? card.getBoundingClientRect().width + gap : awardsTrack.clientWidth;

    awardsTrack.scrollBy({
      left: direction * amount,
      behavior: "smooth",
    });
  };

  awardsPrev.addEventListener("click", () => scrollAwards(-1));
  awardsNext.addEventListener("click", () => scrollAwards(1));
}

const marketChips = document.querySelectorAll(".about-market-chip");
const marketModal = document.getElementById("about-market-modal");
const marketModalTitle = document.getElementById("about-market-modal-title");
const marketModalCount = document.querySelector(".about-market-modal-count");
const marketModalPlaces = document.querySelector(".about-market-modal-places");
const marketCloseTriggers = document.querySelectorAll("[data-market-close]");

const exportMarkets = {
  japan: {
    name: "Japan",
    stores: [
      { name: "Tokyo", query: "Tokyo, Japan" },
      { name: "Osaka", query: "Osaka, Japan" },
    ],
  },
  russia: {
    name: "Russia",
    stores: [{ name: "Moscow", query: "Moscow, Russia" }],
  },
  netherlands: {
    name: "Netherlands",
    stores: [
      { name: "Rotterdam", query: "Rotterdam, Netherlands" },
      { name: "Amsterdam", query: "Amsterdam, Netherlands" },
    ],
  },
  france: {
    name: "France",
    stores: [{ name: "Paris", query: "Paris, France" }],
  },
  austria: {
    name: "Austria",
    stores: [{ name: "Vienna", query: "Vienna, Austria" }],
  },
  spain: {
    name: "Spain",
    stores: [
      { name: "Madrid", query: "Madrid, Spain" },
      { name: "Barcelona", query: "Barcelona, Spain" },
    ],
  },
};

const buildMapsUrl = (query) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

if (marketChips.length && marketModal && marketModalTitle && marketModalCount && marketModalPlaces) {
  let lastFocusedMarket = null;

  const closeMarketModal = () => {
    marketModal.hidden = true;
    document.body.style.overflow = "";
    if (lastFocusedMarket) {
      lastFocusedMarket.focus();
    }
  };

  const openMarketModal = (marketId, button) => {
    const market = exportMarkets[marketId];
    if (!market) {
      return;
    }

    const countLabel = market.stores.length === 1 ? "location" : "locations";
    const links = market.stores
      .map(
        (store) =>
          `<li><a href="${buildMapsUrl(store.query)}" target="_blank" rel="noopener noreferrer">${store.name}</a></li>`
      )
      .join("");

    marketModalTitle.textContent = market.name;
    marketModalCount.innerHTML = `<strong>${market.stores.length}</strong> ${countLabel}`;
    marketModalPlaces.innerHTML = links;

    lastFocusedMarket = button;
    marketModal.hidden = false;
    document.body.style.overflow = "hidden";
    marketModal.querySelector(".about-market-modal-close")?.focus();
  };

  marketChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      openMarketModal(chip.dataset.market, chip);
    });
  });

  marketCloseTriggers.forEach((trigger) => {
    trigger.addEventListener("click", closeMarketModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !marketModal.hidden) {
      closeMarketModal();
    }
  });
}

const fruitStickySections = document.querySelectorAll(".fruit-detail-sticky");
let scheduleFruitStickyUpdate = () => {};

if (fruitStickySections.length) {
  const fruitStickyMq = window.matchMedia("(max-width: 980px)");

  const getFruitStickyTop = () => {
    const header = document.querySelector(".site-header");
    const headerHeight = header ? header.getBoundingClientRect().height : 78;
    return Math.round(headerHeight + 18);
  };

  const getFruitStickyTarget = (section) =>
    section.querySelector(".fruit-detail-sticky-media .fruit-detail-media-slider")
    || section.querySelector(".fruit-detail-sticky-media > .fruit-detail-media");

  const resetFruitStickyMedia = (media) => {
    media.classList.remove("is-fixed", "is-pinned-bottom");
    media.style.removeProperty("--fruit-sticky-top");
    media.style.removeProperty("--fruit-sticky-left");
    media.style.removeProperty("--fruit-sticky-width");
  };

  const updateFruitStickySection = (section) => {
    const column = section.querySelector(".fruit-detail-sticky-media");
    const media = getFruitStickyTarget(section);
    if (!column || !media) {
      return;
    }

    if (fruitStickyMq.matches) {
      column.classList.remove("has-js-sticky");
      resetFruitStickyMedia(media);
      return;
    }

    column.classList.add("has-js-sticky");

    const stickyTop = getFruitStickyTop();
    const columnRect = column.getBoundingClientRect();
    const mediaHeight = media.getBoundingClientRect().height;

    media.style.setProperty("--fruit-sticky-top", `${stickyTop}px`);

    if (columnRect.top > stickyTop) {
      resetFruitStickyMedia(media);
      return;
    }

    if (columnRect.bottom <= stickyTop + mediaHeight) {
      media.classList.remove("is-fixed");
      media.classList.add("is-pinned-bottom");
      media.style.removeProperty("--fruit-sticky-left");
      media.style.removeProperty("--fruit-sticky-width");
      return;
    }

    media.classList.add("is-fixed");
    media.classList.remove("is-pinned-bottom");
    media.style.setProperty("--fruit-sticky-left", `${columnRect.left}px`);
    media.style.setProperty("--fruit-sticky-width", `${columnRect.width}px`);
  };

  let fruitStickyTicking = false;

  scheduleFruitStickyUpdate = () => {
    if (fruitStickyTicking) {
      return;
    }

    fruitStickyTicking = true;
    window.requestAnimationFrame(() => {
      fruitStickySections.forEach(updateFruitStickySection);
      fruitStickyTicking = false;
    });
  };

  window.addEventListener("scroll", scheduleFruitStickyUpdate, { passive: true });
  window.addEventListener("resize", scheduleFruitStickyUpdate);
  fruitStickyMq.addEventListener("change", scheduleFruitStickyUpdate);

  fruitStickySections.forEach((section) => {
    section.querySelectorAll(".fruit-detail-sticky-media img").forEach((image) => {
      if (!image.complete) {
        image.addEventListener("load", scheduleFruitStickyUpdate, { once: true });
      }
    });
  });

  scheduleFruitStickyUpdate();
}

const fruitMediaSliders = document.querySelectorAll(".fruit-detail-media-slider");

if (fruitMediaSliders.length) {
  const fruitAutoplayMq = window.matchMedia("(prefers-reduced-motion: reduce)");
  const FRUIT_AUTOPLAY_DELAY = 4500;

  fruitMediaSliders.forEach((slider) => {
    const slides = [...slider.querySelectorAll(".fruit-detail-media-track .fruit-detail-media")];
    const prevButton = slider.querySelector(".fruit-media-prev");
    const nextButton = slider.querySelector(".fruit-media-next");
    const dotsContainer = slider.querySelector(".fruit-media-dots");
    const controls = slider.querySelector(".fruit-detail-media-controls");
    let activeIndex = slides.findIndex((slide) => slide.classList.contains("is-active"));
    let autoplayTimer = null;

    if (activeIndex < 0) {
      activeIndex = 0;
      slides[0]?.classList.add("is-active");
    }

    if (slides.length <= 1) {
      controls?.remove();
      return;
    }

    const stopAutoplay = () => {
      if (autoplayTimer) {
        window.clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    };

    const startAutoplay = () => {
      stopAutoplay();

      if (fruitAutoplayMq.matches || document.hidden) {
        return;
      }

      autoplayTimer = window.setInterval(() => {
        goToSlide(activeIndex + 1);
      }, FRUIT_AUTOPLAY_DELAY);
    };

    const goToSlide = (index) => {
      activeIndex = (index + slides.length) % slides.length;

      slides.forEach((slide, slideIndex) => {
        slide.classList.toggle("is-active", slideIndex === activeIndex);
      });

      dotsContainer?.querySelectorAll(".fruit-media-dot").forEach((dot, dotIndex) => {
        const isActive = dotIndex === activeIndex;
        dot.classList.toggle("is-active", isActive);
        dot.setAttribute("aria-selected", isActive ? "true" : "false");
      });

      scheduleFruitStickyUpdate();
    };

    const restartAutoplay = () => {
      stopAutoplay();
      startAutoplay();
    };

    slides.forEach((_, slideIndex) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = `fruit-media-dot${slideIndex === activeIndex ? " is-active" : ""}`;
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", `Show image ${slideIndex + 1}`);
      dot.setAttribute("aria-selected", slideIndex === activeIndex ? "true" : "false");
      dot.addEventListener("click", () => {
        goToSlide(slideIndex);
        restartAutoplay();
      });
      dotsContainer?.appendChild(dot);
    });

    prevButton?.addEventListener("click", () => {
      goToSlide(activeIndex - 1);
      restartAutoplay();
    });

    nextButton?.addEventListener("click", () => {
      goToSlide(activeIndex + 1);
      restartAutoplay();
    });

    slider.addEventListener("mouseenter", stopAutoplay);
    slider.addEventListener("mouseleave", startAutoplay);
    slider.addEventListener("focusin", stopAutoplay);
    slider.addEventListener("focusout", (event) => {
      if (!slider.contains(event.relatedTarget)) {
        startAutoplay();
      }
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        stopAutoplay();
        return;
      }

      startAutoplay();
    });

    fruitAutoplayMq.addEventListener("change", () => {
      if (fruitAutoplayMq.matches) {
        stopAutoplay();
        return;
      }

      startAutoplay();
    });

    startAutoplay();
  });
}

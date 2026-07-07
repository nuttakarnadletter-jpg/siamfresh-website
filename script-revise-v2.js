const ACCESS_PASSWORD = "rp-siamfresh";
const ACCESS_KEY = "siamfresh-design-access";

const designEntryLinks = [
  {
    title: "แบบแรก",
    text: "Original homepage direction",
    href: "index.html",
  },
  {
    title: "Revise",
    text: "Corporate export homepage",
    href: "revise.html",
  },
  {
    title: "Revise V2",
    text: "Second revision workspace",
    href: "revise-v2.html",
  },
];

const buildDesignHome = () => {
  document.querySelector(".design-home")?.remove();

  const home = document.createElement("section");
  home.className = "design-home";
  home.setAttribute("aria-label", "Choose design entrance");
  home.innerHTML = `
    <div class="design-home-card">
      <img src="assets/logo2.svg" alt="Siam Fresh" />
      <p class="design-home-kicker">Preview Home</p>
      <h2>เลือกทางเข้าที่ต้องการ</h2>
      <p>เข้าสู่หน้าดีไซน์ที่ต้องการแก้ไขหรือพรีวิวต่อ</p>
      <div class="design-home-links">
        ${designEntryLinks
          .map(
            (link) => `
              <a href="${link.href}">
                <strong>${link.title}</strong>
                <span>${link.text}</span>
              </a>
            `,
          )
          .join("")}
      </div>
    </div>
  `;

  document.body.appendChild(home);
};

const buildLoginGate = () => {
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

  const unlock = (showHome = false) => {
    sessionStorage.setItem(ACCESS_KEY, "true");
    document.body.classList.remove("auth-pending");
    login.hidden = true;

    if (showHome) {
      buildDesignHome();
    }
  };

  if (sessionStorage.getItem(ACCESS_KEY) === "true") {
    unlock();
    return;
  }

  document.body.classList.add("auth-pending");

  window.setTimeout(() => input.focus(), 0);

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (input.value.trim() === ACCESS_PASSWORD) {
      unlock(true);
      return;
    }

    error.textContent = "รหัสไม่ถูกต้อง กรุณาลองอีกครั้ง";
    input.select();
  });
};

const buildDesignSwitcher = () => {
  const path = window.location.pathname;
  const isRevise = path.endsWith("revise.html");
  const isReviseV2 = path.endsWith("revise-v2.html");
  const isIndex = !isRevise && !isReviseV2;
  const switcher = document.createElement("nav");
  switcher.className = "design-switcher";
  switcher.setAttribute("aria-label", "Design version switcher");
  switcher.innerHTML = `
    <a href="index.html"${isIndex ? ' class="is-active"' : ""}>แบบแรก</a>
    <a href="revise.html"${isRevise ? ' class="is-active"' : ""}>Revise</a>
    <a href="revise-v2.html"${isReviseV2 ? ' class="is-active"' : ""}>Revise V2</a>
  `;
  document.body.appendChild(switcher);
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

if (isPreviewWorkspace() && document.body.dataset.auth !== "off") {
  buildDesignSwitcher();
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

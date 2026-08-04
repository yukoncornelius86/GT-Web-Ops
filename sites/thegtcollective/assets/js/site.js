(() => {
  const body = document.body;
  const depth = Number(body.dataset.depth || 0);
  const base = depth > 0 ? "../" : "";
  const currentPage = body.dataset.page || "home";

  const pages = [
    ["dry-ice", "Dry ice", "dry-ice-cleaning-southern-maryland.html"],
    ["process", "Process", "process/index.html"],
    ["philosophy", "Philosophy", "philosophy/index.html"],
    ["expectations", "Expectations", "expectations/index.html"],
    ["gallery", "Gallery", "gallery/index.html"],
    ["faq", "FAQ", "faq/index.html"]
  ];

  const pageLink = ([id, label, path], mobile = false) => {
    const active = currentPage === id ? ' aria-current="page"' : "";
    const className = mobile ? "" : "";
    return `<a${className ? ` class="${className}"` : ""} href="${base}${path}"${active}>${label}</a>`;
  };

  class SiteHeader extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
        <a class="skip-link" href="#main-content">Skip to content</a>
        <header class="site-header" aria-label="Primary">
          <div class="shell-wide site-header-inner">
            <a class="wordmark" href="${base}index.html" aria-label="The Grand Tour Collective home">
              The Grand Tour
              <strong>Collective</strong>
            </a>
            <nav class="desktop-nav" aria-label="Main navigation">
              ${pages.map((page) => pageLink(page)).join("")}
            </nav>
            <div class="header-action">
              <a class="button" href="${base}consultation/index.html">Schedule a preservation consultation</a>
            </div>
            <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Open navigation">
              <span class="menu-toggle-lines" aria-hidden="true"></span>
            </button>
          </div>
        </header>
        <div class="mobile-panel" id="mobile-menu" aria-hidden="true">
          <nav class="mobile-nav" aria-label="Mobile navigation">
            ${pages.map((page) => pageLink(page, true)).join("")}
          </nav>
          <a class="button" href="${base}consultation/index.html">Schedule a preservation consultation</a>
        </div>`;
    }
  }

  class SiteFooter extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
        <footer class="site-footer">
          <div class="shell-wide footer-main">
            <div class="footer-intro">
              <a class="wordmark" href="${base}index.html" aria-label="The Grand Tour Collective home">
                The Grand Tour
                <strong>Collective</strong>
              </a>
              <p>Preservation-minded vehicle care from a dedicated studio in Leonardtown, Maryland.</p>
            </div>
            <nav class="footer-column" aria-label="Preservation pages">
              <h2>Understand the work</h2>
              <a href="${base}dry-ice-cleaning-southern-maryland.html">Dry ice cleaning</a>
              <a href="${base}process/index.html">Process</a>
              <a href="${base}philosophy/index.html">Philosophy</a>
              <a href="${base}expectations/index.html">Expectations</a>
            </nav>
            <nav class="footer-column" aria-label="Explore pages">
              <h2>Explore</h2>
              <a href="${base}gallery/index.html">Before &amp; after</a>
              <a href="${base}faq/index.html">Frequently asked questions</a>
              <a href="${base}consultation/index.html">Preservation consultation</a>
            </nav>
            <div class="footer-column">
              <h2>Studio</h2>
              <span>Leonardtown, Maryland</span>
              <span>Serving Southern Maryland</span>
              <span>crew@thegtcollective.com</span>
              <span>Veteran founded</span>
            </div>
          </div>
          <div class="shell-wide footer-bottom">
            <span>The Grand Tour Collective · Leonardtown, Maryland</span>
            <span>Life's a Grand Tour. Enjoy the ride.</span>
          </div>
        </footer>`;
    }
  }

  customElements.define("site-header", SiteHeader);
  customElements.define("site-footer", SiteFooter);

  const menuButton = document.querySelector(".menu-toggle");
  const mobilePanel = document.querySelector(".mobile-panel");

  const closeMenu = () => {
    if (!menuButton || !mobilePanel) return;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
    mobilePanel.classList.remove("open");
    mobilePanel.setAttribute("aria-hidden", "true");
    body.classList.remove("nav-open");
  };

  if (menuButton && mobilePanel) {
    menuButton.addEventListener("click", () => {
      const shouldOpen = menuButton.getAttribute("aria-expanded") !== "true";
      menuButton.setAttribute("aria-expanded", String(shouldOpen));
      menuButton.setAttribute("aria-label", shouldOpen ? "Close navigation" : "Open navigation");
      mobilePanel.classList.toggle("open", shouldOpen);
      mobilePanel.setAttribute("aria-hidden", String(!shouldOpen));
      body.classList.toggle("nav-open", shouldOpen);
    });

    mobilePanel.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  document.querySelectorAll(".comparison-slider").forEach((slider) => {
    const range = slider.querySelector('input[type="range"]');
    if (!range) return;

    const update = () => {
      const position = `${range.value}%`;
      slider.style.setProperty("--position", position);
      range.setAttribute("aria-valuetext", `${range.value} percent after image revealed`);
    };

    range.addEventListener("input", update);
    update();
  });

  const viewer = document.querySelector(".photo-viewer");
  if (viewer) {
    const viewerImage = viewer.querySelector("img");
    const viewerCaption = viewer.querySelector(".photo-viewer-caption");
    const closeButton = viewer.querySelector(".photo-viewer-close");
    let lastTrigger = null;

    const closeViewer = () => {
      if (typeof viewer.close === "function" && viewer.open) viewer.close();
      body.classList.remove("nav-open");
      if (lastTrigger) lastTrigger.focus();
    };

    document.querySelectorAll(".js-lightbox").forEach((trigger) => {
      trigger.addEventListener("click", () => {
        lastTrigger = trigger;
        viewerImage.src = trigger.dataset.full || trigger.querySelector("img")?.src || "";
        viewerImage.alt = trigger.dataset.alt || trigger.querySelector("img")?.alt || "Project photograph";
        viewerCaption.textContent = trigger.dataset.caption || "";

        if (typeof viewer.showModal === "function") {
          viewer.showModal();
          body.classList.add("nav-open");
          closeButton.focus();
        } else {
          window.open(viewerImage.src, "_blank", "noopener");
        }
      });
    });

    closeButton?.addEventListener("click", closeViewer);
    viewer.addEventListener("click", (event) => {
      if (event.target === viewer) closeViewer();
    });
    viewer.addEventListener("close", () => body.classList.remove("nav-open"));
  }

  const consultationForm = document.querySelector(".consultation-form");
  const successPanel = document.querySelector(".form-success");
  const consultationEndpoint = "https://n8n.thegtcollective.com/webhook/service-request";

  if (consultationForm && successPanel) {
    consultationForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!consultationForm.reportValidity()) return;

      const data = new FormData(consultationForm);
      const submitButton = consultationForm.querySelector('button[type="submit"]');
      const status = consultationForm.querySelector(".form-status");
      const originalButtonText = submitButton.textContent;
      const focusAreas = data.getAll("focus").map(String);
      const vehicle = `${data.get("year") || ""} ${data.get("make-model") || ""}`.trim();
      const notes = [
        `Consultation intent: ${data.get("intent") || "Not specified"}`,
        `Focus areas: ${focusAreas.length ? focusAreas.join(", ") : "Not specified"}`,
        `Known history or previous work: ${data.get("history") || "Not provided"}`,
        `Desired outcome: ${data.get("outcome") || "Not provided"}`,
        `What must not change: ${data.get("protect") || "Not provided"}`,
        `Timing: ${data.get("timing") || "Not specified"}`,
        `Preferred first contact: ${data.get("contact-method") || "Not specified"}`
      ].join("\n");

      submitButton.disabled = true;
      submitButton.textContent = "Sending…";
      if (status) {
        status.textContent = "Sending your preservation request…";
        status.style.color = "";
      }

      try {
        const attribution = window.GT_TRAFFIC && typeof window.GT_TRAFFIC.attribution === "function"
          ? window.GT_TRAFFIC.attribution("preservation_consultation")
          : {
              source_url: window.location.href,
              referrer: document.referrer || "",
              form_type: "preservation_consultation"
            };

        if (window.GT_TRAFFIC && typeof window.GT_TRAFFIC.event === "function") {
          window.GT_TRAFFIC.event("lead_submit", {
            ...attribution,
            requested_service: "Preservation Consultation"
          });
        }

        const response = await fetch(consultationEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            first_name: String(data.get("first-name") || "").trim(),
            last_name: String(data.get("last-name") || "").trim(),
            email: String(data.get("email") || "").trim(),
            phone: String(data.get("phone") || "").trim(),
            vehicle,
            requested_service: "Preservation Consultation",
            notes,
            message: notes,
            source_site: "thegtcollective.com",
            consent_to_contact: true,
            ...attribution
          })
        });

        if (!response.ok) throw new Error(`Request failed: ${response.status}`);

        const nameTarget = successPanel.querySelector(".js-first-name");
        if (nameTarget) nameTarget.textContent = String(data.get("first-name") || "there");
        consultationForm.hidden = true;
        successPanel.classList.add("visible");
        successPanel.setAttribute("tabindex", "-1");
        successPanel.focus();
        successPanel.scrollIntoView({ behavior: "smooth", block: "center" });
      } catch (error) {
        console.error("Preservation consultation submit failed:", error);
        if (status) {
          status.textContent = "We could not send the request right now. Please email crew@thegtcollective.com and we will take care of you.";
          status.style.color = "#9f3d36";
        }
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    });

    successPanel.querySelector(".js-reset-form")?.addEventListener("click", () => {
      consultationForm.reset();
      consultationForm.hidden = false;
      successPanel.classList.remove("visible");
      consultationForm.scrollIntoView({ behavior: "smooth", block: "start" });
      consultationForm.querySelector("input")?.focus();
    });
  }
  const revealItems = document.querySelectorAll(".reveal");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8%", threshold: 0.08 }
    );
    revealItems.forEach((item) => observer.observe(item));
  }
})();

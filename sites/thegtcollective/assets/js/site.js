(() => {
  const body = document.body;
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

(() => {
  const photoCount = 28;
  const gallery = document.querySelector("#gallery-grid");
  const lightbox = document.querySelector("#lightbox");
  const lightboxImage = document.querySelector("#lightbox-image");
  const lightboxCount = document.querySelector("#lightbox-count");
  const closeButton = document.querySelector(".lightbox-close");
  const previousButton = document.querySelector(".lightbox-prev");
  const nextButton = document.querySelector(".lightbox-next");
  let activeIndex = 0;

  const numberFor = (index) => String(index + 1).padStart(2, "0");

  const showPhoto = (index) => {
    activeIndex = (index + photoCount) % photoCount;
    const number = numberFor(activeIndex);
    lightboxImage.src = `./images/full/photo-${number}.webp`;
    lightboxImage.alt = `Full-size 2002 Ford Thunderbird sale photograph ${activeIndex + 1}`;
    lightboxCount.textContent = `${number} / ${photoCount}`;
  };

  const openLightbox = (index) => {
    showPhoto(index);
    lightbox.hidden = false;
    document.body.classList.add("lightbox-open");
    closeButton.focus();
  };

  const closeLightbox = () => {
    lightbox.hidden = true;
    document.body.classList.remove("lightbox-open");
  };

  for (let index = 0; index < photoCount; index += 1) {
    const number = numberFor(index);
    const button = document.createElement("button");
    button.className = "photo-card";
    button.type = "button";
    button.setAttribute("aria-label", `Open full-size Thunderbird photograph ${index + 1}`);
    button.innerHTML = `
      <img src="./images/thumb/photo-${number}.webp" alt="2002 Ford Thunderbird sale photograph ${index + 1}" ${index < 6 ? "" : 'loading="lazy"'}>
      <span>${number}</span>
      <small>View full image</small>
    `;
    button.addEventListener("click", () => openLightbox(index));
    gallery.append(button);
  }

  closeButton.addEventListener("click", closeLightbox);
  previousButton.addEventListener("click", (event) => {
    event.stopPropagation();
    showPhoto(activeIndex - 1);
  });
  nextButton.addEventListener("click", (event) => {
    event.stopPropagation();
    showPhoto(activeIndex + 1);
  });
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  lightbox.querySelector("figure").addEventListener("click", (event) => event.stopPropagation());

  document.addEventListener("keydown", (event) => {
    if (lightbox.hidden) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") showPhoto(activeIndex - 1);
    if (event.key === "ArrowRight") showPhoto(activeIndex + 1);
  });
})();

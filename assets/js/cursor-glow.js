document.addEventListener("DOMContentLoaded", () => {
  const glow = document.createElement("div");
  glow.className = "cursor-glow";
  document.body.appendChild(glow);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateGlow() {
    currentX += (mouseX - currentX) * 0.14;
    currentY += (mouseY - currentY) * 0.14;

    glow.style.left = `${currentX}px`;
    glow.style.top = `${currentY}px`;

    requestAnimationFrame(animateGlow);
  }

  animateGlow();

  const cards = document.querySelectorAll(".category-card");

  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      glow.style.width = "320px";
      glow.style.height = "320px";
      glow.style.opacity = "1";
    });

    card.addEventListener("mouseleave", () => {
      glow.style.width = "260px";
      glow.style.height = "260px";
      glow.style.opacity = "0.95";
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const glow = document.getElementById("cursor-glow");
  const bar = document.getElementById("scroll-progress-bar");

  if (glow) {
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
  }

  if (bar) {
    window.addEventListener("scroll", () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = `${percent}%`;
    });
  }

  document.querySelectorAll(".category-block").forEach((block) => {
    block.addEventListener("mouseenter", () => {
      block.style.transform = "scale(1.02)";
    });

  block.addEventListener("mouseleave", () => {
    block.style.transform = "scale(1)";
  });
});
  });
});
  
  document.querySelectorAll('a[href^="/#"], a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      const targetId = href.includes("#") ? href.split("#")[1] : "";
      const target = document.getElementById(targetId);

      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
});

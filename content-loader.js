// Cargar contenido dinámico desde JSON
let siteData = {};

// Función para cargar datos desde JSON
async function loadSiteData() {
  try {
    const response = await fetch('data.json');
    siteData = await response.json();
    renderDynamicContent();
  } catch (error) {
    console.error('Error cargando datos:', error);
    // Fallback: usar datos estáticos si falla la carga
    loadFallbackData();
  }
}

// Función para renderizar contenido dinámico
function renderDynamicContent() {
  renderNavigation();
  renderHero();
  renderFilters();
  renderTours();
  renderComparison();
  renderMedia();
  renderEco();
  renderTestimonials();
  renderBlog();
  renderInsurance();
  renderContact();
  renderTeam();
  renderFooter();
}

// Renderizar navegación
function renderNavigation() {
  const navList = document.getElementById('navList');
  if (!navList) return;
  
  navList.innerHTML = siteData.navigation.map(item => 
    `<li><a href="${item.href}" ${item['aria-label'] ? `aria-label="${item['aria-label']}"` : ''}>${item.text}</a></li>`
  ).join('');
}

// Renderizar hero
function renderHero() {
  const heroTitle = document.getElementById('hero-title');
  const heroLead = document.querySelector('.lead');
  const ctaRow = document.querySelector('.cta-row');
  
  if (heroTitle) {
    heroTitle.textContent = siteData.hero.title;
  }
  
  if (heroLead) {
    heroLead.innerHTML = `${siteData.hero.subtitle} <strong>${siteData.hero.highlight}</strong>${siteData.hero.highlightText}`;
  }
  
  if (ctaRow) {
    ctaRow.innerHTML = siteData.hero.buttons.map(btn => 
      `<a class="btn ${btn.class}" href="${btn.href}">${btn.text}</a>`
    ).join('');
  }
}

// Renderizar filtros
function renderFilters() {
  const filterForm = document.querySelector('.filter-form');
  if (!filterForm) return;
  
  const filtersHTML = siteData.filters.fields.map(field => {
    if (field.type === 'select') {
      const options = field.options.map(opt => `<option>${opt}</option>`).join('');
      return `
        <label>
          ${field.label}
          <select aria-label="Seleccionar ${field.label.toLowerCase()}">
            ${options}
          </select>
        </label>
      `;
    } else if (field.type === 'checkbox') {
      return `
        <label class="checkbox">
          <input type="checkbox" /> ${field.label}
        </label>
      `;
    } else {
      const attrs = [
        `type="${field.type}"`,
        field.name ? `name="${field.name}"` : '',
        field.placeholder ? `placeholder="${field.placeholder}"` : '',
        field.min ? `min="${field.min}"` : '',
        field.step ? `step="${field.step}"` : '',
        field.required ? 'required' : '',
        `aria-label="${field.label}"`
      ].filter(Boolean).join(' ');
      
      return `
        <label>
          ${field.label}
          <input ${attrs} />
        </label>
      `;
    }
  }).join('');
  
  filterForm.innerHTML = `
    <h2 id="filtros-title">${siteData.filters.title}</h2>
    ${filtersHTML}
    <button class="btn btn-primary" type="submit">${siteData.filters.button}</button>
  `;
}

// Renderizar tours
function renderTours() {
  const cardGrid = document.querySelector('.card-grid');
  if (!cardGrid) return;
  
  const toursHTML = siteData.tours.items.map(tour => {
    const stars = '★'.repeat(tour.rating) + '☆'.repeat(5 - tour.rating);
    return `
      <article class="card">
        <img
          src="${tour.image}"
          alt="${tour.alt}"
          width="600"
          height="400"
          loading="lazy"
        />
        <div class="card-body">
          <h3>${tour.name} (${tour.country})</h3>
          <p class="meta">Dificultad: ${tour.difficulty} • Riesgo: ${tour.risk} • Edad: ${tour.age}</p>
          <p class="price">Desde <strong>$${tour.price}</strong> • ${stars} (${tour.reviews})</p>
          <div class="actions">
            <a class="btn btn-outline" href="${tour.detailLink}">Ver detalles</a>
            <button class="btn btn-primary btn-compare" data-tour="${tour.id}">Comparar</button>
            <a class="btn btn-primary" href="#contacto">Reservar</a>
          </div>
        </div>
      </article>
    `;
  }).join('');
  
  cardGrid.innerHTML = toursHTML;
}

// Renderizar comparación
function renderComparison() {
  const tableBody = document.querySelector('tbody');
  if (!tableBody) return;
  
  const rows = [
    ['Precio desde', ...siteData.comparison.tours.map(t => `$${t.price}`)],
    ['Duración', ...siteData.comparison.tours.map(t => t.duration)],
    ['Dificultad', ...siteData.comparison.tours.map(t => t.difficulty)],
    ['Riesgos clave', ...siteData.comparison.tours.map(t => t.risk)],
    ['Incluye', ...siteData.comparison.tours.map(t => t.includes)],
    ['No incluye', ...siteData.comparison.tours.map(t => t.excludes)],
    ['Políticas eco', ...siteData.comparison.tours.map(t => t.eco)],
    ['Reseñas', ...siteData.comparison.tours.map(t => t.rating)]
  ];
  
  tableBody.innerHTML = rows.map(row => 
    `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`
  ).join('');
}

// Renderizar media
function renderMedia() {
  const mediaGrid = document.querySelector('.media-grid');
  if (!mediaGrid) return;
  
  const mediaHTML = siteData.media.items.map(item => {
    if (item.type === 'video') {
      return `
        <figure>
          <video controls width="480" poster="${item.poster}">
            <source src="${item.src}" type="video/mp4" />
            Tu navegador no soporta video HTML5.
          </video>
          <figcaption>${item.caption}</figcaption>
        </figure>
      `;
    } else if (item.type === 'youtube') {
      return `
        <figure>
          <iframe
            width="480"
            height="270"
            loading="lazy"
            src="${item.src}"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
          ></iframe>
          <figcaption>${item.caption}</figcaption>
        </figure>
      `;
    } else if (item.type === 'map') {
      return `
        <figure>
          <iframe
            width="480"
            height="270"
            loading="lazy"
            src="${item.src}"
            style="border: 0"
            allowfullscreen=""
            aria-label="${item['aria-label']}"
          ></iframe>
          <figcaption>${item.caption}</figcaption>
        </figure>
      `;
    }
  }).join('');
  
  mediaGrid.innerHTML = mediaHTML;
}

// Renderizar compromiso ecológico
function renderEco() {
  const ecoList = document.querySelector('.eco-list');
  if (!ecoList) return;
  
  ecoList.innerHTML = siteData.eco.items.map(item => `<li>${item}</li>`).join('');
}

// Renderizar testimonios
function renderTestimonials() {
  const testimonialsContainer = document.querySelector('.testimonios');
  if (!testimonialsContainer) return;
  
  const testimonialsHTML = siteData.testimonials.items.map(testimonial => `
    <article class="testimonial">
      <p>
        "${testimonial.text}" — <strong>${testimonial.author}</strong> (${testimonial.location})
      </p>
    </article>
  `).join('');
  
  testimonialsContainer.innerHTML = `
    <h2 id="test-title">${siteData.testimonials.title}</h2>
    ${testimonialsHTML}
  `;
}

// Renderizar blog
function renderBlog() {
  const blogGrid = document.querySelector('.blog-grid');
  if (!blogGrid) return;
  
  const blogHTML = siteData.blog.posts.map(post => `
    <article class="post">
      <h3>${post.title}</h3>
      <p>${post.excerpt}</p>
      <a href="${post.link}" class="text-link">Leer más</a>
    </article>
  `).join('');
  
  blogGrid.innerHTML = blogHTML;
}

// Renderizar seguros
function renderInsurance() {
  const insuranceSection = document.querySelector('.seguros');
  if (!insuranceSection) return;
  
  const featuresHTML = siteData.insurance.features.map(feature => `<li>${feature}</li>`).join('');
  
  insuranceSection.innerHTML = `
    <h2 id="seg-title">${siteData.insurance.title}</h2>
    <p>${siteData.insurance.description}</p>
    <ul>${featuresHTML}</ul>
    <a class="btn btn-primary" href="#contacto">${siteData.insurance.button}</a>
  `;
}

// Renderizar contacto
function renderContact() {
  const contactForm = document.querySelector('.contact-form');
  const contactAside = document.querySelector('.contact-aside');
  
  if (contactForm) {
    const fieldsHTML = siteData.contact.form.fields.map(field => {
      const attrs = [
        `type="${field.type}"`,
        field.name ? `name="${field.name}"` : '',
        field.placeholder ? `placeholder="${field.placeholder}"` : '',
        field.rows ? `rows="${field.rows}"` : '',
        field.required ? 'required' : ''
      ].filter(Boolean).join(' ');
      
      const inputTag = field.type === 'textarea' ? 'textarea' : 'input';
      return `
        <label>${field.label}
          <${inputTag} ${attrs}></${inputTag}>
        </label>
      `;
    }).join('');
    
    contactForm.innerHTML = `
      ${fieldsHTML}
      <button class="btn btn-primary" type="submit">${siteData.contact.form.button}</button>
    `;
  }
  
  if (contactAside) {
    contactAside.innerHTML = `
      <p><strong>WhatsApp:</strong> <a href="https://wa.me/${siteData.contact.info.whatsapp.number}" target="_blank" rel="noopener noreferrer">${siteData.contact.info.whatsapp.display}</a></p>
      <p><strong>Email:</strong> <a href="mailto:${siteData.contact.info.email}">${siteData.contact.info.email}</a></p>
      <p><strong>Horario:</strong> ${siteData.contact.info.schedule}</p>
      <p><strong>Cobertura:</strong> ${siteData.contact.info.coverage}</p>
    `;
  }
}

// Renderizar integrantes
function renderTeam() {
  const teamSection = document.querySelector('.team-section');
  if (!teamSection) return;
  
  const membersHTML = siteData.team.members.map(member => `
    <div class="team-member">
      <h3>${member.name}</h3>
      <div class="id">ID: ${member.id}</div>
    </div>
  `).join('');
  
  teamSection.innerHTML = `
    <h2 id="team-title">${siteData.team.title}</h2>
    <p class="subtitle">${siteData.team.subtitle}</p>
    <div class="team-grid">
      ${membersHTML}
    </div>
  `;
}

// Renderizar footer
function renderFooter() {
  const footerInner = document.querySelector('.footer-inner');
  if (!footerInner) return;
  
  const linksHTML = siteData.footer.links.map(link => 
    `<a href="${link.href}" ${link.class ? `class="${link.class}"` : ''}>${link.text}</a>`
  ).join('');
  
  footerInner.innerHTML = `
    <p>© <span id="year"></span> ${siteData.footer.copyright}</p>
    <nav aria-label="Enlaces legales">${linksHTML}</nav>
  `;
}

// Datos de fallback en caso de error
function loadFallbackData() {
  console.log('Usando datos de fallback');
  // Los datos estáticos del HTML se mantendrán
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  loadSiteData();
  
  // Re-inicializar funcionalidades después de cargar contenido dinámico
  setTimeout(() => {
    initializeInteractiveFeatures();
  }, 100);
});

// Función para inicializar características interactivas
function initializeInteractiveFeatures() {
  // Menú móvil
  const menuToggle = document.getElementById("menuToggle");
  const navList = document.getElementById("navList");
  if (menuToggle && navList) {
    menuToggle.addEventListener("click", () => {
      const shown = getComputedStyle(navList).display !== "none";
      navList.style.display = shown ? "none" : "flex";
      menuToggle.setAttribute("aria-expanded", String(!shown));
    });
  }

  // Comparador (contador simple)
  let compareCount = 0;
  const compareCountEl = document.getElementById("compareCount");
  document.querySelectorAll(".btn-compare").forEach((btn) => {
    btn.addEventListener("click", () => {
      compareCount = Math.min(compareCount + 1, 3);
      if (compareCountEl) compareCountEl.textContent = String(compareCount);
      btn.classList.add("added");
      btn.textContent = "Añadido";
      setTimeout(() => {
        btn.classList.remove("added");
        btn.textContent = "Comparar";
      }, 1200);
    });
  });

  // Volver arriba
  document.querySelectorAll(".to-top").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  // Año dinámico
  document.getElementById("year").textContent = new Date().getFullYear();
}

// Mejora accesible: foco visible forzado en teclado
(function () {
  function handleFirstTab(e) {
    if (e.key === "Tab") {
      document.body.classList.add("user-is-tabbing");
      window.removeEventListener("keydown", handleFirstTab);
    }
  }
  window.addEventListener("keydown", handleFirstTab);
})();

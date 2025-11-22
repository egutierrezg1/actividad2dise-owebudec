let siteData = {};
let tourIndex = new Map();
let blogIndex = new Map();
let compareSelection = new Set();
let lastFocusedElement = null;

document.addEventListener('DOMContentLoaded', () => {
  loadSiteData();
  enforceFocusStyles();
});

async function loadSiteData() {
  try {
    const response = await fetch('data.json');
    siteData = await response.json();
    buildTourIndex();
    buildBlogIndex();
    renderDynamicContent();
    initializeInteractiveFeatures();
  } catch (error) {
    console.error('Error cargando datos:', error);
  }
}

function buildTourIndex() {
  tourIndex.clear();
  (siteData.tours?.items || []).forEach((tour) => {
    tourIndex.set(tour.id, tour);
  });
}

function buildBlogIndex() {
  blogIndex.clear();
  (siteData.blog?.posts || []).forEach((post) => {
    blogIndex.set(post.id || post.title, post);
  });
}

function renderDynamicContent() {
  renderNavigation();
  renderHero();
  renderAchievement();
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
  renderTourOfDay();
}

function renderNavigation() {
  const navList = document.getElementById('navList');
  if (!navList) return;
  navList.innerHTML = siteData.navigation
    .map(
      (item) =>
        `<li><a href="${item.href}" ${item['aria-label'] ? `aria-label="${item['aria-label']}"` : ''}>${item.text}</a></li>`
    )
    .join('');
}

function renderHero() {
  const heroTitle = document.getElementById('hero-title');
  const heroLead = document.querySelector('.lead');
  const ctaRow = document.querySelector('.cta-row');
  const eyebrow = document.getElementById('hero-eyebrow');
  const metrics = document.getElementById('hero-metrics');
  const heroSide = document.getElementById('hero-side');

  if (eyebrow) eyebrow.textContent = siteData.hero.eyebrow;
  if (heroTitle) heroTitle.textContent = siteData.hero.title;
  if (heroLead) {
    heroLead.innerHTML = `${siteData.hero.subtitle} <strong>${siteData.hero.highlight}</strong> ${siteData.hero.highlightText}`;
  }
  if (metrics) {
    metrics.innerHTML = siteData.hero.metrics
      .map(
        (item) =>
          `<div class="metric"><div class="metric-value">${item.value}</div><span>${item.label}</span></div>`
      )
      .join('');
  }
  if (ctaRow) {
    ctaRow.innerHTML = siteData.hero.buttons
      .map((btn) => `<a class="btn ${btn.class}" href="${btn.href}">${btn.text}</a>`)
      .join('');
  }
  if (heroSide && siteData.hero.side) {
    heroSide.innerHTML = `
      <div class="hero-card">
        <h3>${siteData.hero.side.title}</h3>
        <ul>
          ${siteData.hero.side.items.map((item) => `<li>${item}</li>`).join('')}
        </ul>
        <div class="hero-highlight">${siteData.hero.highlight}</div>
      </div>
    `;
  }
}

function renderAchievement() {
  const data = siteData.achievement;
  if (!data) return;
  const title = document.getElementById('achievement-title');
  const description = document.getElementById('achievement-description');
  const progress = document.getElementById('achievement-progress');
  const progressLabel = document.getElementById('achievement-progress-label');
  const progressValue = document.getElementById('achievement-progress-value');
  const highlight = document.getElementById('achievement-highlight');

  if (title) title.textContent = data.title;
  if (description) description.textContent = data.description;
  if (progress && typeof data.progress === 'number') {
    progress.style.width = `${Math.min(data.progress, 100)}%`;
  }
  if (progressLabel) progressLabel.textContent = data.progressLabel;
  if (progressValue) progressValue.textContent = data.progressValue;
  if (highlight) highlight.textContent = data.highlight;
}

function renderFilters() {
  const filterForm = document.querySelector('.filter-form');
  if (!filterForm) return;

  const filtersHTML = siteData.filters.fields
    .map((field) => {
      const name =
        field.name ||
        field.label
          .toLowerCase()
          .replace(/[^a-z0-9]+/gi, '_')
          .replace(/^_|_$/g, '');

      if (field.type === 'select') {
        const options = field.options
          .map((opt) => `<option value="${opt}">${opt}</option>`)
          .join('');
        return `
          <label>
            ${field.label}
            <select name="${name}" aria-label="Seleccionar ${field.label.toLowerCase()}">
              ${options}
            </select>
          </label>
        `;
      }

      if (field.type === 'checkbox') {
        return `
          <label class="checkbox">
            <input type="checkbox" name="${name}" /> ${field.label}
          </label>
        `;
      }

      const attrs = [
        `type="${field.type}"`,
        `name="${name}"`,
        field.placeholder ? `placeholder="${field.placeholder}"` : '',
        field.min ? `min="${field.min}"` : '',
        field.step ? `step="${field.step}"` : '',
        field.required ? 'required' : '',
        `aria-label="${field.label}"`
      ]
        .filter(Boolean)
        .join(' ');

      return `
        <label>
          ${field.label}
          <input ${attrs} />
        </label>
      `;
    })
    .join('');

  filterForm.innerHTML = `
    <div class="filter-heading">
      <div>
        <h2 id="filtros-title">${siteData.filters.title}</h2>
        <p class="filter-note">${siteData.filters.note}</p>
      </div>
      <div class="filter-feedback" id="filterFeedback">Listando ${siteData.tours.items.length} tours</div>
    </div>
    ${filtersHTML}
    <button class="btn btn-primary" type="submit">${siteData.filters.button}</button>
  `;
}

function renderTours(list = siteData.tours.items) {
  const cardGrid = document.querySelector('.card-grid');
  const compareCountEl = document.getElementById('compareCount');
  if (compareCountEl) compareCountEl.textContent = String(compareSelection.size);
  if (!cardGrid) return;

  const toursHTML = list
    .map((tour) => {
      const tags = [tour.country, tour.duration, `${tour.difficulty} dif.`].join(' · ');
      const includes = (tour.includes || []).slice(0, 2).map((item) => `<span class="pill">${item}</span>`).join('');
      const badge = tour.badge ? `<span class="card-badge">${tour.badge}</span>` : '';
      const inCompare = compareSelection.has(tour.id);
      return `
        <article class="card">
          <div class="card-image">
            <img
              src="${tour.image}"
              alt="${tour.alt}"
              width="600"
              height="400"
              loading="lazy"
            />
            ${badge}
          </div>
          <div class="card-body">
            <h3>${tour.name}</h3>
            <p class="meta">${tags}</p>
            <p class="summary">${tour.summary}</p>
            <div class="pill-row">${includes}</div>
            <p class="price">Desde <strong>$${tour.price}</strong> · ${renderStars(tour.rating)} (${tour.reviews})</p>
            <div class="actions">
              <button class="btn btn-outline btn-detail" data-tour="${tour.id}">Ver paquete</button>
              <button class="btn btn-primary btn-compare ${inCompare ? 'added' : ''}" data-tour="${tour.id}">${inCompare ? 'En comparador' : 'Comparar'}</button>
              <a class="btn btn-primary btn-reserve" data-tour="${tour.id}" href="#contacto">Reservar</a>
            </div>
          </div>
        </article>
      `;
    })
    .join('');

  cardGrid.innerHTML = toursHTML;
}

function renderComparison() {
  const tableBody = document.querySelector('tbody');
  const title = document.getElementById('comparador-title');
  if (!tableBody) return;
  if (title) title.textContent = siteData.comparison.title;

  const rows = [
    ['Precio desde', ...siteData.comparison.tours.map((t) => `$${t.price}`)],
    ['Duracion', ...siteData.comparison.tours.map((t) => t.duration)],
    ['Dificultad', ...siteData.comparison.tours.map((t) => t.difficulty)],
    ['Riesgos clave', ...siteData.comparison.tours.map((t) => t.risk)],
    ['Incluye', ...siteData.comparison.tours.map((t) => t.includes)],
    ['No incluye', ...siteData.comparison.tours.map((t) => t.excludes)],
    ['Politicas eco', ...siteData.comparison.tours.map((t) => t.eco)],
    ['Resenas', ...siteData.comparison.tours.map((t) => t.rating)]
  ];

  tableBody.innerHTML = rows
    .map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`)
    .join('');
}

function renderMedia() {
  const mediaGrid = document.querySelector('.media-grid');
  const mediaTitle = document.getElementById('media-title');
  if (!mediaGrid) return;
  if (mediaTitle) mediaTitle.textContent = siteData.media.title;

  const mediaHTML = siteData.media.items
    .map((item) => {
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
      }
      if (item.type === 'youtube') {
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
      }
      if (item.type === 'map') {
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
      return '';
    })
    .join('');

  mediaGrid.innerHTML = mediaHTML;
}

function renderEco() {
  const ecoList = document.querySelector('.eco-list');
  const ecoTitle = document.getElementById('eco-title');
  if (!ecoList) return;
  if (ecoTitle) ecoTitle.textContent = siteData.eco.title;
  ecoList.innerHTML = siteData.eco.items.map((item) => `<li>${item}</li>`).join('');
}

function renderTestimonials() {
  const testimonialsContainer = document.querySelector('.testimonios');
  if (!testimonialsContainer) return;

  const testimonialsHTML = siteData.testimonials.items
    .map(
      (testimonial) => `
        <article class="testimonial">
          <p>
            "${testimonial.text}" — <strong>${testimonial.author}</strong> (${testimonial.location})
          </p>
        </article>
      `
    )
    .join('');

  testimonialsContainer.innerHTML = `
    <h2 id="test-title">${siteData.testimonials.title}</h2>
    ${testimonialsHTML}
  `;
}

function renderBlog() {
  const blogGrid = document.querySelector('.blog-grid');
  if (!blogGrid) return;

  const blogHTML = siteData.blog.posts
    .map(
      (post) => `
        <article class="post">
          <h3>${post.title}</h3>
          <p>${post.excerpt}</p>
          <button class="text-link blog-read" type="button" data-blog-id="${post.id}">Leer mas</button>
        </article>
      `
    )
    .join('');

  blogGrid.innerHTML = blogHTML;
}

function renderInsurance() {
  const insuranceSection = document.querySelector('.seguros');
  if (!insuranceSection) return;

  const featuresHTML = siteData.insurance.features.map((feature) => `<li>${feature}</li>`).join('');

  insuranceSection.innerHTML = `
    <h2 id="seg-title">${siteData.insurance.title}</h2>
    <p>${siteData.insurance.description}</p>
    <ul>${featuresHTML}</ul>
    <a class="btn btn-primary" href="#contacto">${siteData.insurance.button}</a>
  `;
}

function renderContact() {
  const contactForm = document.querySelector('.contact-form');
  const contactAside = document.querySelector('.contact-aside');

  if (contactForm) {
    const fieldsHTML = siteData.contact.form.fields
      .map((field) => {
        const attrs = [
          `name="${field.name || field.label}"`,
          field.placeholder ? `placeholder="${field.placeholder}"` : '',
          field.rows ? `rows="${field.rows}"` : '',
          field.required ? 'required' : ''
        ]
          .filter(Boolean)
          .join(' ');

        const inputTag = field.type === 'textarea' ? 'textarea' : 'input';
        const typeAttr = field.type === 'textarea' ? '' : `type="${field.type}"`;
        return `
          <label>${field.label}
            <${inputTag} ${typeAttr} ${attrs}></${inputTag}>
          </label>
        `;
      })
      .join('');

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

function renderTeam() {
  const teamSection = document.querySelector('.team-section .container');
  if (!teamSection) return;

  const membersHTML = siteData.team.members
    .map(
      (member) => `
        <div class="team-member">
          <h3>${member.name}</h3>
          <div class="id">ID: ${member.id}</div>
        </div>
      `
    )
    .join('');

  teamSection.innerHTML = `
    <h2 id="team-title">${siteData.team.title}</h2>
    <p class="subtitle">${siteData.team.subtitle}</p>
    <div class="team-grid">
      ${membersHTML}
    </div>
  `;
}

function renderFooter() {
  const footerInner = document.querySelector('.footer-inner');
  if (!footerInner) return;

  const linksHTML = siteData.footer.links
    .map((link) => `<a href="${link.href}" ${link.class ? `class="${link.class}"` : ''}>${link.text}</a>`)
    .join('');

  footerInner.innerHTML = `
    <p>© <span id="year"></span> ${siteData.footer.copyright}</p>
    <nav aria-label="Enlaces legales">${linksHTML}</nav>
  `;
  updateYear();
}

function renderTourOfDay() {
  const panel = document.getElementById('tourDayWindow');
  if (!panel || !siteData.tourOfDay) return;

  const tour = tourIndex.get(siteData.tourOfDay.id) || siteData.tours.items[0];
  panel.innerHTML = `
    <div class="tour-day-header">
      <div class="badge soft">Tour del dia</div>
      <button class="tour-day-toggle" type="button" aria-expanded="true">Ocultar</button>
    </div>
    <div class="tour-day-body" id="tourDayBody">
      <div class="tour-day-media">
        <img src="${tour.image}" alt="${tour.alt}" loading="lazy" />
      </div>
      <div class="tour-day-text">
        <p class="eyebrow">${siteData.tourOfDay.tagline}</p>
        <h3>${tour.name}</h3>
        <p class="meta">${tour.country} · ${tour.duration} · ${tour.difficulty}</p>
        <p>${siteData.tourOfDay.reason || tour.summary}</p>
        <p class="price">Desde $${tour.price} · ${siteData.tourOfDay.note || ''}</p>
        <div class="actions">
          <button class="btn btn-primary btn-detail" data-tour="${tour.id}">${siteData.tourOfDay.cta || 'Ver detalles'}</button>
          <a class="btn btn-outline" href="#tours">Ver todos</a>
        </div>
      </div>
    </div>
  `;

  const toggle = panel.querySelector('.tour-day-toggle');
  const body = panel.querySelector('.tour-day-body');
  if (toggle && body) {
    toggle.addEventListener('click', () => {
      const collapsed = panel.classList.toggle('collapsed');
      body.setAttribute('aria-hidden', String(collapsed));
      toggle.setAttribute('aria-expanded', String(!collapsed));
      toggle.textContent = collapsed ? 'Mostrar' : 'Ocultar';
    });
  }
}

function initializeInteractiveFeatures() {
  wireMenuToggle();
  wireToTopLinks();
  wireFilterForm();
  wireModalClose();
  wireBlogModalClose();
  wireContactForm();
  setupGlobalClickHandlers();
  document.addEventListener('keydown', handleEscapeClose);
}

function wireMenuToggle() {
  const menuToggle = document.getElementById('menuToggle');
  const navList = document.getElementById('navList');
  if (!menuToggle || !navList) return;
  menuToggle.addEventListener('click', () => {
    const shown = getComputedStyle(navList).display !== 'none';
    navList.style.display = shown ? 'none' : 'flex';
    menuToggle.setAttribute('aria-expanded', String(!shown));
  });
}

function wireToTopLinks() {
  document.querySelectorAll('.to-top').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

function wireFilterForm() {
  const form = document.querySelector('.filter-form');
  const feedback = document.getElementById('filterFeedback');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const filtered = filterTours(formData);
    renderTours(filtered);
    if (feedback) feedback.textContent = `Mostrando ${filtered.length} de ${siteData.tours.items.length} tours`;
  });
}

function setupGlobalClickHandlers() {
  document.body.addEventListener('click', (event) => {
    const compareBtn = event.target.closest('.btn-compare');
    if (compareBtn) {
      handleCompare(compareBtn);
      return;
    }

    const detailBtn = event.target.closest('.btn-detail');
    if (detailBtn) {
      handleDetail(detailBtn);
      return;
    }

    const reserveBtn = event.target.closest('.btn-reserve');
    if (reserveBtn) {
      handleReserve(reserveBtn);
      return;
    }

    const blogBtn = event.target.closest('.blog-read');
    if (blogBtn) {
      handleBlogRead(blogBtn);
      return;
    }

    const blogContact = event.target.closest('.blog-contact');
    if (blogContact) {
      event.preventDefault();
      closeBlogModal();
      const contacto = document.getElementById('contacto');
      if (contacto) {
        contacto.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.hash = '#contacto';
      }
      return;
    }

    const tourContact = event.target.closest('.tour-contact');
    if (tourContact) {
      event.preventDefault();
      closeTourModal();
      const contacto = document.getElementById('contacto');
      if (contacto) {
        contacto.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.hash = '#contacto';
      }
      return;
    }

    if (event.target.classList.contains('modal-backdrop')) {
      closeTourModal();
      closeBlogModal();
    }
  });
}

function handleCompare(button) {
  const tourId = button.dataset.tour;
  const compareCountEl = document.getElementById('compareCount');
  if (!tourId) return;

  if (compareSelection.has(tourId)) {
    compareSelection.delete(tourId);
    button.classList.remove('added');
    button.textContent = 'Comparar';
  } else if (compareSelection.size < 3) {
    compareSelection.add(tourId);
    button.classList.add('added');
    button.textContent = 'En comparador';
  } else {
    button.classList.add('pulse');
    setTimeout(() => button.classList.remove('pulse'), 700);
  }

  if (compareCountEl) compareCountEl.textContent = String(compareSelection.size);
}

function handleDetail(button) {
  const tourId = button.dataset.tour;
  const tour = tourIndex.get(tourId);
  if (!tour) return;
  openTourModal(tour);
}

function handleReserve(button) {
  const tourId = button.dataset.tour;
  const tour = tourIndex.get(tourId);
  const messageField = document.querySelector('textarea[name="mensaje"], textarea[name="Mensaje"]');
  if (tour && messageField) {
    messageField.value = `Hola, quiero reservar ${tour.name} (${tour.duration}, ${tour.country}) para un grupo ${tour.groupSize || '8-12'} (edad ${tour.age}). Presupuesto: $${tour.price}.`;
  }
}

function handleBlogRead(button) {
  const blogId = button.dataset.blogId;
  const post = blogIndex.get(blogId);
  if (!post) return;
  openBlogModal(post);
}

function wireModalClose() {
  const modal = document.getElementById('tourDetailModal');
  if (!modal) return;
  const closeBtn = modal.querySelector('.modal-close');
  if (closeBtn) closeBtn.addEventListener('click', closeTourModal);
}

function wireBlogModalClose() {
  const modal = document.getElementById('blogModal');
  if (!modal) return;
  const closeBtn = modal.querySelector('.modal-close');
  if (closeBtn) closeBtn.addEventListener('click', closeBlogModal);
}

function wireContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;
  const submitBtn = form.querySelector('button[type="submit"]');
  let statusEl = form.querySelector('.form-status');
  if (!statusEl) {
    statusEl = document.createElement('div');
    statusEl.className = 'form-status';
    form.appendChild(statusEl);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (submitBtn) {
      submitBtn.textContent = 'Enviando...';
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;
    }
    statusEl.className = 'form-status';
    statusEl.style.display = 'none';

    setTimeout(() => {
      statusEl.textContent = '¡Mensaje enviado! Te contactaremos en menos de 24h.';
      statusEl.className = 'form-status success';
      statusEl.style.display = 'block';
      form.reset();
      if (submitBtn) {
        submitBtn.textContent = 'Enviar';
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
      }
    }, 700);
  });
}

function handleEscapeClose(event) {
  if (event.key === 'Escape') {
    closeTourModal();
    closeBlogModal();
  }
}

function openTourModal(tour) {
  const modal = document.getElementById('tourDetailModal');
  if (!modal) return;
  const modalBody = modal.querySelector('.modal-body');
  if (!modalBody) return;

  lastFocusedElement = document.activeElement;
  const includes = (tour.includes || []).map((item) => `<li>${item}</li>`).join('');
  const excludes = (tour.notIncluded || []).map((item) => `<li>${item}</li>`).join('');

  modalBody.innerHTML = `
    <div class="modal-header">
      <div>
        <p class="eyebrow">${tour.country} · ${tour.duration}</p>
        <h3 id="tourModalTitle">${tour.name}</h3>
        <p class="meta">${tour.summary}</p>
      </div>
      <div class="price">Desde $${tour.price}</div>
    </div>
    <div class="modal-grid">
      <div class="modal-media">
        <img src="${tour.image}" alt="${tour.alt}" loading="lazy" />
        <div class="pill-row">
          <span class="pill">${tour.difficulty} dificultad</span>
          <span class="pill">${tour.season}</span>
          <span class="pill">Edad ${tour.age}</span>
          <span class="pill">${renderStars(tour.rating)}</span>
        </div>
      </div>
      <div class="modal-details">
        <div class="detail-row">
          <div><strong>Grupo</strong><span>${tour.groupSize || '8-12'}</span></div>
          <div><strong>Clima</strong><span>${tour.climate || 'Variable'}</span></div>
          <div><strong>Riesgo</strong><span>${tour.risk}</span></div>
          <div><strong>Temporada</strong><span>${tour.season}</span></div>
        </div>
        <div class="list-block">
          <h4>Incluye</h4>
          <ul>${includes}</ul>
        </div>
        <div class="list-block muted">
          <h4>No incluye</h4>
          <ul>${excludes}</ul>
        </div>
      </div>
    </div>
    <div class="modal-actions">
      <a class="btn btn-outline tour-contact" href="#contacto">Hablar ahora</a>
      <a class="btn btn-primary" target="_blank" rel="noopener noreferrer" href="https://wa.me/${siteData.contact.info.whatsapp.number}?text=Quiero%20reservar%20${encodeURIComponent(tour.name)}">Whatsapp</a>
    </div>
  `;

  modal.classList.remove('hidden');
  document.body.classList.add('modal-open');
  const closeBtn = modal.querySelector('.modal-close');
  if (closeBtn) closeBtn.focus();
}

function closeTourModal() {
  const modal = document.getElementById('tourDetailModal');
  if (!modal) return;
  modal.classList.add('hidden');
  document.body.classList.remove('modal-open');
  if (lastFocusedElement) lastFocusedElement.focus();
}

function openBlogModal(post) {
  const modal = document.getElementById('blogModal');
  if (!modal) return;
  const modalBody = modal.querySelector('.blog-modal-body');
  if (!modalBody) return;

  lastFocusedElement = document.activeElement;
  modalBody.innerHTML = `
    <p class="eyebrow">Nota destacada</p>
    <h3 id="blogModalTitle">${post.title}</h3>
    <p class="meta">${post.excerpt}</p>
    <p>${post.content}</p>
    <div class="modal-actions">
      <button class="btn btn-primary blog-close" type="button">Listo</button>
      <a class="btn btn-outline blog-contact" href="#contacto">Cotizar este destino</a>
    </div>
  `;

  modal.classList.remove('hidden');
  document.body.classList.add('modal-open');
  const closeBtn = modal.querySelector('.modal-close');
  if (closeBtn) closeBtn.focus();
  const quickClose = modal.querySelector('.blog-close');
  if (quickClose) quickClose.addEventListener('click', closeBlogModal);
}

function closeBlogModal() {
  const modal = document.getElementById('blogModal');
  if (!modal) return;
  modal.classList.add('hidden');
  document.body.classList.remove('modal-open');
  if (lastFocusedElement) lastFocusedElement.focus();
}

function filterTours(formData) {
  const destination = formData.get('destino');
  const difficulty = formData.get('dificultad');
  const duration = formData.get('duracion');
  const budgetRaw = formData.get('presupuesto_usd');
  const budget = budgetRaw ? Number(budgetRaw) : null;

  return siteData.tours.items.filter((tour) => {
    const matchesDestination = !destination || destination === 'Cualquiera' || tour.country === destination;
    const matchesDifficulty = !difficulty || difficulty === 'Cualquiera' || tour.difficulty === difficulty;
    const matchesDuration = !duration || duration === 'Cualquiera' || durationMatch(duration, tour.duration);
    const matchesBudget = !budget || tour.price <= budget;
    return matchesDestination && matchesDifficulty && matchesDuration && matchesBudget;
  });
}

function durationMatch(filterValue, tourDuration) {
  const days = parseInt(tourDuration, 10) || 0;
  if (filterValue.includes('1-2')) return days >= 1 && days <= 2;
  if (filterValue.includes('3-5')) return days >= 3 && days <= 5;
  if (filterValue.includes('6-8')) return days >= 6 && days <= 8;
  if (filterValue.includes('9')) return days >= 9;
  return true;
}

function renderStars(rating) {
  const fullStars = Math.max(0, Math.min(5, Math.round(rating || 0)));
  const filled = '&#9733;'.repeat(fullStars);
  const empty = '&#9734;'.repeat(5 - fullStars);
  return `<span class="stars" aria-label="${rating} de 5">${filled}${empty}</span>`;
}

function updateYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

function enforceFocusStyles() {
  function handleFirstTab(e) {
    if (e.key === 'Tab') {
      document.body.classList.add('user-is-tabbing');
      window.removeEventListener('keydown', handleFirstTab);
    }
  }
  window.addEventListener('keydown', handleFirstTab);
}

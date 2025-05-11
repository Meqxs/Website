// Theme Switcher
const html = document.documentElement;
const themeBtns = document.querySelectorAll('.theme-btn');
const THEME_KEY = 'theme';

function setTheme(theme) {
  html.classList.remove('theme-light', 'theme-dark');
  html.classList.add(`theme-${theme}`);
  localStorage.setItem(THEME_KEY, theme);
  
  // Update active state of theme buttons
  themeBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === theme);
  });
}

// On load, set theme from localStorage or system preference
function initTheme() {
  let theme = localStorage.getItem(THEME_KEY);
  if (!theme) {
    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  setTheme(theme);
}

// Initialize theme when DOM is ready
document.addEventListener('DOMContentLoaded', initTheme);

themeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const theme = btn.dataset.theme;
    setTheme(theme);
    
    // Add click animation
    btn.style.transform = 'scale(0.95)';
    setTimeout(() => {
      btn.style.transform = '';
    }, 200);
  });
});

// Smooth scroll for nav links
const navLinks = document.querySelectorAll('.nav-links a, .hero-buttons a, .navbar a');
navLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});

// Fade-in animation on scroll
const fadeEls = document.querySelectorAll('.section, .card');
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

fadeEls.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.7s cubic-bezier(0.4,0,0.2,1), transform 0.7s cubic-bezier(0.4,0,0.2,1)';
  fadeObserver.observe(el);
});

// Load GitHub Projects
async function loadGitHubProjects() {
  const projectsGrid = document.getElementById('githubProjects');
  if (!projectsGrid) return;
  projectsGrid.innerHTML = '<p>Loading projects...</p>';
  try {
    const res = await fetch('https://api.github.com/users/meqxs/repos?sort=updated&per_page=6');
    const repos = await res.json();
    projectsGrid.innerHTML = repos.map(repo => `
      <div class="card">
        <h3>${repo.name}</h3>
        <p>${repo.description || 'No description available.'}</p>
        <a href="${repo.html_url}" target="_blank" rel="noopener" class="round-btn round-btn--secondary">View on GitHub</a>
      </div>
    `).join('');
  } catch (err) {
    projectsGrid.innerHTML = '<p>Could not load projects. Try again later.</p>';
  }
}
loadGitHubProjects();

// Contact Form Handling with EmailJS
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
if (contactForm && formStatus) {
  // Initialize EmailJS
  if (window.emailjs) {
    emailjs.init('uG_KO7Ftj83ZfNHF8');
  }
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    formStatus.textContent = 'Sending...';
    formStatus.className = 'form-status';
    const formData = {
      name: this.name.value,
      email: this.email.value,
      message: this.message.value,
      to_email: 'meqxs1@gmail.com'
    };
    try {
      await emailjs.send('service_785zqgs', 'template_mjucgmd', formData);
      formStatus.textContent = 'Message sent successfully! I\'ll get back to you soon.';
      formStatus.className = 'form-status success';
      contactForm.reset();
    } catch (error) {
      formStatus.textContent = 'Failed to send message. Please try again later.';
      formStatus.className = 'form-status error';
      console.error('EmailJS error:', error);
    }
  });
}

// Navbar background change on scroll
const nav = document.querySelector('.nav-container');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        nav.style.background = 'rgba(var(--background-color), 0.8)';
        return;
    }
    
    if (currentScroll > lastScroll) {
        // Scrolling down
        nav.style.background = 'rgba(var(--background-color), 0.95)';
    } else {
        // Scrolling up
        nav.style.background = 'rgba(var(--background-color), 0.8)';
    }
    
    lastScroll = currentScroll;
});

// Animate hero on load
document.addEventListener('DOMContentLoaded', () => {
    requestAnimationFrame(() => {
        const heroTitle = document.querySelector('.hero h1');
        const subtitle = document.querySelector('.subtitle');
        const buttons = document.querySelector('.hero-buttons');
        
        if (heroTitle) heroTitle.style.opacity = '1';
        if (heroTitle) heroTitle.style.transform = 'translateY(0)';
        if (subtitle) subtitle.style.opacity = '1';
        if (subtitle) subtitle.style.transform = 'translateY(0)';
        if (buttons) buttons.style.opacity = '1';
        if (buttons) buttons.style.transform = 'translateY(0)';
    });
});

// Back to Top button
const backToTop = document.getElementById('backToTop');
if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// View Counter
function updateViewCount() {
    const viewCount = localStorage.getItem('viewCount') || 0;
    const newCount = parseInt(viewCount) + 1;
    localStorage.setItem('viewCount', newCount);
    
    // Animate the counter
    const counterElement = document.getElementById('viewCount');
    const targetCount = newCount;
    let currentCount = 0;
    
    const duration = 1000; // 1 second
    const steps = 20;
    const increment = targetCount / steps;
    const stepDuration = duration / steps;
    
    const counter = setInterval(() => {
        currentCount = Math.min(currentCount + increment, targetCount);
        counterElement.textContent = Math.floor(currentCount);
        
        if (currentCount >= targetCount) {
            clearInterval(counter);
        }
    }, stepDuration);
}

// Initialize view counter
document.addEventListener('DOMContentLoaded', () => {
    updateViewCount();
}); 
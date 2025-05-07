// Theme Switcher
document.addEventListener('DOMContentLoaded', () => {
    const themeButtons = document.querySelectorAll('.theme-btn');
    const html = document.documentElement;

    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'ocean';
    html.className = `theme-${savedTheme}`;

    themeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const theme = button.classList.contains('ocean') ? 'ocean' : 'galaxy';
            html.className = `theme-${theme}`;
            localStorage.setItem('theme', theme);
        });
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

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

// Intersection Observer for fade-in animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply fade-in animation to sections
document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(section);
});

// Add hover effect to experience and project cards
document.querySelectorAll('.experience-card, .project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Animate hero on load
window.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.hero-title').style.opacity = '1';
    document.querySelector('.hero-title').style.transform = 'translateY(0)';
    document.querySelector('.subtitle').style.opacity = '1';
    document.querySelector('.subtitle').style.transform = 'translateY(0)';
});

// Back to Top button
const backToTop = document.getElementById('backToTop');
if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Load GitHub Projects
async function loadGitHubProjects() {
    const projectsGrid = document.getElementById('githubProjects');
    if (!projectsGrid) return;

    try {
        const response = await fetch('https://api.github.com/users/meqxs/repos?sort=updated&per_page=6');
        const projects = await response.json();

        projectsGrid.innerHTML = projects.map(project => `
            <div class="project-card">
                <h3>${project.name}</h3>
                <p>${project.description || 'No description available'}</p>
                <div class="project-stats">
                    <span>⭐ ${project.stargazers_count}</span>
                    <span>🔄 ${project.forks_count}</span>
                </div>
                <a href="${project.html_url}" target="_blank" class="project-link">
                    View Project →
                </a>
            </div>
        `).join('');

        // Add hover effects to new project cards
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });
    } catch (error) {
        projectsGrid.innerHTML = `
            <div class="error-message">
                <span>⚠️</span>
                <p>Failed to load projects. Please try again later.</p>
            </div>
        `;
    }
}

// Load projects when the page loads
document.addEventListener('DOMContentLoaded', loadGitHubProjects);

// Initialize EmailJS
(function() {
    emailjs.init("uG_KO7Ftj83ZfNHF8");
})();

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitButton = this.querySelector('button[type="submit"]');
        submitButton.classList.add('loading');
        
        try {
            const formData = {
                name: this.name.value,
                email: this.email.value,
                message: this.message.value,
                to_email: 'meqxs1@gmail.com'
            };
            
            await emailjs.send('service_785zqgs', 'template_mjucgmd', formData);
            
            formStatus.textContent = 'Message sent successfully! I\'ll get back to you soon.';
            formStatus.className = 'form-status success';
            this.reset();
        } catch (error) {
            formStatus.textContent = 'Failed to send message. Please try again later.';
            formStatus.className = 'form-status error';
            console.error('EmailJS error:', error);
        } finally {
            submitButton.classList.remove('loading');
        }
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
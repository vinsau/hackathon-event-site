import './style.css'

// ===== DOM Elements =====
const navbar = document.querySelector('.navbar');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const tabBtns = document.querySelectorAll('.tab-btn');
const scheduleDays = document.querySelectorAll('.schedule-day');
const faqItems = document.querySelectorAll('.faq-item');
const registerForm = document.getElementById('registerForm');
const carouselTrack = document.querySelector('.carousel-track');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');
const carouselDots = document.querySelector('.carousel-dots');

// ===== Navbar Scroll Effect =====
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 100) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  
  lastScroll = currentScroll;
});

// ===== Mobile Navigation =====
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navLinks.classList.toggle('active');
  document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
});

// Close mobile nav when clicking a link
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navLinks.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// ===== Countdown Timer =====
function updateCountdown() {
  // Set the event date - March 15, 2025
  const eventDate = new Date('March 15, 2025 09:00:00').getTime();
  const now = new Date().getTime();
  const distance = eventDate - now;
  
  if (distance < 0) {
    document.getElementById('days').textContent = '00';
    document.getElementById('hours').textContent = '00';
    document.getElementById('minutes').textContent = '00';
    document.getElementById('seconds').textContent = '00';
    return;
  }
  
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  
  document.getElementById('days').textContent = String(days).padStart(2, '0');
  document.getElementById('hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ===== Animated Counter for Stats =====
function animateCounter(element) {
  const target = parseInt(element.dataset.count);
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;
  
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 16);
}

// ===== Schedule Tabs =====
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const day = btn.dataset.day;
    
    // Update active tab
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Show corresponding day
    scheduleDays.forEach(d => {
      d.classList.remove('active');
      if (d.dataset.day === day) {
        d.classList.add('active');
      }
    });
  });
});

// ===== FAQ Accordion =====
faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');
  
  question.addEventListener('click', () => {
    const isActive = item.classList.contains('active');
    
    // Close all items
    faqItems.forEach(i => i.classList.remove('active'));
    
    // Open clicked item if it wasn't active
    if (!isActive) {
      item.classList.add('active');
    }
  });
});

// ===== Carousel =====
let currentSlide = 0;
const cards = document.querySelectorAll('.track-card');
let slidesPerView = getSlidesPerView();
let totalSlides = Math.ceil(cards.length / slidesPerView);

function getSlidesPerView() {
  if (window.innerWidth < 768) return 1;
  if (window.innerWidth < 1024) return 2;
  return 3;
}

function createDots() {
  carouselDots.innerHTML = '';
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    carouselDots.appendChild(dot);
  }
}

function updateDots() {
  const dots = carouselDots.querySelectorAll('.dot');
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentSlide);
  });
}

function goToSlide(index) {
  currentSlide = index;
  const cardWidth = cards[0].offsetWidth + 24; // card width + gap
  const offset = -currentSlide * cardWidth * slidesPerView;
  carouselTrack.style.transform = `translateX(${offset}px)`;
  updateDots();
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % totalSlides;
  goToSlide(currentSlide);
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  goToSlide(currentSlide);
}

prevBtn.addEventListener('click', prevSlide);
nextBtn.addEventListener('click', nextSlide);

// Auto-slide
let autoSlide = setInterval(nextSlide, 5000);

// Pause on hover
carouselTrack.addEventListener('mouseenter', () => clearInterval(autoSlide));
carouselTrack.addEventListener('mouseleave', () => {
  autoSlide = setInterval(nextSlide, 5000);
});

// Handle resize
window.addEventListener('resize', () => {
  const newSlidesPerView = getSlidesPerView();
  if (newSlidesPerView !== slidesPerView) {
    slidesPerView = newSlidesPerView;
    totalSlides = Math.ceil(cards.length / slidesPerView);
    currentSlide = 0;
    createDots();
    goToSlide(0);
  }
});

createDots();

// ===== Scroll Reveal Animation =====
const revealElements = document.querySelectorAll('.reveal');

function reveal() {
  revealElements.forEach(element => {
    const windowHeight = window.innerHeight;
    const elementTop = element.getBoundingClientRect().top;
    const revealPoint = 150;
    
    if (elementTop < windowHeight - revealPoint) {
      element.classList.add('active');
      
      // Animate counters when they come into view
      const counter = element.querySelector('.stat-number');
      if (counter && !counter.dataset.animated) {
        counter.dataset.animated = 'true';
        animateCounter(counter);
      }
    }
  });
}

// Also animate hero stats on load
document.querySelectorAll('.hero-stats .stat-number').forEach(counter => {
  setTimeout(() => {
    animateCounter(counter);
  }, 1000);
});

window.addEventListener('scroll', reveal);
reveal(); // Initial check

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offset = 80; // navbar height
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ===== Form Submission =====
registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const formData = new FormData(registerForm);
  const data = Object.fromEntries(formData);
  
  // Simulate form submission
  const submitBtn = registerForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  
  submitBtn.disabled = true;
  submitBtn.textContent = 'Registering...';
  
  setTimeout(() => {
    // Show success message
    registerForm.innerHTML = `
      <div class="success-message" style="text-align: center; padding: 40px;">
        <div style="font-size: 4rem; margin-bottom: 20px;">🎉</div>
        <h3 style="font-size: 1.5rem; margin-bottom: 12px;">You're In!</h3>
        <p style="color: var(--text-secondary);">Check your email for confirmation and next steps.</p>
      </div>
    `;
    
    console.log('Registration data:', data);
  }, 1500);
});

// ===== Parallax Effect on Hero Shapes =====
document.addEventListener('mousemove', (e) => {
  const shapes = document.querySelectorAll('.shape');
  const mouseX = e.clientX / window.innerWidth - 0.5;
  const mouseY = e.clientY / window.innerHeight - 0.5;
  
  shapes.forEach((shape, index) => {
    const speed = (index + 1) * 20;
    const x = mouseX * speed;
    const y = mouseY * speed;
    shape.style.transform = `translate(${x}px, ${y}px)`;
  });
});

// ===== Intersection Observer for Performance =====
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, observerOptions);

revealElements.forEach(element => {
  observer.observe(element);
});

console.log('🚀 HackNova 2025 - Ready to Code the Future!');

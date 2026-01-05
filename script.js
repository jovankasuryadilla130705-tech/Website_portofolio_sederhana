// Initialize AOS
AOS.init({
    duration: 1000,
    once: true,
    offset: 100,
    easing: 'ease-out-cubic'
});

// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const themeToggleMobile = document.getElementById('theme-toggle-mobile');
const body = document.body;
const icon = themeToggle.querySelector('i');
const mobileIcon = themeToggleMobile.querySelector('i');

// Check Local Storage
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark') {
    body.classList.add('dark-mode');
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
    mobileIcon.classList.remove('fa-moon');
    mobileIcon.classList.add('fa-sun');
}

function toggleTheme() {
    body.classList.toggle('dark-mode');

    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        mobileIcon.classList.remove('fa-moon');
        mobileIcon.classList.add('fa-sun');
    } else {
        localStorage.setItem('theme', 'light');
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        mobileIcon.classList.remove('fa-sun');
        mobileIcon.classList.add('fa-moon');
    }
}

themeToggle.addEventListener('click', toggleTheme);
themeToggleMobile.addEventListener('click', toggleTheme);

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    const icon = mobileMenuBtn.querySelector('i');
    if (mobileMenu.classList.contains('hidden')) {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    } else {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    }
});

// Close mobile menu when clicking a link
document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenuBtn.querySelector('i').classList.remove('fa-times');
        mobileMenuBtn.querySelector('i').classList.add('fa-bars');
    });
});

// Typewriter Effect
class Typewriter {
    constructor(el, toRotate, period) {
        this.toRotate = toRotate;
        this.el = el;
        this.loopNum = 0;
        this.period = parseInt(period, 10) || 2000;
        this.txt = '';
        this.tick();
        this.isDeleting = false;
    }

    tick() {
        var i = this.loopNum % this.toRotate.length;
        var fullTxt = this.toRotate[i];

        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>';

        var that = this;
        var delta = 200 - Math.random() * 100;

        if (this.isDeleting) { delta /= 2; }

        if (!this.isDeleting && this.txt === fullTxt) {
            delta = this.period;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.loopNum++;
            delta = 500;
        }

        setTimeout(function () {
            that.tick();
        }, delta);
    }
}

window.onload = function () {
    var elements = document.getElementsByClassName('type-write');
    for (var i = 0; i < elements.length; i++) {
        var toRotate = elements[i].getAttribute('data-type');
        var period = elements[i].getAttribute('data-period');
        if (toRotate) {
            new Typewriter(elements[i], JSON.parse(toRotate), period);
        }
    }
};

// Scroll Active Link Highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const id = section.getAttribute('id');
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const navLinks = document.querySelectorAll(`nav ul li a[href="#${id}"], .hidden.md\\:block a[href="#${id}"]`);

        if (scrollPos >= top && scrollPos < top + height) {
            navLinks.forEach(link => {
                link.classList.add('text-primary');
                // link.classList.remove('text-text'); 
            });
        } else {
            navLinks.forEach(link => {
                link.classList.remove('text-primary');
            });
        }
    });
});

// Animated Counters
const runCounter = (el) => {
    const target = +el.getAttribute('data-target');
    const duration = 2000; // ms
    const increment = target / (duration / 16); // 60fps

    let current = 0;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            el.innerText = target + '+';
            clearInterval(timer);
        } else {
            el.innerText = Math.ceil(current);
        }
    }, 16);
};

const observerOptions = {
    threshold: 0.5
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('span[data-target]');
            counters.forEach(counter => runCounter(counter));
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

const aboutSection = document.getElementById('about');
if (aboutSection) {
    observer.observe(aboutSection);
}

// Project Filtering
window.filterProjects = function (category) {
    const projects = document.querySelectorAll('.project-card');
    const buttons = document.querySelectorAll('#projects button');

    // Update buttons state
    buttons.forEach(btn => {
        if (btn.textContent.toLowerCase() === category || (category === 'all' && btn.textContent.toLowerCase() === 'all')) {
            btn.classList.add('bg-primary', 'text-white', 'shadow-md');
            btn.classList.remove('bg-surface', 'text-text', 'hover:bg-gray-100', 'dark:hover:bg-gray-800', 'border', 'border-border');
        } else {
            btn.classList.remove('bg-primary', 'text-white', 'shadow-md');
            btn.classList.add('bg-surface', 'text-text', 'hover:bg-gray-100', 'dark:hover:bg-gray-800', 'border', 'border-border');
        }
    });

    projects.forEach(project => {
        if (category === 'all' || project.getAttribute('data-category') === category) {
            project.style.display = 'block';
            // Trigger reflow for transition
            setTimeout(() => {
                project.style.opacity = '1';
                project.style.transform = 'scale(1)';
            }, 50);
        } else {
            project.style.opacity = '0';
            project.style.transform = 'scale(0.9)';
            setTimeout(() => {
                project.style.display = 'none';
            }, 300);
        }
    });
};

// Contact Form
document.getElementById('contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const originalText = btn.innerText;

    btn.innerText = 'Sending...';
    btn.disabled = true;

    // Simulate sending
    setTimeout(() => {
        btn.innerText = 'Message Sent!';
        btn.classList.remove('bg-primary', 'hover:bg-primary-light');
        btn.classList.add('bg-green-500', 'hover:bg-green-600');
        e.target.reset();

        setTimeout(() => {
            btn.innerText = originalText;
            btn.disabled = false;
            btn.classList.add('bg-primary', 'hover:bg-primary-light');
            btn.classList.remove('bg-green-500', 'hover:bg-green-600');
        }, 3000);
    }, 1500);
});

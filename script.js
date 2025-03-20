// Wait until everything is loaded
console.log("script has loaded!!");
window.addEventListener('load', function() {
    // Initialize AOS animations
    AOS.init({
        duration: 1000,
        once: true,
        mirror: false
    });
    
    // Hide loading spinner
    setTimeout(() => {
        document.querySelector('.loading-spinner').style.opacity = '0';
        setTimeout(() => {
            document.querySelector('.loading-spinner').style.display = 'none';
        }, 500);
    }, 1500);
    
    // Initialize Typed.js for the typing animation
    const typed = new Typed('.typed-text', {
        strings: ['Software Engineer', 'AI Enthusiast', 'Product Thinker', 'Code Craftsman'],
        typeSpeed: 80,
        backSpeed: 40,
        backDelay: 1500,
        loop: true
    });
    
    // Animate section headings when they come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('h2').forEach(heading => {
        observer.observe(heading);
    });

});

particlesJS("particles-js", {
particles: {
    number: { value: 80, density: { enable: true, value_area: 1000 } },
    color: { value: "#ffffff" },
    shape: { type: "circle" },
    opacity: { value: 0.5, random: true },
    size: { value: 3, random: true },
    move: { enable: true, speed: 1, direction: "none", out_mode: "out" },
    line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.3, width: 1 }
},
interactivity: {
    detect_on: "canvas",
    events: { onhover: { enable: true, mode: "repulse" } },
    modes: { repulse: { distance: 100, duration: 0.4 } }
},
retina_detect: true
});
    

// Custom cursor follow
document.addEventListener('mousemove', function(e) {
    const cursor = document.querySelector('.cursor-follow');
    cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
});

document.addEventListener('mousedown', function() {
    const cursor = document.querySelector('.cursor-follow');
    cursor.style.width = '15px';
    cursor.style.height = '15px';
});

document.addEventListener('mouseup', function() {
    const cursor = document.querySelector('.cursor-follow');
    cursor.style.width = '20px';
    cursor.style.height = '20px';
});

// Progress bar
window.addEventListener('scroll', function() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.querySelector('.progress-bar').style.width = scrolled + '%';
    
    // Back to top button visibility
    if (winScroll > 300) {
        document.querySelector('.back-to-top').classList.add('active');
    } else {
        document.querySelector('.back-to-top').classList.remove('active');
    }
    
    // Navigation highlighting
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (winScroll >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
    
    // Navbar scroll effect
    if (winScroll > 50) {
        document.querySelector('nav').classList.add('scrolled');
    } else {
        document.querySelector('nav').classList.remove('scrolled');
    }
    
});

// Back to top functionality
document.querySelector('.back-to-top').addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Smooth scrolling for navigation
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        window.scrollTo({
            top: targetSection.offsetTop - 70,
            behavior: 'smooth'
        });
        
        // Close mobile menu if open
        if (document.querySelector('#navMenu').classList.contains('active')) {
            document.querySelector('#navMenu').classList.remove('active');
            document.querySelector('.mobile-nav-toggle i').classList.remove('fa-times');
            document.querySelector('.mobile-nav-toggle i').classList.add('fa-bars');
        }
    });
});

// Mobile navigation toggle
document.querySelector('.mobile-nav-toggle').addEventListener('click', function() {
    const navMenu = document.querySelector('#navMenu');
    navMenu.classList.toggle('active');
    
    const icon = this.querySelector('i');
    if (navMenu.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Form validation
document.getElementById('submit-form').addEventListener('click', function(e) {
    e.preventDefault();
    
    let isValid = true;
    const formInputs = document.querySelectorAll('.form-input');
    
    formInputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = 'red';
            input.nextElementSibling.textContent = 'This field is required';
        } else {
            input.style.borderColor = '#ddd';
            input.nextElementSibling.textContent = '';
        }
        
        if (input.id === 'email' && input.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                isValid = false;
                input.style.borderColor = 'red';
                input.nextElementSibling.textContent = 'Please enter a valid email';
            }
        }
    });
    
    if (isValid) {
        // Simulate form submission
        const button = document.getElementById('submit-form');
        const formStatus = document.getElementById('form-status');
        
        button.disabled = true;
        button.textContent = 'Sending...';
        
        setTimeout(() => {
            formStatus.textContent = 'Message sent successfully!';
            formStatus.style.color = 'green';
            button.textContent = 'Send Message';
            button.disabled = false;
            
            // Clear form
            formInputs.forEach(input => {
                input.value = '';
            });
            
            // Clear success message after 3 seconds
            setTimeout(() => {
                formStatus.textContent = '';
            }, 3000);
        }, 2000);
    }
});

// Project modal functionality
const projectData = {
    project1: {
        title: 'Fake News Detection',
        description: `
            <h2>📰 Fake News Detection using NLP</h2>
            <p>A binary classification model that detects fake news by analyzing key features such as title, author, and text.</p>
            <h3>🔑 Key Features:</h3>
            <ul>
                <li>Binary classification for reliable news detection</li>
                <li>Sentiment analysis to enhance accuracy</li>
                <li>Comparative analysis: (Author + Title) vs (Title + Body)</li>
                <li>High accuracy with optimized computational efficiency</li>
                <li>Detection of clickbait and unreliable sources</li>
            </ul>
            <h3>🛠 Technologies Used:</h3>
            <p><strong>Python, TensorFlow, Scikit-learn, NLP, NLTK, Pandas</strong></p>
            <a href="#" class="project-link">🔗 View Project</a>
        `,
        image: 'assets/projects/fakenewsdetection.jpg'
    },
    project2: {
        title: 'Color Switch Clone',
        description: `
            <h2>🎮 Color Switch Clone</h2>
            <p>A high-fidelity clone of Color Switch featuring saving properties, built using Object-Oriented Programming (OOP) and design patterns.</p>
            <h3>🔑 Key Features:</h3>
            <ul>
                <li>Endless gameplay mode</li>
                <li>Checkpoint system for progress saving</li>
                <li>Score and progression tracking</li>
                <li>Exciting power-ups and boosts</li>
                <li>Leaderboard and state persistence</li>
            </ul>
            <h3>🛠 Technologies Used:</h3>
            <p><strong>Java, JavaFX</strong></p>
            <a href="#" class="project-link">🔗 View Project</a>
        `,
        image: 'assets/projects/colorswitch.jpg'
    },
    project3: {
        title: 'Decentralized Identity Vault',
        description: `
            <h2>🔐 Decentralized Identity Vault</h2>
            <p>A Web3 DApp enabling users to create and manage decentralized identities using blockchain and IPFS.</p>
            <h3>🔑 Key Features:</h3>
            <ul>
                <li>Self-sovereign identity creation</li>
                <li>Storage of hashed identity data on IPFS</li>
                <li>Smart contract-based authentication</li>
                <li>Metamask wallet integration</li>
                <li>Basic zero-knowledge proof (ZKP) implementation</li>
            </ul>
            <h3>🛠 Technologies Used:</h3>
            <p><strong>Ethereum, Solidity, IPFS, Web3.js, React, Metamask</strong></p>
            <a href="#" class="project-link">🔗 View Project</a>
        `,
        image: 'assets/projects/crypto.jpg'
    }
};

document.querySelectorAll('.view-project').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        
        const projectId = this.dataset.project;
        const project = projectData[projectId];
        
        if (project) {
            const modalContent = document.getElementById('modalContent');
            modalContent.innerHTML = `
                <h2 class="modalHeading">${project.title}</h2>
                <img src="${project.image}" alt="${project.title}" style="width: 100%; border-radius: 10px; margin: 20px 0;">
                <div class="modalText">${project.description}</div>`;
            
            document.getElementById('projectModal').classList.add('active');
        }
    });
});


document.querySelector('.modal-close').addEventListener('click', function() {
    document.getElementById('projectModal').classList.remove('active');
});

// Close modal when clicking outside
document.getElementById('projectModal').addEventListener('click', function(e) {
    if (e.target === this) {
        this.classList.remove('active');
    }
});

// Theme switcher
document.querySelector('.theme-switch').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    const icon = this.querySelector('i');
    
    if (document.body.classList.contains('dark-mode')) {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    } else {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
});

// Animation on scroll for skill items
window.addEventListener('scroll', function() {
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
        const itemPosition = item.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (itemPosition < screenPosition) {
            item.style.transform = 'translateY(0) scale(1)';
            item.style.opacity = 1;
        }
    });
});



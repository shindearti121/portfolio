document.addEventListener('DOMContentLoaded', () => {
    
    // Intersection Observer for Reveal Animations
    const observerOptions = {
        threshold: 0.15
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                entry.target.style.animation = getAnimation(entry.target);
                
                // Trigger skill bars if in vision
                if (entry.target.id === 'skills') {
                    animateSkills();
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    function getAnimation(el) {
        if (el.id === 'landing') return 'fadeInUp 1s ease-out forwards';
        if (el.classList.contains('exp-card')) return 'slideInLeft 0.8s ease-out forwards';
        if (el.classList.contains('proj-card')) return 'flipIn 0.8s ease-out forwards';
        return 'fadeInUp 0.8s ease-out forwards';
    }

    // Animate Skill Bars
    function animateSkills() {
        const bars = document.querySelectorAll('.skill-progress');
        bars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            bar.style.width = width;
        });
    }

    // Form Interactivity
    const submitBtn = document.querySelector('.btn-submit');
    if (submitBtn) {
        submitBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            if (!name || !email || !message) {
                alert('Please fill out all required fields.');
                return;
            }

            const originalBtnText = submitBtn.innerText;
            submitBtn.style.opacity = '0.7';
            submitBtn.innerText = 'Sending...';
            submitBtn.disabled = true;

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, email, subject, message }),
                });

                const result = await response.json();

                if (response.ok) {
                    submitBtn.innerText = 'Message Sent!';
                    submitBtn.style.background = '#10B981'; // Success Green
                    submitBtn.style.color = '#FFFFFF';
                    
                    // Clear form
                    document.getElementById('name').value = '';
                    document.getElementById('email').value = '';
                    document.getElementById('subject').value = '';
                    document.getElementById('message').value = '';
                } else {
                    throw new Error(result.message || 'Failed to send message.');
                }
            } catch (error) {
                console.error('Submission error:', error);
                submitBtn.innerText = 'Error! Try Again';
                submitBtn.style.background = '#EF4444'; // Error Red
                submitBtn.style.color = '#FFFFFF';
                
                setTimeout(() => {
                    submitBtn.innerText = originalBtnText;
                    submitBtn.style.background = ''; // Reset
                    submitBtn.style.color = '';
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                }, 3000);
            }
        });
    }

    // Smooth Scroll Offset for Fixed Nav
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            const offset = 80;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = target.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });

    // Staggered Project Tech Tags Bounce
    document.querySelectorAll('.proj-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            const tags = card.querySelectorAll('.tech-tag');
            tags.forEach((tag, i) => {
                tag.style.animation = `rubberBand 0.6s ease ${i * 0.1}s forwards`;
            });
        });
        card.addEventListener('mouseleave', () => {
            const tags = card.querySelectorAll('.tech-tag');
            tags.forEach(tag => {
                tag.style.animation = 'none';
            });
        });
    });

});

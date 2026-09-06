/**
 * Yatra Technologies — Interactive Website Engine
 * Inspired by LeadingEdgeSoft: Working Process Stepper, Counter Animations,
 * Dual Marquees, Estimator, Testimonials, Form Validation, and Theme Engine.
 */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. THEME MANAGER (Dark / Light Mode)
    // ----------------------------------------------------
    const themeToggleBtn = document.getElementById('theme-toggle');
    const mobileThemeToggleBtn = document.getElementById('mobile-theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    function getCurrentTheme() {
        const savedTheme = localStorage.getItem('yatra_theme');
        if (savedTheme) return savedTheme;
        return prefersDark.matches ? 'dark' : 'light';
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('yatra_theme', theme);
        updateThemeToggleIcons(theme);
    }

    function updateThemeToggleIcons(theme) {
        const iconSvg = theme === 'dark'
            ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
            : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;

        if (themeToggleBtn) {
            themeToggleBtn.innerHTML = iconSvg;
            themeToggleBtn.setAttribute('title', `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`);
        }
        if (mobileThemeToggleBtn) {
            mobileThemeToggleBtn.innerHTML = iconSvg + `<span>${theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>`;
        }
    }

    applyTheme(getCurrentTheme());

    function toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        showToast(`Switched to ${next} mode`);
    }

    if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
    if (mobileThemeToggleBtn) mobileThemeToggleBtn.addEventListener('click', toggleTheme);

    prefersDark.addEventListener('change', (e) => {
        if (!localStorage.getItem('yatra_theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });

    // ----------------------------------------------------
    // 2. MOBILE NAVIGATION DRAWER
    // ----------------------------------------------------
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const drawerOverlay = document.getElementById('drawer-overlay');
    const drawerCloseBtn = document.getElementById('drawer-close');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    function openDrawer() {
        if (!mobileDrawer) return;
        mobileDrawer.classList.add('active');
        if (drawerOverlay) drawerOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'true');
    }

    function closeDrawer() {
        if (!mobileDrawer) return;
        mobileDrawer.classList.remove('active');
        if (drawerOverlay) drawerOverlay.classList.remove('active');
        document.body.style.overflow = '';
        if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
    }

    if (mobileToggle) mobileToggle.addEventListener('click', openDrawer);
    if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
    if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

    drawerLinks.forEach(link => {
        link.addEventListener('click', closeDrawer);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeDrawer();
    });

    // ----------------------------------------------------
    // 3. SCROLLSPY & HEADER STICKY STATE
    // ----------------------------------------------------
    const header = document.querySelector('.header');
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    const backToTopBtn = document.getElementById('back-to-top');

    function handleScroll() {
        const scrollY = window.pageYOffset;

        if (header) {
            header.classList.toggle('scrolled', scrollY > 40);
        }

        if (backToTopBtn) {
            backToTopBtn.classList.toggle('visible', scrollY > 400);
        }

        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 140;
            const sectionHeight = section.offsetHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ----------------------------------------------------
    // 4. ANIMATED COUNTERS (Hero Trust & Flagship Stats)
    // ----------------------------------------------------
    const countElements = document.querySelectorAll('[data-count]');
    let countsAnimated = false;

    function animateAllCounters() {
        countElements.forEach(el => {
            const target = parseInt(el.getAttribute('data-count') || '0', 10);
            const duration = 1600;
            const startTime = performance.now();

            function update(now) {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out expo
                const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                const current = Math.floor(ease * target);
                el.textContent = current;

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    el.textContent = target;
                }
            }

            requestAnimationFrame(update);
        });
    }

    // Intersection observer for counters
    const firstCounterEl = countElements[0];
    if (firstCounterEl) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countsAnimated) {
                    countsAnimated = true;
                    animateAllCounters();
                }
            });
        }, { threshold: 0.1 });

        countElements.forEach(el => counterObserver.observe(el));
    }

    // ----------------------------------------------------
    // 5. INTERACTIVE 4-STEP WORKING PROCESS (Leading Edge feature)
    // ----------------------------------------------------
    const stepButtons = document.querySelectorAll('.step-button');
    const stepProgressBar = document.getElementById('step-progress');
    const stepsText = document.getElementById('steps-text');
    const stepsImage = document.getElementById('steps-image');

    const stepDetails = {
        1: {
            title: "Discovery & Requirements",
            text: "Here we analyze and discover all your business requirements, operational bottlenecks, and user workflows. We systematically prioritize features to eliminate risks before writing a single line of code.",
            progress: 25,
            tag: "Phase 1 / Discovery"
        },
        2: {
            title: "Architecture & Sprint Planning",
            text: "We architect resilient database schemas, cloud infrastructure, and interactive UI/UX prototypes. We then create clear bi-weekly sprint milestones with fixed deliverables and transparent timelines.",
            progress: 50,
            tag: "Phase 2 / Planning"
        },
        3: {
            title: "Agile Development & QA",
            text: "Our engineers build clean, modular code with continuous automated integration (CI/CD) and peer review. Weekly client staging demos ensure complete alignment every step of the way.",
            progress: 75,
            tag: "Phase 3 / Execute"
        },
        4: {
            title: "Deployment, Training & SLA",
            text: "We deploy to secure cloud infrastructure, train your internal staff, and monitor system telemetry 24/7. Every launch comes with a comprehensive 30-day warranty and ongoing SLA support.",
            progress: 100,
            tag: "Phase 4 / Delivery"
        }
    };

    function setStep(stepNum) {
        const data = stepDetails[stepNum];
        if (!data) return;

        // Update step buttons
        stepButtons.forEach(btn => {
            const num = parseInt(btn.getAttribute('data-step') || '1', 10);
            btn.classList.toggle('active', num === stepNum);
            btn.classList.toggle('completed', num < stepNum);
        });

        // Update progress bar
        if (stepProgressBar) {
            stepProgressBar.style.width = `${data.progress}%`;
        }

        // Update text with smooth transition
        if (stepsText) {
            stepsText.style.opacity = '0';
            stepsText.style.transform = 'translateY(6px)';
            setTimeout(() => {
                stepsText.innerHTML = `
                    <div class="step-badge-pill">${data.tag}</div>
                    <h4>${data.title}</h4>
                    <p>${data.text}</p>
                `;
                stepsText.style.opacity = '1';
                stepsText.style.transform = 'translateY(0)';
            }, 180);
        }
    }

    stepButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const stepNum = parseInt(btn.getAttribute('data-step') || '1', 10);
            setStep(stepNum);
        });
    });

    // Initialize step 1
    if (stepButtons.length > 0) {
        setStep(1);
    }

    // ----------------------------------------------------
    // 6. INTERACTIVE PROJECT SCOPE & COST ESTIMATOR
    // ----------------------------------------------------
    const platformInputs = document.querySelectorAll('input[name="calc-platform"]');
    const designInputs = document.querySelectorAll('input[name="calc-design"]');
    const featureCheckboxes = document.querySelectorAll('input[name="calc-feature"]');
    const speedInputs = document.querySelectorAll('input[name="calc-speed"]');

    const resultPrice = document.getElementById('calc-price-display');
    const resultTime = document.getElementById('calc-time-display');
    const applyEstimateBtn = document.getElementById('apply-estimate-btn');

    function calculateEstimate() {
        let baseCost = 0;
        let baseWeeks = 0;

        platformInputs.forEach(input => {
            if (input.checked) {
                baseCost += parseFloat(input.getAttribute('data-cost') || '0');
                baseWeeks += parseFloat(input.getAttribute('data-weeks') || '0');
            }
        });

        designInputs.forEach(input => {
            if (input.checked) {
                baseCost += parseFloat(input.getAttribute('data-cost') || '0');
                baseWeeks += parseFloat(input.getAttribute('data-weeks') || '0');
            }
        });

        featureCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                baseCost += parseFloat(checkbox.getAttribute('data-cost') || '0');
                baseWeeks += parseFloat(checkbox.getAttribute('data-weeks') || '0');
            }
        });

        let speedMultiplier = 1;
        speedInputs.forEach(input => {
            if (input.checked) {
                speedMultiplier = parseFloat(input.getAttribute('data-multiplier') || '1');
            }
        });

        let totalCost = Math.round((baseCost * speedMultiplier) / 100) * 100;
        let totalWeeks = Math.max(2, Math.round(baseWeeks / (speedMultiplier > 1 ? 1.4 : 1)));

        const lowPrice = Math.round(totalCost * 0.9);
        const highPrice = Math.round(totalCost * 1.15);

        if (resultPrice) {
            resultPrice.textContent = `$${lowPrice.toLocaleString()} - $${highPrice.toLocaleString()}`;
        }
        if (resultTime) {
            resultTime.textContent = `Approx. ${totalWeeks} - ${totalWeeks + 2} Weeks`;
        }

        return { lowPrice, highPrice, totalWeeks };
    }

    const allCalcInputs = [
        ...platformInputs,
        ...designInputs,
        ...featureCheckboxes,
        ...speedInputs
    ];
    allCalcInputs.forEach(el => el.addEventListener('change', calculateEstimate));
    calculateEstimate();

    if (applyEstimateBtn) {
        applyEstimateBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const est = calculateEstimate();

            const selectedPlatform = document.querySelector('input[name="calc-platform"]:checked');
            const platformLabel = selectedPlatform ? selectedPlatform.parentElement.textContent.trim() : 'Digital Solution';

            const selectedFeatures = [];
            featureCheckboxes.forEach(cb => {
                if (cb.checked) selectedFeatures.push(cb.parentElement.textContent.trim());
            });

            const serviceSelect = document.getElementById('contact-service');
            const messageArea = document.getElementById('contact-message');
            const budgetSelect = document.getElementById('contact-budget');

            if (serviceSelect) {
                if (platformLabel.toLowerCase().includes('web')) serviceSelect.value = 'web';
                else if (platformLabel.toLowerCase().includes('mobile')) serviceSelect.value = 'mobile';
                else if (platformLabel.toLowerCase().includes('cloud') || platformLabel.toLowerCase().includes('ai')) serviceSelect.value = 'cloud-ai';
                else serviceSelect.value = 'software';
            }

            if (budgetSelect) {
                if (est.lowPrice < 5000) budgetSelect.value = '2k-5k';
                else if (est.lowPrice < 15000) budgetSelect.value = '5k-15k';
                else if (est.lowPrice < 30000) budgetSelect.value = '15k-30k';
                else budgetSelect.value = '30k-plus';
            }

            if (messageArea) {
                messageArea.value = `Hi Yatra Team,\n\nI generated an estimate using your calculator:\n• Target Scope: ${platformLabel}\n• Features: ${selectedFeatures.join(', ') || 'Custom Features'}\n• Estimated Budget: $${est.lowPrice.toLocaleString()} - $${est.highPrice.toLocaleString()}\n• Estimated Timeline: ${est.totalWeeks} - ${est.totalWeeks + 2} Weeks\n\nLooking forward to scheduling a technical discovery call.`;
            }

            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
            showToast('Estimate transferred to consultation inquiry form!');
        });
    }

    // ----------------------------------------------------
    // 7. TESTIMONIAL TICKER / CAROUSEL
    // ----------------------------------------------------
    const testimonialCards = document.querySelectorAll('.le-testimonial-card');
    const prevTestimonialBtn = document.getElementById('prev-testimonial');
    const nextTestimonialBtn = document.getElementById('next-testimonial');
    let currentTestimonialIndex = 0;

    function showTestimonial(index) {
        if (!testimonialCards.length) return;
        if (index < 0) index = testimonialCards.length - 1;
        if (index >= testimonialCards.length) index = 0;
        currentTestimonialIndex = index;

        testimonialCards.forEach((card, i) => {
            card.classList.toggle('active', i === currentTestimonialIndex);
        });
    }

    if (nextTestimonialBtn) nextTestimonialBtn.addEventListener('click', () => showTestimonial(currentTestimonialIndex + 1));
    if (prevTestimonialBtn) prevTestimonialBtn.addEventListener('click', () => showTestimonial(currentTestimonialIndex - 1));

    if (testimonialCards.length > 1) {
        setInterval(() => {
            showTestimonial(currentTestimonialIndex + 1);
        }, 7000);
    }

    // ----------------------------------------------------
    // 8. CONTACT FORM VALIDATION & LEAD SUBMISSION
    // ----------------------------------------------------
    const contactForm = document.getElementById('project-contact-form');
    const formFeedback = document.getElementById('form-feedback');
    const submitBtn = document.getElementById('form-submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('contact-name');
            const emailInput = document.getElementById('contact-email');
            const phoneInput = document.getElementById('contact-phone');
            const serviceInput = document.getElementById('contact-service');
            const budgetInput = document.getElementById('contact-budget');
            const messageInput = document.getElementById('contact-message');

            let isValid = true;
            document.querySelectorAll('.form-group').forEach(grp => grp.classList.remove('has-error'));

            function markError(input, msg) {
                isValid = false;
                const grp = input.closest('.form-group');
                if (grp) {
                    grp.classList.add('has-error');
                    let err = grp.querySelector('.error-message');
                    if (!err) {
                        err = document.createElement('span');
                        err = document.createElement('span');
                        err.className = 'error-message';
                        grp.appendChild(err);
                    }
                    err.textContent = msg;
                }
            }

            if (!nameInput.value.trim()) markError(nameInput, 'Please provide your full name');
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput.value.trim() || !emailPattern.test(emailInput.value.trim())) {
                markError(emailInput, 'Please provide a valid email address');
            }
            if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
                markError(messageInput, 'Please enter at least 10 characters about your project');
            }

            if (!isValid) {
                showToast('Please complete all required fields.', 'error');
                return;
            }

            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <i class="fas fa-spinner fa-spin" style="margin-right: 8px;"></i>
                Submitting Inquiry...
            `;

            const payload = {
                id: 'YATRA-' + Math.floor(100000 + Math.random() * 900000),
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                phone: phoneInput ? phoneInput.value.trim() : '',
                service: serviceInput ? serviceInput.value : '',
                budget: budgetInput ? budgetInput.value : '',
                message: messageInput.value.trim(),
                date: new Date().toISOString()
            };

            setTimeout(() => {
                try {
                    const existing = JSON.parse(localStorage.getItem('yatra_leads') || '[]');
                    existing.push(payload);
                    localStorage.setItem('yatra_leads', JSON.stringify(existing));
                } catch (err) {
                    console.warn(err);
                }

                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;

                if (formFeedback) {
                    formFeedback.className = 'form-feedback success active';
                    formFeedback.innerHTML = `
                        <div class="feedback-icon"><i class="fas fa-check"></i></div>
                        <div class="feedback-text">
                            <h4>Inquiry Successfully Received!</h4>
                            <p>Thank you <strong>${escapeHtml(payload.name)}</strong>. Reference ID: <code>${payload.id}</code>. Our engineering leads will review your project and email you at <strong>${escapeHtml(payload.email)}</strong> within 24 hours.</p>
                        </div>
                    `;
                    formFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }

                contactForm.reset();
                showToast(`Inquiry received! Ref: ${payload.id}`, 'success');
            }, 1100);
        });
    }

    // ----------------------------------------------------
    // 9. NEWSLETTER SUBSCRIPTION
    // ----------------------------------------------------
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = document.getElementById('newsletter-email');
            if (input && input.value.trim()) {
                showToast('Thank you for subscribing to Yatra Tech briefings!', 'success');
                input.value = '';
            }
        });
    }

    // ----------------------------------------------------
    // 10. TOAST NOTIFICATION SYSTEM
    // ----------------------------------------------------
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }

    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast-message toast-${type}`;
        toast.innerHTML = `
            <span class="toast-indicator"></span>
            <span class="toast-content">${escapeHtml(message)}</span>
        `;
        toastContainer.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentElement) toast.parentElement.removeChild(toast);
            }, 300);
        }, 3600);
    }

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    window.yatraToast = showToast;
});
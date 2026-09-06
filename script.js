/**
 * Yatra Technologies - Interactive Website Engine
 * Core JavaScript: Theme switcher, Mobile Drawer, Cost Estimator,
 * Portfolio Filters, Modals, FAQ Accordion, Testimonial Slider,
 * Form Validation, and Toast Notification System.
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
        link.addEventListener('click', () => {
            closeDrawer();
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeDrawer();
            closeModal();
        }
    });

    // ----------------------------------------------------
    // 3. SCROLLSPY & HEADER ENHANCEMENT
    // ----------------------------------------------------
    const header = document.querySelector('.header');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    const backToTopBtn = document.getElementById('back-to-top');

    function handleScroll() {
        const scrollY = window.pageYOffset;

        // Header glass styling on scroll
        if (header) {
            if (scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        // Back to top visibility
        if (backToTopBtn) {
            if (scrollY > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }

        // Scrollspy for active link
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
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
    // 4. ANIMATED STATS COUNTER
    // ----------------------------------------------------
    const statElements = document.querySelectorAll('.stat-number');
    let statsAnimated = false;

    function animateCounters() {
        statElements.forEach(stat => {
            const target = parseFloat(stat.getAttribute('data-target') || '0');
            const suffix = stat.getAttribute('data-suffix') || '';
            const isDecimal = target % 1 !== 0;
            const duration = 1800; // ms
            const startTime = performance.now();

            function updateCounter(now) {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // easeOutExpo
                const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                const currentVal = ease * target;

                stat.textContent = isDecimal ? currentVal.toFixed(1) + suffix : Math.floor(currentVal) + suffix;

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.textContent = (isDecimal ? target.toFixed(1) : target) + suffix;
                }
            }

            requestAnimationFrame(updateCounter);
        });
    }

    const statsSection = document.querySelector('.about-stat') || document.querySelector('.stats-container');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !statsAnimated) {
                    statsAnimated = true;
                    animateCounters();
                }
            });
        }, { threshold: 0.3 });

        statsObserver.observe(statsSection);
    }

    // ----------------------------------------------------
    // 5. INTERACTIVE PROJECT COST ESTIMATOR
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

        // Platform Selection
        platformInputs.forEach(input => {
            if (input.checked) {
                baseCost += parseFloat(input.getAttribute('data-cost') || '0');
                baseWeeks += parseFloat(input.getAttribute('data-weeks') || '0');
            }
        });

        // Design Selection
        designInputs.forEach(input => {
            if (input.checked) {
                baseCost += parseFloat(input.getAttribute('data-cost') || '0');
                baseWeeks += parseFloat(input.getAttribute('data-weeks') || '0');
            }
        });

        // Feature Checkboxes
        let featureCount = 0;
        featureCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                baseCost += parseFloat(checkbox.getAttribute('data-cost') || '0');
                baseWeeks += parseFloat(checkbox.getAttribute('data-weeks') || '0');
                featureCount++;
            }
        });

        // Delivery Pace Multiplier
        let speedMultiplier = 1;
        speedInputs.forEach(input => {
            if (input.checked) {
                speedMultiplier = parseFloat(input.getAttribute('data-multiplier') || '1');
            }
        });

        let totalCost = Math.round((baseCost * speedMultiplier) / 100) * 100;
        let totalWeeks = Math.max(2, Math.round(baseWeeks / (speedMultiplier > 1 ? 1.4 : 1)));

        // Range representation
        const lowPrice = Math.round(totalCost * 0.9);
        const highPrice = Math.round(totalCost * 1.15);

        if (resultPrice) {
            resultPrice.textContent = `$${lowPrice.toLocaleString()} - $${highPrice.toLocaleString()}`;
        }
        if (resultTime) {
            resultTime.textContent = `Approx. ${totalWeeks} - ${totalWeeks + 2} Weeks`;
        }

        return {
            lowPrice,
            highPrice,
            totalWeeks,
            featureCount
        };
    }

    const allCalcInputs = [
        ...platformInputs,
        ...designInputs,
        ...featureCheckboxes,
        ...speedInputs
    ];

    allCalcInputs.forEach(el => {
        el.addEventListener('change', calculateEstimate);
    });

    // Run once initially
    calculateEstimate();

    // Auto-fill into Contact Form
    if (applyEstimateBtn) {
        applyEstimateBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const est = calculateEstimate();

            // Selected platform
            const selectedPlatform = document.querySelector('input[name="calc-platform"]:checked');
            const platformLabel = selectedPlatform ? selectedPlatform.parentElement.textContent.trim() : 'Digital Solution';

            // Selected features
            const selectedFeatures = [];
            featureCheckboxes.forEach(cb => {
                if (cb.checked) {
                    selectedFeatures.push(cb.parentElement.textContent.trim());
                }
            });

            // Populate form fields
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
                messageArea.value = `Hi Yatra Team,\n\nI generated a project estimate using your calculator:\n• Scope: ${platformLabel}\n• Key Features: ${selectedFeatures.join(', ') || 'Custom Requirements'}\n• Estimated Budget: $${est.lowPrice.toLocaleString()} - $${est.highPrice.toLocaleString()}\n• Estimated Timeline: ${est.totalWeeks} - ${est.totalWeeks + 2} Weeks\n\nLooking forward to discussing this project in detail.`;
            }

            // Smooth scroll to contact
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }

            showToast('Estimate transferred to inquiry form!');
        });
    }

    // ----------------------------------------------------
    // 6. PORTFOLIO FILTER & CASE STUDIES
    // ----------------------------------------------------
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter') || 'all';

            portfolioCards.forEach(card => {
                const category = card.getAttribute('data-category') || '';
                if (filterValue === 'all' || category.includes(filterValue)) {
                    card.classList.remove('hidden');
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px)';
                    setTimeout(() => {
                        card.classList.add('hidden');
                    }, 250);
                }
            });
        });
    });

    // ----------------------------------------------------
    // 7. PROJECT / CASE STUDY MODAL
    // ----------------------------------------------------
    const modal = document.getElementById('case-study-modal');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalTitle = document.getElementById('modal-title');
    const modalCategory = document.getElementById('modal-category');
    const modalChallenge = document.getElementById('modal-challenge');
    const modalSolution = document.getElementById('modal-solution');
    const modalImpact = document.getElementById('modal-impact');
    const modalStack = document.getElementById('modal-stack');

    const projectData = {
        'finflow': {
            title: 'FinFlow — Cloud Financial Intelligence Platform',
            category: 'Web Application / Cloud SaaS',
            challenge: 'Enterprise finance teams needed real-time automated reconciliation, currency risk tracking, and compliance audits across 8 global subsidiaries with zero latency.',
            solution: 'Engineered a multi-tenant web platform utilizing Next.js, Node.js microservices, PostgreSQL with connection pooling, and automated background transaction pipelines.',
            impact: 'Reduced monthly reconciliation time by 74%, automated audit logging for SOC2 compliance, and securely handled $45M+ in monthly transaction indexing.',
            stack: ['Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS ECS']
        },
        'logitrack': {
            title: 'LogiTrack — Smart Fleet Telematics & Route Optimization',
            category: 'Cross-Platform Mobile App & IoT',
            challenge: 'A regional logistics carrier suffered from fuel wastage, disconnected drivers, and lack of real-time geofence tracking for 180+ transport vehicles.',
            solution: 'Developed a high-performance Flutter mobile application paired with an event-driven Go backend, WebSockets for live GPS telemetry, and offline sync for remote zones.',
            impact: 'Decreased average transit delay by 28%, saved ~19% in monthly fleet fuel consumption, and achieved a 4.9-star driver satisfaction rating.',
            stack: ['Flutter', 'Dart', 'Go (Golang)', 'Redis', 'WebSockets', 'Google Maps API']
        },
        'healthbridge': {
            title: 'HealthBridge — Telemedicine & Secure Patient Care Portal',
            category: 'Healthcare Web & Mobile',
            challenge: 'Healthcare providers required a HIPAA-compliant portal enabling secure HD video consultations, digital prescription dispatch, and electronic health record integration.',
            solution: 'Architected an end-to-end encrypted telehealth portal with WebRTC video, biometric authentication, and FHIR standard compliant database connectors.',
            impact: 'Facilitated 12,000+ virtual appointments in first quarter, reduced patient waiting room times from 45 min to under 3 min.',
            stack: ['React', 'WebRTC', 'Python FastAPI', 'PostgreSQL', 'Docker', 'AWS HIPAA-Compliant VPC']
        },
        'insightai': {
            title: 'InsightAI — Document Intelligence & Semantic Knowledge Hub',
            category: 'Artificial Intelligence / NLP',
            challenge: 'Legal and technical analysts were spending 15+ hours weekly manually reviewing 100+ page contracts and technical manuals to extract compliance clauses.',
            solution: 'Deployed a custom Retrieval-Augmented Generation (RAG) pipeline with semantic vector search, high-accuracy OCR extraction, and an intuitive audit interface.',
            impact: '91% acceleration in contract review turnaround, 99.2% extraction precision, and direct integration with existing corporate drive storage.',
            stack: ['Python', 'LangChain', 'FastAPI', 'Qdrant Vector DB', 'React', 'Docker']
        },
        'swiftcommerce': {
            title: 'SwiftCommerce — Headless E-Commerce with Edge Delivery',
            category: 'Modern Web / Headless E-Commerce',
            challenge: 'Legacy e-commerce store suffered from sluggish 4.2-second mobile load times, high cart abandonment, and poor mobile conversion rates during flash sales.',
            solution: 'Rebuilt the frontend as a headless Progressive Web App (PWA) with Edge caching, dynamic product recommendations, and frictionless one-click checkout.',
            impact: 'Sub-800ms average page loads worldwide, 41% jump in mobile conversions, and seamless zero-downtime scaling through Black Friday peak traffic.',
            stack: ['Next.js 14', 'Tailwind CSS', 'Stripe API', 'Shopify Storefront API', 'Cloudflare Edge']
        },
        'nexuserp': {
            title: 'Nexus ERP — Scalable Enterprise Operations Engine',
            category: 'Custom Software & Enterprise ERP',
            challenge: 'Manufacturing enterprise with 5 warehouses struggled with desynchronized inventories, manual purchase orders, and lack of real-time production analytics.',
            solution: 'Constructed a unified, modular ERP platform with automated barcode scanning, multi-warehouse inventory dispatch, and executive real-time dashboards.',
            impact: 'Eliminated stockout errors by 88%, automated purchase orders across 45 suppliers, and enabled real-time gross margin forecasting.',
            stack: ['React', 'Python Django', 'Celery', 'PostgreSQL', 'Redis', 'Kubernetes']
        }
    };

    function openModal(projectId) {
        const data = projectData[projectId];
        if (!data || !modal) return;

        if (modalTitle) modalTitle.textContent = data.title;
        if (modalCategory) modalCategory.textContent = data.category;
        if (modalChallenge) modalChallenge.textContent = data.challenge;
        if (modalSolution) modalSolution.textContent = data.solution;
        if (modalImpact) modalImpact.textContent = data.impact;

        if (modalStack) {
            modalStack.innerHTML = data.stack.map(s => `<span class="tech-tag">${s}</span>`).join('');
        }

        modal.classList.add('active');
        if (modalBackdrop) modalBackdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('active');
        if (modalBackdrop) modalBackdrop.classList.remove('active');
        document.body.style.overflow = '';
    }

    document.querySelectorAll('.open-modal-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const projectId = btn.getAttribute('data-project');
            if (projectId) openModal(projectId);
        });
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

    // ----------------------------------------------------
    // 8. INTERACTIVE FAQ ACCORDION
    // ----------------------------------------------------
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        if (!questionBtn) return;

        questionBtn.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');

            // Close all others
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherBtn = otherItem.querySelector('.faq-question');
                    if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle current
            if (isOpen) {
                item.classList.remove('active');
                questionBtn.setAttribute('aria-expanded', 'false');
            } else {
                item.classList.add('active');
                questionBtn.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // ----------------------------------------------------
    // 9. TESTIMONIAL CAROUSEL
    // ----------------------------------------------------
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevTestimonialBtn = document.getElementById('prev-testimonial');
    const nextTestimonialBtn = document.getElementById('next-testimonial');
    const testimonialDots = document.querySelectorAll('.testimonial-dot');
    let currentTestimonialIndex = 0;
    let testimonialTimer = null;

    function showTestimonial(index) {
        if (!testimonialCards.length) return;

        if (index < 0) index = testimonialCards.length - 1;
        if (index >= testimonialCards.length) index = 0;
        currentTestimonialIndex = index;

        testimonialCards.forEach((card, i) => {
            card.classList.toggle('active', i === currentTestimonialIndex);
        });

        testimonialDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentTestimonialIndex);
        });
    }

    function nextTestimonial() {
        showTestimonial(currentTestimonialIndex + 1);
    }

    function prevTestimonial() {
        showTestimonial(currentTestimonialIndex - 1);
    }

    if (nextTestimonialBtn) nextTestimonialBtn.addEventListener('click', () => {
        nextTestimonial();
        resetTestimonialTimer();
    });

    if (prevTestimonialBtn) prevTestimonialBtn.addEventListener('click', () => {
        prevTestimonial();
        resetTestimonialTimer();
    });

    testimonialDots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            showTestimonial(i);
            resetTestimonialTimer();
        });
    });

    function startTestimonialTimer() {
        testimonialTimer = setInterval(nextTestimonial, 6000);
    }

    function resetTestimonialTimer() {
        clearInterval(testimonialTimer);
        startTestimonialTimer();
    }

    if (testimonialCards.length > 1) {
        startTestimonialTimer();
    }

    // ----------------------------------------------------
    // 10. CONTACT FORM VALIDATION & SUBMISSION
    // ----------------------------------------------------
    const contactForm = document.getElementById('project-contact-form');
    const formFeedback = document.getElementById('form-feedback');
    const submitBtn = document.getElementById('form-submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Form Fields
            const nameInput = document.getElementById('contact-name');
            const emailInput = document.getElementById('contact-email');
            const phoneInput = document.getElementById('contact-phone');
            const serviceInput = document.getElementById('contact-service');
            const budgetInput = document.getElementById('contact-budget');
            const timelineInput = document.getElementById('contact-timeline');
            const messageInput = document.getElementById('contact-message');

            let isValid = true;

            // Reset error styles
            document.querySelectorAll('.form-group').forEach(grp => grp.classList.remove('has-error'));

            function markError(input, msg) {
                isValid = false;
                const grp = input.closest('.form-group');
                if (grp) {
                    grp.classList.add('has-error');
                    let errEl = grp.querySelector('.error-message');
                    if (!errEl) {
                        errEl = document.createElement('span');
                        errEl.className = 'error-message';
                        grp.appendChild(errEl);
                    }
                    errEl.textContent = msg;
                }
            }

            if (!nameInput.value.trim()) {
                markError(nameInput, 'Please provide your full name');
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput.value.trim()) {
                markError(emailInput, 'Please provide your email address');
            } else if (!emailPattern.test(emailInput.value.trim())) {
                markError(emailInput, 'Please enter a valid email address');
            }

            if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
                markError(messageInput, 'Please write at least 10 characters describing your project');
            }

            if (!isValid) {
                showToast('Please correct highlighted fields before submitting.', 'error');
                return;
            }

            // Simulate submission state
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <svg class="spinner" width="18" height="18" viewBox="0 0 50 50">
                    <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="5"></circle>
                </svg> Sending Inquiry...
            `;

            const inquiryPayload = {
                id: 'YATRA-' + Math.floor(100000 + Math.random() * 900000),
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                phone: phoneInput ? phoneInput.value.trim() : '',
                service: serviceInput ? serviceInput.value : '',
                budget: budgetInput ? budgetInput.value : '',
                timeline: timelineInput ? timelineInput.value : '',
                message: messageInput.value.trim(),
                submittedAt: new Date().toISOString()
            };

            setTimeout(() => {
                // Save to localStorage for safety / offline lead recovery
                try {
                    const existing = JSON.parse(localStorage.getItem('yatra_inquiries') || '[]');
                    existing.push(inquiryPayload);
                    localStorage.setItem('yatra_inquiries', JSON.stringify(existing));
                } catch (err) {
                    console.warn('Could not store inquiry in local storage:', err);
                }

                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;

                // Show success container
                if (formFeedback) {
                    formFeedback.className = 'form-feedback success active';
                    formFeedback.innerHTML = `
                        <div class="feedback-icon">✓</div>
                        <div class="feedback-text">
                            <h4>Inquiry Successfully Received!</h4>
                            <p>Thank you <strong>${escapeHtml(inquiryPayload.name)}</strong>. Reference ID: <code>${inquiryPayload.id}</code>. Our technology team will review your requirements and respond to <strong>${escapeHtml(inquiryPayload.email)}</strong> within 24 hours.</p>
                        </div>
                    `;
                }

                contactForm.reset();
                showToast('Inquiry sent successfully! Ref: ' + inquiryPayload.id, 'success');

                // Smooth scroll to feedback message
                if (formFeedback) {
                    formFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }, 1200);
        });
    }

    // ----------------------------------------------------
    // 11. NEWSLETTER SUBSCRIPTION
    // ----------------------------------------------------
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = document.getElementById('newsletter-email');
            if (input && input.value.trim()) {
                showToast('Subscribed! Welcome to Yatra Tech briefings.', 'success');
                input.value = '';
            }
        });
    }

    // ----------------------------------------------------
    // 12. COPY EMAIL ACTION
    // ----------------------------------------------------
    const copyEmailButtons = document.querySelectorAll('.copy-email-btn');
    copyEmailButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const email = btn.getAttribute('data-email') || 'hello@yatratechnologies.com';
            navigator.clipboard.writeText(email).then(() => {
                showToast(`Copied ${email} to clipboard!`, 'success');
            }).catch(() => {
                showToast(`Email: ${email}`);
            });
        });
    });

    // ----------------------------------------------------
    // 13. TOAST NOTIFICATION SYSTEM
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
        }, 3500);
    }

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // Expose showToast globally if needed
    window.yatraToast = showToast;
});
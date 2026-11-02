/* ============================================================
   GADGETGEEKS BY LIBERTY M — MAIN JAVASCRIPT
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // =====================================================
    // 1. MOBILE NAVIGATION MENU TOGGLE
    // =====================================================
    const header = document.querySelector('header');
    const nav = document.querySelector('nav');

    if (header && nav) {
        // Create hamburger button
        const menuBtn = document.createElement('button');
        menuBtn.className = 'menu-toggle';
        menuBtn.innerHTML = '☰';
        menuBtn.setAttribute('aria-label', 'Toggle navigation menu');
        menuBtn.style.cssText = `
            display: none;
            background: none;
            border: none;
            color: #fff;
            font-size: 1.8rem;
            cursor: pointer;
            padding: 0.5rem;
        `;
        header.querySelector('div').prepend(menuBtn);

        // Show hamburger on mobile
        const toggleBtnVisibility = () => {
            if (window.innerWidth <= 768) {
                menuBtn.style.display = 'block';
                nav.style.display = nav.classList.contains('open') ? 'block' : 'none';
            } else {
                menuBtn.style.display = 'none';
                nav.style.display = 'block';
                nav.classList.remove('open');
            }
        };

        menuBtn.addEventListener('click', () => {
            nav.classList.toggle('open');
            nav.style.display = nav.classList.contains('open') ? 'block' : 'none';
            menuBtn.innerHTML = nav.classList.contains('open') ? '✕' : '☰';
        });

        toggleBtnVisibility();
        window.addEventListener('resize', toggleBtnVisibility);
    }

    // =====================================================
    // 2. HIGHLIGHT ACTIVE NAV LINK
    // =====================================================
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
    });

    // =====================================================
    // 3. SMOOTH SCROLL FOR ANCHOR LINKS (products.html)
    // =====================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // =====================================================
    // 4. SHOPPING CART SYSTEM
    // =====================================================
    let cart = JSON.parse(localStorage.getItem('gadgetGeeksCart')) || [];
    updateCartCount();

    // Add to Cart Buttons
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function () {
            const card = this.closest('.product-card');
            const name = card.querySelector('h3').innerText;
            const priceText = card.querySelector('.price').innerText;
            const price = parseFloat(priceText.replace(/[^\d.]/g, ''));

            // Check if product already in cart
            const existing = cart.find(item => item.name === name);
            if (existing) {
                existing.qty += 1;
            } else {
                cart.push({ name, price, qty: 1 });
            }

            localStorage.setItem('gadgetGeeksCart', JSON.stringify(cart));
            updateCartCount();
            showToast(`✅ ${name} added to cart!`);
            this.innerText = 'Added!';
            setTimeout(() => { this.innerText = 'Add to Cart'; }, 1200);
        });
    });

    function updateCartCount() {
        const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
        let cartBadge = document.getElementById('cart-count');
        if (!cartBadge) {
            cartBadge = document.createElement('span');
            cartBadge.id = 'cart-count';
            cartBadge.style.cssText = `
                display: inline-block;
                background: #00cec9;
                color: #0a0a1a;
                font-size: 0.7rem;
                font-weight: 700;
                padding: 2px 7px;
                border-radius: 50px;
                margin-left: 6px;
                vertical-align: super;
            `;
            const navUl = document.querySelector('nav ul');
            if (navUl) {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = '#';
                a.id = 'cart-link';
                a.innerText = '🛒';
                a.appendChild(cartBadge);
                li.appendChild(a);
                navUl.appendChild(li);
            }
        }
        cartBadge.innerText = totalQty;
        cartBadge.style.display = totalQty > 0 ? 'inline-block' : 'none';
    }

    // =====================================================
    // 5. TOAST NOTIFICATION SYSTEM
    // =====================================================
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerText = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: ${type === 'success' ? '#00b894' : '#ff6b6b'};
            color: #fff;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            font-weight: 600;
            z-index: 9999;
            box-shadow: 0 8px 25px rgba(0,0,0,0.4);
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease;
            font-family: inherit;
        `;
        document.body.appendChild(toast);
        setTimeout(() => { toast.style.opacity = '1'; toast.style.transform = 'translateY(0)'; }, 50);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // =====================================================
    // 6. ENQUIRY FORM VALIDATION
    // =====================================================
    const enquiryForm = document.querySelector('form');
    if (enquiryForm) {
        enquiryForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const enquiryType = document.getElementById('enquiry-type');
            const message = document.getElementById('message');

            let errors = [];

            // Clear old errors
            document.querySelectorAll('.form-error').forEach(el => el.remove());
            document.querySelectorAll('input, select, textarea').forEach(el => {
                el.style.borderColor = '';
            });

            // Validate Name
            if (!name.value.trim() || name.value.trim().length < 2) {
                showFieldError(name, 'Please enter your full name');
                errors.push('name');
            }

            // Validate Email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value.trim())) {
                showFieldError(email, 'Please enter a valid email address');
                errors.push('email');
            }

            // Validate Enquiry Type
            if (!enquiryType.value) {
                showFieldError(enquiryType, 'Please select an enquiry type');
                errors.push('enquiryType');
            }

            // Validate Message
            if (!message.value.trim() || message.value.trim().length < 10) {
                showFieldError(message, 'Message must be at least 10 characters');
                errors.push('message');
            }

            if (errors.length > 0) {
                showToast('⚠️ Please fix the highlighted fields', 'error');
                return;
            }

            // Simulate successful submission
            const submitBtn = enquiryForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'Sending...';
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.innerText = '✓ Enquiry Sent!';
                submitBtn.style.background = 'linear-gradient(135deg, #00b894, #00cec9)';
                showToast('🎉 Thank you! We will respond within 24 hours.');

                setTimeout(() => {
                    enquiryForm.reset();
                    submitBtn.innerText = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 2500);
            }, 1200);
        });
    }

    function showFieldError(field, message) {
        field.style.borderColor = '#ff6b6b';
        const error = document.createElement('small');
        error.className = 'form-error';
        error.style.cssText = 'color: #ff6b6b; font-size: 0.8rem; display: block; margin-top: 0.25rem;';
        error.innerText = message;
        field.parentElement.appendChild(error);
    }

    // =====================================================
    // 7. BACK TO TOP BUTTON
    // =====================================================
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '↑';
    backToTop.setAttribute('aria-label', 'Back to top');
    backToTop.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #6c5ce7, #00cec9);
        color: #fff;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 999;
        box-shadow: 0 4px 15px rgba(108,92,231,0.4);
    `;
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // =====================================================
    // 8. SCROLL REVEAL ANIMATION
    // =====================================================
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealObserver.observe(section);
    });

    // =====================================================
    // 9. LIVE CHAT SIMULATOR (Enquiry Page)
    // =====================================================
    const liveChatBtn = document.querySelector('.enquiry-method:last-child');
    if (liveChatBtn) {
        liveChatBtn.style.cursor = 'pointer';
        liveChatBtn.addEventListener('click', () => {
            showToast('💬 Live chat opening soon! Call +27 82 123 4567 for now.');
        });
    }

    // =====================================================
    // 10. PRODUCT SEARCH (Products Page)
    // =====================================================
    const productGrid = document.querySelector('.product-grid');
    if (productGrid) {
        const searchBar = document.createElement('div');
        searchBar.style.cssText = 'max-width: 500px; margin: 0 auto 2rem;';
        searchBar.innerHTML = `
            <input type="text" id="product-search" placeholder="🔍 Search products..." 
                style="width: 100%; padding: 0.85rem 1rem; background: #12122a; 
                border: 1px solid rgba(108,92,231,0.3); border-radius: 8px; 
                color: #fff; font-size: 0.95rem; outline: none;">
        `;
        productGrid.parentElement.insertBefore(searchBar, productGrid);

        const searchInput = document.getElementById('product-search');
        searchInput.addEventListener('input', function () {
            const term = this.value.toLowerCase();
            document.querySelectorAll('.product-card').forEach(card => {
                const title = card.querySelector('h3').innerText.toLowerCase();
                const desc = card.querySelector('.product-desc')?.innerText.toLowerCase() || '';
                card.style.display = (title.includes(term) || desc.includes(term)) ? 'flex' : 'none';
            });
        });
    }

});
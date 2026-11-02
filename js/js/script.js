
 /* ============================================================
   GADGETGEEKS BY LIBERTY M — MAIN JAVASCRIPT
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // =====================================================
    // 1. MOBILE NAVIGATION MENU
    // =====================================================
    const header = document.querySelector('header');
    const nav = document.querySelector('nav');
    if (header && nav) {
        const menuBtn = document.createElement('button');
        menuBtn.className = 'menu-toggle';
        menuBtn.innerHTML = 'Menu'; // Replaced hamburger icon
        menuBtn.style.cssText = `display: none; background: none; border: none; color: #fff; font-size: 1rem; font-weight: bold; cursor: pointer; padding: 0.5rem;`;
        header.querySelector('div').prepend(menuBtn);

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
            menuBtn.innerHTML = nav.classList.contains('open') ? 'Close' : 'Menu';
        });
        toggleBtnVisibility();
        window.addEventListener('resize', toggleBtnVisibility);
    }

    // =====================================================
    // 2. SMOOTH SCROLL & ACTIVE LINK
    // =====================================================
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav a').forEach(link => {
        if (link.getAttribute('href') === currentPage) link.classList.add('active');
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // =====================================================
    // 3. TOAST NOTIFICATIONS
    // =====================================================
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.innerText = message;
        toast.style.cssText = `position: fixed; bottom: 30px; right: 30px; background: ${type === 'success' ? '#00b894' : '#ff6b6b'}; color: #fff; padding: 1rem 1.5rem; border-radius: 8px; font-weight: 600; z-index: 9999; box-shadow: 0 8px 25px rgba(0,0,0,0.4); opacity: 0; transform: translateY(20px); transition: all 0.3s ease; font-family: inherit;`;
        document.body.appendChild(toast);
        setTimeout(() => { toast.style.opacity = '1'; toast.style.transform = 'translateY(0)'; }, 50);
        setTimeout(() => { 
            toast.style.opacity = '0'; 
            toast.style.transform = 'translateY(20px)'; 
            setTimeout(() => toast.remove(), 300); 
        }, 3000);
    }

    // =====================================================
    // 4. SHOPPING CART & PRODUCT SEARCH (Products Page)
    // =====================================================
    let cart = JSON.parse(localStorage.getItem('gadgetGeeksCart')) || [];
    
    function updateCartCount() {
        let cartBadge = document.getElementById('cart-count');
        if (!cartBadge) {
            cartBadge = document.createElement('span');
            cartBadge.id = 'cart-count';
            cartBadge.style.cssText = `display: inline-block; background: #00cec9; color: #0a0a1a; font-size: 0.7rem; font-weight: 700; padding: 2px 7px; border-radius: 50px; margin-left: 6px; vertical-align: super;`;
            const navUl = document.querySelector('nav ul');
            if (navUl) {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = '#'; 
                a.innerText = 'Cart'; // Replaced cart icon
                a.appendChild(cartBadge);
                li.appendChild(a); 
                navUl.appendChild(li);
            }
        }
        cartBadge.innerText = cart.reduce((sum, item) => sum + item.qty, 0);
        cartBadge.style.display = cartBadge.innerText > 0 ? 'inline-block' : 'none';
    }
    updateCartCount();

    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function () {
            const card = this.closest('.product-card');
            const name = card.querySelector('h3').innerText;
            const price = parseFloat(card.querySelector('.price').innerText.replace(/[^\d.]/g, ''));
            
            const existing = cart.find(item => item.name === name);
            if (existing) {
                existing.qty += 1;
            } else {
                cart.push({ name, price, qty: 1 });
            }
            
            localStorage.setItem('gadgetGeeksCart', JSON.stringify(cart));
            updateCartCount();
            showToast(`${name} added to cart!`); // Removed checkmark
            this.innerText = 'Added!';
            setTimeout(() => { this.innerText = 'Add to Cart'; }, 1200);
        });
    });

    const productGrid = document.querySelector('.product-grid');
    if (productGrid) {
        const searchBar = document.createElement('div');
        searchBar.style.cssText = 'max-width: 500px; margin: 0 auto 2rem;';
        searchBar.innerHTML = `<input type="text" id="product-search" placeholder="Search products..." style="width: 100%; padding: 0.85rem 1rem; background: #12122a; border: 1px solid rgba(108,92,231,0.3); border-radius: 8px; color: #fff; font-size: 0.95rem; outline: none;">`; // Removed magnifying glass
        productGrid.parentElement.insertBefore(searchBar, productGrid);
        
        document.getElementById('product-search').addEventListener('input', function () {
            const term = this.value.toLowerCase();
            document.querySelectorAll('.product-card').forEach(card => {
                const title = card.querySelector('h3').innerText.toLowerCase();
                const desc = card.querySelector('.product-desc')?.innerText.toLowerCase() || '';
                card.style.display = (title.includes(term) || desc.includes(term)) ? 'flex' : 'none';
            });
        });
    }

    // =====================================================
    // 5. LIGHTBOX GALLERY (Products Page)
    // =====================================================
    document.querySelectorAll('.product-image img').forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', function () {
            const overlay = document.createElement('div');
            overlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(10,10,26,0.95); z-index:9999; display:flex; justify-content:center; align-items:center; cursor:zoom-out;';
            const largeImg = document.createElement('img');
            largeImg.src = this.src;
            largeImg.style.cssText = 'max-width:90%; max-height:90%; border-radius:12px; box-shadow:0 0 30px rgba(108,92,231,0.5);';
            overlay.appendChild(largeImg);
            document.body.appendChild(overlay);
            overlay.addEventListener('click', () => overlay.remove());
        });
    });

    // =====================================================
    // 6. ACCORDION (About Page)
    // =====================================================
    document.querySelectorAll('.accordion-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.toggle('active');
            const content = this.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
                this.innerHTML = this.innerHTML.replace('-', '+'); // Changed to standard minus/plus
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
                this.innerHTML = this.innerHTML.replace('+', '-');
            }
        });
    });

    // =====================================================
    // 7. AJAX FORM SUBMISSION & VALIDATION (Enquiry & Contact)
    // =====================================================
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault(); // Stop page reload (AJAX)

            // Clear old errors
            document.querySelectorAll('.form-error').forEach(el => el.remove());
            document.querySelectorAll('input, select, textarea').forEach(el => el.style.borderColor = '');

            // Validation logic
            const name = form.querySelector('input[type="text"]');
            const email = form.querySelector('input[type="email"]');
            const message = form.querySelector('textarea');
            let hasError = false;

            if (name && name.value.trim().length < 2) {
                name.style.borderColor = '#ff6b6b';
                hasError = true;
            }
            if (email && !email.value.includes('@')) {
                email.style.borderColor = '#ff6b6b';
                hasError = true;
            }
            if (message && message.value.trim().length < 5) {
                message.style.borderColor = '#ff6b6b';
                hasError = true;
            }

            if (hasError) {
                showToast('Please fill in all required fields correctly.', 'error'); // Removed warning icon
                return;
            }

            // AJAX Submission
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'Sending...';
            submitBtn.disabled = true;

            const data = Object.fromEntries(new FormData(form).entries());

            fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            .then(response => {
                if(response.ok) {
                    showToast('Message sent successfully!'); // Removed party icon
                    form.reset();
                } else {
                    showToast('Failed to send message.', 'error'); // Removed cross icon
                }
            })
            .catch(() => showToast('Network error occurred.', 'error'))
            .finally(() => {
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            });
        });
    });

    // =====================================================
    // 8. BACK TO TOP BUTTON
    // =====================================================
    const backToTop = document.createElement('button');
    backToTop.innerHTML = 'Top'; // Replaced arrow icon
    backToTop.setAttribute('aria-label', 'Back to top');
    backToTop.style.cssText = `position: fixed; bottom: 30px; left: 30px; width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, #6c5ce7, #00cec9); color: #fff; border: none; font-size: 0.9rem; font-weight: bold; cursor: pointer; opacity: 0; visibility: hidden; transition: all 0.3s ease; z-index: 999; box-shadow: 0 4px 15px rgba(108,92,231,0.4);`;
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
    
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // =====================================================
    // 9. SCROLL REVEAL ANIMATION
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

});
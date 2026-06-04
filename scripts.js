const products = [
            {
                id: 1,
                name: "Essential Oversized Tee",
                category: "T-Shirt",
                price: 329.00,
                image: "https://cdn-images.farfetch-contents.com/32/37/63/66/32376366_63218670_1000.jpg"
            },
            {
                id: 2,
                name: "Void Bomber Jacket",
                category: "Jacket",
                price: 899.00,
                image: "https://cdn-images.farfetch-contents.com/34/22/82/33/34228233_65370221_1000.jpg"
            },
            {
                id: 3,
                name: "Cargo Pants Black",
                category: "Bottoms",
                price: 549.00,
                image: "https://cdn-images.farfetch-contents.com/33/19/20/40/33192040_63844485_1000.jpg"
            },
            {
                id: 4,
                name: " Old Skool 36",
                category: "Shoes",
                price: 499.00,
                image: "https://cdn-images.farfetch-contents.com/35/74/32/32/35743232_67372221_1000.jpg"
            },
            {
                id: 5,
                name: "Graphic Box Logo Tee",
                category: "Jacket",
                price: 379.00,
                image: "https://cdn-images.farfetch-contents.com/20/54/31/32/20543132_50546592_1000.jpg"
            },
            {
                id: 6,
                name: "Tech Cargo Shorts",
                category: "Bottoms",
                price: 399.00,
                image: "https://cdn-images.farfetch-contents.com/33/15/40/69/33154069_63624487_1000.jpg"
            },
            {
                id: 7,
                name: "Minimalist Cap",
                category: "Accessories",
                price: 189.00,
                image: "https://cdn-images.farfetch-contents.com/34/79/39/49/34793949_67524116_1000.jpg"
            },
            {
                id: 8,
                name: "Void Gorro C.P COMPANY",
                category: "Accessories",
                price: 129.00,
                image: "https://cdn-images.farfetch-contents.com/33/07/64/29/33076429_64070879_1000.jpg"
            },
            {
                id: 9,
                name: "Lanvin VOID",
                category: "Shoes",
                price: 999.99,
                image: "https://cdn-images.farfetch-contents.com/32/87/20/44/32872044_63200647_1000.jpg"
            },
            {
                id: 10,
                name: "Void Eyewear",
                category: "Accessories",
                price: 829.00,
                image: "https://cdn-images.farfetch-contents.com/33/99/75/93/33997593_65035568_1000.jpg"
            }
        
        ];

        //  ESTADO DO CARRINHO
        let cart = JSON.parse(localStorage.getItem('void-cart')) || [];

        //  ELEMENTOS DO DOM 
        const productsContainer = document.getElementById('products-container');
        const cartOverlay = document.getElementById('cart-overlay');
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        const cartCount = document.querySelector('.cart-count');
        const toast = document.getElementById('toast');
        const cartIcon = document.querySelector('.cart-icon');
        const closeCart = document.querySelector('.close-cart');
        const menuToggle = document.querySelector('.menu-toggle');
        const mobileMenu = document.querySelector('.mobile-menu');
        const closeMenu = document.querySelector('.close-menu');
        const checkoutButton = document.getElementById('checkout-button');

        // FUNÇÕES de Renderizar produtos
        function renderProducts() {
            productsContainer.innerHTML = products.map(product => `
                <div class="product-card" data-id="${product.id}">
                    <div class="product-image-container">
                        <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
                    </div>
                    <div class="product-info">
                        <p class="product-category">${product.category}</p>
                        <h3 class="product-name">${product.name}</h3>
                        <p class="product-price">R$ ${product.price.toFixed(2)}</p>
                        <button class="add-to-cart" onclick="addToCart(${product.id})">Adicionar ao Carrinho</button>
                    </div>
                </div>
            `).join('');

            // Animação de entrada
            const cards = document.querySelectorAll('.product-card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('visible');
                }, index * 100);
            });
        }

        // Adicionar ao carrinho
        function addToCart(productId) {
            const product = products.find(p => p.id === productId);
            const existingItem = cart.find(item => item.id === productId);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    ...product,
                    quantity: 1
                });
            }

            updateCart();
            showToast();
        }

        // Atualizar carrinho
        function updateCart() {
            localStorage.setItem('void-cart', JSON.stringify(cart));

            // Atualizar contador
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            cartCount.classList.add('bounce');
            setTimeout(() => cartCount.classList.remove('bounce'), 500);

            // Renderizar itens do carrinho
            if (cart.length === 0) {
                cartItems.innerHTML = '<div class="empty-cart">Seu carrinho está vazio</div>';
            } else {
                cartItems.innerHTML = cart.map(item => `
                    <div class="cart-item" data-id="${item.id}">
                        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                        <div class="cart-item-details">
                            <h4 class="cart-item-name">${item.name}</h4>
                            <p class="cart-item-price">R$ ${(item.price * item.quantity).toFixed(2)}</p>
                            <div class="cart-item-controls">
                                <div class="quantity-control">
                                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                                    <span class="quantity">${item.quantity}</span>
                                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                                </div>
                                <button class="remove-item" onclick="removeItem(${item.id})" aria-label="Remover item">🗑️</button>
                            </div>
                        </div>
                    </div>
                `).join('');
            }

            // Atualizar total
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            cartTotal.textContent = `R$ ${total.toFixed(2)}`;
        }

        // Atualizar quantidade
        function updateQuantity(productId, change) {
            const item = cart.find(item => item.id === productId);
            if (item) {
                item.quantity += change;
                if (item.quantity <= 0) {
                    cart = cart.filter(i => i.id !== productId);
                }
            }
            updateCart();
        }

        // Remover item
        function removeItem(productId) {
            cart = cart.filter(item => item.id !== productId);
            updateCart();
        }

        // Mostrar toast
        function showToast() {
            toast.classList.add('active');
            setTimeout(() => {
                toast.classList.remove('active');
            }, 2000);
        }

        // Abrir/fechar carrinho
        function toggleCart() {
            cartOverlay.classList.toggle('active');
        }

        // Abrir/fechar menu mobile
        function toggleMenu() {
            mobileMenu.classList.toggle('active');
        }

        // Finalizar compra
        function checkout() {
            if (cart.length === 0) return;

            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const itemsList = cart.map(item => `${item.quantity}x ${item.name}`).join('\n');

            alert(`Finalizando compra:\n\n${itemsList}\n\nTotal: R$ ${total.toFixed(2)}\n\nObrigado pela sua compra!`);

            cart = [];
            updateCart();
            toggleCart();
        }

        // Scroll suave
        function smoothScroll() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        window.scrollTo({
                            top: target.offsetTop,
                            behavior: 'smooth'
                        });
                        // Fechar menus mobile
                        mobileMenu.classList.remove('active');
                        cartOverlay.classList.remove('active');
                    }
                });
            });
        }

        //  EVENT LISTENERS 
        cartIcon.addEventListener('click', toggleCart);
        closeCart.addEventListener('click', toggleCart);
        menuToggle.addEventListener('click', toggleMenu);
        closeMenu.addEventListener('click', toggleMenu);
        checkoutButton.addEventListener('click', checkout);

        // Fechar carrinho ao clicar fora
        cartOverlay.addEventListener('click', (e) => {
            if (e.target === cartOverlay) {
                toggleCart();
            }
        });

        //  INICIALIZAÇÃO 
        renderProducts();
        updateCart();
        smoothScroll();
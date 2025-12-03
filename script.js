window.addEventListener('load', () => {
    window.scrollTo(0, 0);
});

// -------------------- CART FUNCTIONALITY --------------------

let cart = [];

// Load cart from localStorage
window.addEventListener("load", () => {
    const saved = JSON.parse(localStorage.getItem("cart"));
    if (saved) {
        cart = saved;
        updateCart(false);
    }
});

const cartCount = document.getElementById("cart-count");
const buttons = document.querySelectorAll(".add-to-cart");

// Add to cart from product cards
buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        const name = btn.dataset.name;
        const price = btn.dataset.price;
        const image = btn.dataset.img;

        const existing = cart.find(item => item.name === name);

        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({ name, price, image, quantity: 1 });
        }

        updateCart(false); // keep mini-cart open
    });
});

// -------------------- MINI-CART DISPLAY --------------------

function updateCart(toggleMini = false) {
    const miniCart = document.getElementById("mini-cart");
    const list = document.getElementById("cart-items");

    // Keep mini-cart visible whenever updating
    miniCart.style.display = "none";
    // Update cart count
    cartCount.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);

    // Save cart
    localStorage.setItem("cart", JSON.stringify(cart));

    // Build mini-cart items
    list.innerHTML = "";
    cart.forEach((item, index) => {
        const li = document.createElement("li");
        li.innerHTML = `${item.name} - ${item.price} <br> Quantity: ${item.quantity}`;

        // Decrease quantity button
        const minusBtn = document.createElement("button");
        minusBtn.textContent = "-";
        minusBtn.style.margin = "0 5px";
        minusBtn.style.padding = "0px 15px";
        minusBtn.style.cursor = "pointer";
        minusBtn.addEventListener("click", () => {
                miniCart.style.display = "block";
            item.quantity -= 1;
            if (item.quantity === 0) cart.splice(index, 1);
            updateCart(false);
        });

        // Increase quantity button
        const plusBtn = document.createElement("button");
        plusBtn.textContent = "+";
        plusBtn.style.margin = "0 5px";
        plusBtn.style.padding = "0px 15px";
        plusBtn.style.cursor = "pointer";
        plusBtn.addEventListener("click", () => {
                miniCart.style.display = "block";
            item.quantity += 1;
            updateCart(false);
        });

        li.appendChild(minusBtn);
        li.appendChild(plusBtn);
        list.appendChild(li);
    });

    // Show or hide checkout button
    checkout.style.display = cart.length === 0 ? "none" : "block";
}

// -------------------- CHECKOUT BUTTON --------------------

const checkout = document.getElementById("checkout-btn");
const totalPriceEl = document.getElementById("total-price");

checkout.addEventListener("click", () => {
    
    if (cart.length === 0) {
        totalPriceEl.innerHTML = "Your cart is empty";
        return;
    }

    let total = 0;

    cart.forEach(item => {
        const price = parseFloat(item.price.replace("$", ""));
        total += price * item.quantity;
    });

    totalPriceEl.textContent = `Total: $${total}`;
});

// -------------------- CART ICON CLICK TO TOGGLE --------------------

const cartIcon = document.querySelector(".cart-icon");

cartIcon.addEventListener("click", (e) => {
    e.stopPropagation(); // prevents closing on inner clicks

    const miniCart = document.getElementById("mini-cart");
    miniCart.style.display = miniCart.style.display === "block" ? "none" : "block";
});



// -------------------- MODAL VIEW DESCRIPTION --------------------

const modal = document.getElementById("product-modal");
const modalName = document.getElementById("modal-name");
const modalDesc = document.getElementById("modal-desc");
const modalPrice = document.getElementById("modal-price");
const modalImg = document.getElementById("modal-img");

const viewButtons = document.querySelectorAll(".view-details");
let modalProduct = {};

viewButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        modalProduct = {
            name: btn.dataset.name,
            price: btn.dataset.price,
            desc: btn.dataset.desc,
            img: btn.dataset.img
        };

        modalName.textContent = modalProduct.name;
        modalDesc.textContent = modalProduct.desc;
        modalPrice.textContent = modalProduct.price;
        modalImg.src = modalProduct.img;

        modal.style.display = "flex";
    });
});

// Close modal
document.querySelector(".close-modal").onclick = () => modal.style.display = "none";
window.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; };

// Add to cart from modal
document.getElementById("modal-add-cart").addEventListener("click", () => {
    const existing = cart.find(item => item.name === modalProduct.name);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ name: modalProduct.name, price: modalProduct.price, image: modalProduct.img, quantity: 1 });
    }
    updateCart(false);
    modal.style.display = "none";
});

// -------------------- FILTER FEATURE --------------------

const filterButtons = document.querySelectorAll(".filter-btn");
const products = document.querySelectorAll(".product-card");

filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".filter-btn.active")?.classList.remove("active");
        btn.classList.add("active");

        const category = btn.dataset.category;
        products.forEach(product => {
            if (category === "all" || product.dataset.category.includes(category)) {
                product.style.display = "block";
            } else {
                product.style.display = "none";
            }
        });
    });
});

// -------------------- PRODUCT CARD STAGGERED REVEAL --------------------

const cards = document.querySelectorAll(".product-card");
const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add("show"), index * 150);
        } else {
            entry.target.classList.remove("show");
        }
    });
}, { threshold: 0.2 });

cards.forEach(card => observer.observe(card));

// -------------------- NAVBAR MENU TOGGLE --------------------

const menu = document.getElementById("menu");
const navLinks = document.querySelector(".links");
menu.addEventListener("click", ()=>{
    navLinks.classList.toggle("show-menu");
});
window.addEventListener("scroll", ()=>{
    if(window.scrollY > 3){
        navLinks.classList.remove("show-menu");
    }
})

// -------------------- NAVBAR SCROLL SHADOW --------------------

const navbar = document.querySelector("nav");
window.addEventListener("scroll", () => {
    if (window.scrollY > 10) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");
});

// -------------------- LOGO CLICK RELOAD --------------------

const logo = document.querySelector(".logo");
logo.addEventListener("click", e => {
    e.preventDefault();
    location.reload();
});

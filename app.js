//header & nav trigger
const cartIconBtn = document.getElementById('cart-icon-btn');
const cartCountBadge = document.getElementById('cart-count-badge');

//main components
const daysDisplay = document.getElementById('timer-days');
const hoursDisplay = document.getElementById('timer-hours');
const minutesDisplay = document.getElementById('timer-minutes');
const secondsDisplay = document.getElementById('timer-seconds');
const sizeButtons = document.querySelectorAll('.size-chip');
const addToCartBtn = document.getElementById('add-to-cart-btn');

//drawer components
const sideCartDrawer = document.getElementById('side-cart-drawer');
const drawerCloseBtn = document.getElementById('drawer-close-btn');
const drawerOverlayClose = document.getElementById('drawer-overlay-close');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartSubtotalDisplay= document.getElementById('cart-subtotal-display');

//storefront state (store memory)
let isDropped = false;
let selectedSize = null;
let cartCount = 0;
const PRODUCT_PRICE = 190.00;

// countdown timer engine
const dropTargetTime = Date.now() + 10 * 1000;

function updateCountdown() {
    const currentTime = Date.now();
    const timeDifference = Math.max(dropTargetTime - currentTime,0);
     //time calculations for hr,mns,secs
     const days = Math.floor(timeDifference/ (1000*60*60*24));
     const hours = Math.floor((timeDifference % (1000*60*60*24)) / (1000*60*60));
     const minutes = Math.floor((timeDifference % (1000*60*60)) / (1000*60));
     const seconds = Math.floor ((timeDifference % (1000*60)) / 1000);
     daysDisplay.textContent = String(days).padStart(2,'0');
     hoursDisplay.textContent = String(hours).padStart(2,'0');
     minutesDisplay.textContent = String(minutes).padStart(2,'0');
     secondsDisplay.textContent = String(seconds).padStart(2,'0');
    //once timer hits 0
    if (timeDifference <= 0) {
        clearInterval(timerEngine);
        UnlockStorefront();
    }
}
const timerEngine = setInterval(updateCountdown, 1000);
//instant execution when timer hits 0
function UnlockStorefront() {
    isDropped = true;
    addToCartBtn.removeAttribute('disabled');
    addToCartBtn.querySelector('.btn-text').textContent = "COP NOW!";
    //enable size btns once timer hits 0 instantly
    sizeButtons.forEach(button => {
        if (!button.hasAttribute('data-disabled-initially')) {
            button.removeAttribute('disabled')    
        }
        
    });
}
function openCartDrawer() {
    sideCartDrawer.setAttribute('aria-hidden', 'false');
}
function closeCartDrawer() {
    sideCartDrawer.setAttribute('aria-hidden','true');
}
// to manage toggles visible
cartIconBtn.addEventListener('click',openCartDrawer);
drawerCloseBtn.addEventListener('click',closeCartDrawer);
drawerOverlayClose.addEventListener('click', closeCartDrawer);

//selection & purchase logic
sizeButtons.forEach(button => {
    button.addEventListener('click', () => {
        sizeButtons.forEach(btn => btn.classList.remove('is-selected'));
        button.classList.add('is-selected');
        selectedSize = button.getAttribute('data-size');
    });
});
addToCartBtn.addEventListener('click', () => {
    if(!isDropped) return;
    if(!selectedSize) {
        alert('CRITICAL: SELECT A SIZE BEFORE THEY DISAPPEAR!');
        return;
    }
    //cart calculation
    cartCount += 1;
    const computedSubtotal = cartCount * PRODUCT_PRICE;
//display cart calutlations onto store element
    cartCountBadge.textContent = cartCount;
    cartSubtotalDisplay.textContent =`$${computedSubtotal.toFixed(2)}`;
    cartItemsContainer.innerHTML = `<div style="display: flex; gap: 1rem; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;">
      <div style="width: 70px; height: 70px; background-color: var(--bg-primary); border-radius: var(--radius-sm); overflow:hidden;">
        <img src="3JSrender.png" style="width:100%; height:100%; object-fit:cover;">
      </div>
      <div>
        <h4 style="font-size: 0.95rem; font-weight: 800;">Air Jordan 1 "The Vault"</h4>
        <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 2px;">SIZE: US Men ${selectedSize}</p>
        <p style="font-size: 0.9rem; color: var(--accent-hype); font-weight: 700; margin-top: 4px;">$190.00</p>
      </div>
    </div>
    `;
const checkoutBtn = document.querySelector('.btn-checkout');
checkoutBtn.removeAttribute('disabled');

openCartDrawer();
});
updateCountdown();

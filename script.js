document.getElementById('year').textContent = new Date().getFullYear();

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
navToggle.addEventListener('click', () => navMenu.classList.toggle('open'));

// Sample listing data
const listings = [
    { id:1, title:"3BR Ranch Home", location:"Pahrump", type:"Single Family", beds:3, baths:2, price:329000, img:"https://placehold.co/500x350/1A2340/ffffff?text=Listing+1", desc:"A spacious single-story ranch with an open living area and a large backyard, perfect for entertaining." },
    { id:2, title:"Modern Desert Condo", location:"Las Vegas", type:"Condo", beds:2, baths:2, price:245000, img:"https://placehold.co/500x350/D4A574/ffffff?text=Listing+2", desc:"A sleek two-bedroom condo close to downtown, with updated finishes and a private balcony." },
    { id:3, title:"5-Acre Land Parcel", location:"Goodsprings", type:"Land", beds:0, baths:0, price:89000, img:"https://placehold.co/500x350/243054/ffffff?text=Listing+3", desc:"Wide open land ready for your custom build, with easy highway access and mountain views." },
    { id:4, title:"Luxury Pool Estate", location:"Pahrump", type:"Single Family", beds:4, baths:3, price:589000, img:"https://placehold.co/500x350/1A2340/ffffff?text=Listing+4", desc:"A stunning estate with a resort-style pool, chef's kitchen, and panoramic desert views." },
    { id:5, title:"Multi-Family Duplex", location:"Pahrump", type:"Multi-Family", beds:4, baths:2, price:410000, img:"https://placehold.co/500x350/D4A574/ffffff?text=Listing+5", desc:"Two fully separate units, ideal for house-hacking or a rental investment property." },
    { id:6, title:"Cozy Starter Home", location:"Las Vegas", type:"Single Family", beds:2, baths:1, price:198000, img:"https://placehold.co/500x350/243054/ffffff?text=Listing+6", desc:"An affordable, move-in ready starter home minutes from schools and shopping." },
];

const favKey = 'mm_favorites';
const rvKey = 'mm_recently_viewed';
const getFavs = () => JSON.parse(localStorage.getItem(favKey) || '[]');
const setFavs = (arr) => localStorage.setItem(favKey, JSON.stringify(arr));
const getRV = () => JSON.parse(localStorage.getItem(rvKey) || '[]');
const setRV = (arr) => localStorage.setItem(rvKey, JSON.stringify(arr));

function toggleFav(id){
    let favs = getFavs();
    if (favs.includes(id)) favs = favs.filter(f => f !== id);
    else favs.push(id);
    setFavs(favs);
    renderListings();
}

function addRecentlyViewed(id){
    let rv = getRV().filter(r => r !== id);
    rv.unshift(id);
    rv = rv.slice(0, 4);
    setRV(rv);
    renderRecentlyViewed();
}

function renderRecentlyViewed(){
    const rv = getRV();
    const wrap = document.getElementById('recentlyViewed');
    const row = document.getElementById('rvRow');
    if (rv.length === 0){ wrap.classList.remove('show'); return; }
    wrap.classList.add('show');
    row.innerHTML = rv.map(id => {
        const l = listings.find(x => x.id === id);
        if (!l) return '';
        return `<div class="rv_card" onclick="openModal(${l.id})">
            <img src="${l.img}" alt="${l.title}">
            <div class="rv_label">${l.title}</div>
        </div>`;
    }).join('');
}

function currentFiltered(){
    const loc = document.getElementById('fLocation').value;
    const type = document.getElementById('fType').value;
    const beds = parseInt(document.getElementById('fBeds').value, 10) || 0;
    const maxPrice = parseFloat(document.getElementById('fMaxPrice').value) || Infinity;
    const sort = document.getElementById('fSort').value;

    let result = listings.filter(l =>
        (!loc || l.location === loc) &&
        (!type || l.type === type) &&
        (l.beds >= beds) &&
        (l.price <= maxPrice)
    );

    if (sort === 'price_asc') result.sort((a,b) => a.price - b.price);
    else if (sort === 'price_desc') result.sort((a,b) => b.price - a.price);
    else if (sort === 'beds_desc') result.sort((a,b) => b.beds - a.beds);
    else result.sort((a,b) => b.id - a.id);

    return result;
}

function renderListings(){
    const grid = document.getElementById('listingsGrid');
    const meta = document.getElementById('resultsMeta');
    const noResults = document.getElementById('noResults');
    const favs = getFavs();
    const result = currentFiltered();

    meta.textContent = `${result.length} listing${result.length !== 1 ? 's' : ''} found`;
    noResults.classList.toggle('show', result.length === 0);

    grid.innerHTML = result.map(l => `
        <div class="listing_card" onclick="openModal(${l.id})">
            <div class="listing_media">
                <img src="${l.img}" alt="${l.title}">
                <button class="fav_btn ${favs.includes(l.id) ? 'active' : ''}" onclick="event.stopPropagation(); toggleFav(${l.id})">
                    <i class="fa-solid fa-heart"></i>
                </button>
                <div class="listing_price">$${l.price.toLocaleString()}</div>
            </div>
            <div class="listing_body">
                <h3>${l.title}</h3>
                <div class="loc">${l.location} · ${l.type}</div>
                <div class="listing_stats">
                    ${l.beds ? `<span><i class="fa-solid fa-bed"></i>${l.beds} bd</span>` : ''}
                    ${l.baths ? `<span><i class="fa-solid fa-bath"></i>${l.baths} ba</span>` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

function openModal(id){
    const l = listings.find(x => x.id === id);
    if (!l) return;
    document.getElementById('modalImg').src = l.img;
    document.getElementById('modalTitle').textContent = l.title;
    document.getElementById('modalLoc').textContent = `${l.location} · ${l.type} · $${l.price.toLocaleString()}`;
    document.getElementById('modalDesc').textContent = l.desc;
    document.getElementById('modalOverlay').classList.add('open');
    addRecentlyViewed(id);
}

document.getElementById('modalClose').addEventListener('click', () => {
    document.getElementById('modalOverlay').classList.remove('open');
});
document.getElementById('modalOverlay').addEventListener('click', (e) => {
    if (e.target.id === 'modalOverlay') e.currentTarget.classList.remove('open');
});

document.getElementById('applyFilters').addEventListener('click', renderListings);

document.getElementById('heroSearchBtn').addEventListener('click', () => {
    document.getElementById('fLocation').value = document.getElementById('heroLocation').value;
    document.getElementById('fType').value = document.getElementById('heroType').value;
    document.getElementById('listings').scrollIntoView({ behavior:'smooth' });
    renderListings();
});

renderListings();
renderRecentlyViewed();
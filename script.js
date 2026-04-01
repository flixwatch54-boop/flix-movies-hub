const cardsPerPage = 30;
let currentPage = 1;
let currentCategory = 'all';
let allCards = [];

document.addEventListener('DOMContentLoaded', () => {
    allCards = Array.from(document.querySelectorAll('.movie-card'));
    updateUI();
    fixImages();

    // Search
    const searchInput = document.getElementById('searchInput');
    let debounce;
    searchInput.addEventListener('input', () => {
        clearTimeout(debounce);
        debounce = setTimeout(()=> { currentPage=1; updateUI(); }, 300);
    });

    // Category buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelector('.btn.active').classList.remove('active');
            this.classList.add('active');
            currentCategory = this.dataset.category.toLowerCase();
            currentPage=1; updateUI();
        });
    });

    // Pagination buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    prevBtn.addEventListener('click', () => { if(currentPage>1){currentPage--;updateUI();window.scrollTo({top:300,behavior:'smooth'});} });
    nextBtn.addEventListener('click', () => { currentPage++; updateUI(); window.scrollTo({top:300,behavior:'smooth'}); });

    // Trending Arrows
    const wrapper = document.getElementById('trendingWrapper');
    document.querySelector('.prev-trend').addEventListener('click', () => wrapper.scrollBy({ left: -300, behavior: 'smooth' }));
    document.querySelector('.next-trend').addEventListener('click', () => wrapper.scrollBy({ left: 300, behavior: 'smooth' }));
});

// Update UI function
function updateUI(){
    const searchVal = document.getElementById('searchInput').value.toLowerCase().trim();
    const filtered = allCards.filter(c=>{
        const title=c.querySelector('h3').textContent.toLowerCase();
        const category=c.dataset.category ? c.dataset.category.toLowerCase() : 'all';
        return (title.includes(searchVal) && (currentCategory==='all'||category.includes(currentCategory)));
    });

    const totalPages=Math.ceil(filtered.length/cardsPerPage);
    if(currentPage>totalPages && totalPages>0) currentPage=totalPages;

    allCards.forEach(c=>{ c.style.display='none'; c.classList.remove('show'); });
    const start=(currentPage-1)*cardsPerPage;
    const end=start+cardsPerPage;
    filtered.slice(start,end).forEach(c=>{ c.style.display='block'; setTimeout(()=>c.classList.add('show'),10); });

    document.getElementById('noResult').style.display = filtered.length===0?'block':'none';
    const pageSpan=document.getElementById('pageNumber');
    if(pageSpan) pageSpan.innerText = `Page ${currentPage} of ${totalPages||1}`;

    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    if(prevBtn && nextBtn){
        prevBtn.disabled = currentPage===1;
        nextBtn.disabled = currentPage>=totalPages || totalPages===0;
    }
}

// Broken Image Fix
function fixImages(){
    document.querySelectorAll('.movie-card img').forEach(img=>{
        img.onerror=function(){ this.src="https://via.placeholder.com/200x300/333/fff?text=No+Poster"; };
    });
}
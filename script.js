let reviews = JSON.parse(localStorage.getItem("reviews")) || [];
let currentRating = 0;

function saveData() {
    localStorage.setItem("reviews", JSON.stringify(reviews));
}

function uid() {return Date.now() + Math.floor(Math.random()*1000)}

function addReview() {
    const productId = document.getElementById("productId").value.trim();
    const customerId = document.getElementById("customerId").value.trim();
    const reviewText = document.getElementById("reviewText").value.trim();
    const rating = currentRating;

    if (!productId || !customerId || !rating || !reviewText) {
        alert("Please complete all fields and set a rating.");
        return;
    }

    const review = {
        review_id: uid(),
        product_id: productId,
        customer_id: customerId,
        rating: rating,
        review_text: reviewText,
        created_at: new Date().toLocaleString(),
        updated_at: new Date().toLocaleString(),
        status: false
    };

    reviews.unshift(review);
    saveData();
    displayReviews();
    clearForm();
}

function clearForm(){
    document.getElementById("productId").value = "";
    document.getElementById("customerId").value = "";
    document.getElementById("reviewText").value = "";
    setRating(0);
}

function renderStars(n){
    return '★'.repeat(n) + '☆'.repeat(5-n);
}

function displayReviews(filter=""){
    const list = document.getElementById('reviewList');
    list.innerHTML = '';

    const filtered = reviews.filter(r=>{
        if(!filter) return true;
        const q = filter.toLowerCase();
        return r.review_text.toLowerCase().includes(q)||String(r.product_id).includes(q)||String(r.customer_id).includes(q);
    });

    if(filtered.length===0){
        list.innerHTML = '<div class="card" style="text-align:center;color:var(--muted)">No reviews yet</div>';
        return;
    }

    filtered.forEach((review, idx)=>{
        const card = document.createElement('div');
        card.className = 'review card';

        card.innerHTML = `
            <div class="meta">
                <div class="ids">Product: <strong>${review.product_id}</strong> • Customer: <strong>${review.customer_id}</strong></div>
                <div class="rating-disp">${renderStars(Number(review.rating))}</div>
            </div>
            <p>${escapeHtml(review.review_text)}</p>
            <div class="foot">
                <div class="ids">${review.created_at}</div>
                <div style="display:flex;gap:8px;align-items:center">
                    <div class="pill ${review.status? 'approved':'pending'}">${review.status? 'Approved':'Pending'}</div>
                    <div class="actions">
                        <button onclick="toggleStatus(${getIndexById(review.review_id)})">${review.status? 'Unapprove':'Approve'}</button>
                        <button onclick="deleteReview(${getIndexById(review.review_id)})">Delete</button>
                    </div>
                </div>
            </div>
        `;

        list.appendChild(card);
    });
}

function getIndexById(id){
    return reviews.findIndex(r=>r.review_id===id);
}

function toggleStatus(index){
    if(index<0) return;
    reviews[index].status = !reviews[index].status;
    reviews[index].updated_at = new Date().toLocaleString();
    saveData();
    displayReviews(document.getElementById('search').value.trim());
}

function deleteReview(index){
    if(index<0) return;
    if(!confirm('Delete this review?')) return;
    reviews.splice(index,1);
    saveData();
    displayReviews(document.getElementById('search').value.trim());
}

function setRating(val){
    currentRating = Number(val)||0;
    document.querySelectorAll('.star').forEach(btn=>{
        const v = Number(btn.dataset.value);
        btn.classList.toggle('active', v<=currentRating);
        btn.textContent = v<=currentRating? '★':'☆';
    });
}

function escapeHtml(str){
    return String(str).replace(/[&<>"']/g, function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[m]});
}

// Init: wire up events
document.getElementById('submitBtn').addEventListener('click', addReview);
document.querySelectorAll('.star').forEach(btn=>{
    btn.addEventListener('click', ()=> setRating(btn.dataset.value));
});
document.getElementById('search').addEventListener('input', (e)=> displayReviews(e.target.value.trim()));
document.getElementById('year').textContent = new Date().getFullYear();

displayReviews();
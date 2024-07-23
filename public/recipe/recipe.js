const token = localStorage.getItem('token');

document.getElementById('addRecipe').addEventListener('submit', async (event) => {
    event.preventDefault();
    const recipeObject = {
        name: event.target.name.value,
        time: event.target.time.value,
        ingredient: event.target.ingrds.value,
        instruction: event.target.intrsctn.value,
    };
    try {
        const res = await axios.post('http://localhost:3000/recipes/add-recipe', recipeObject , {headers: { 'Authorization': token }});
        getRecipe();
        alert('Post your recipe');
    } catch (error) {
        console.error(error);
        alert('Failed to post your recipe');
    }
});

async function getRecipe() {
    try {
        const response = await axios.get('http://localhost:3000/recipes/get-recipe',{ headers: { 'Authorization': token }});
        displayRecipe(response.data.recipe);
    } catch (error) {
        console.error(error);
    }
}

function displayRecipe(recipes) {
    const recipeList = document.getElementById('recipeList');
    recipeList.innerHTML = '';
    recipes.forEach(recipe => {
        const recipeItem = document.createElement('div');
        recipeItem.innerHTML = `
            <h3>${recipe.name}</h3>
            <p>Cooking time: ${recipe.time} hour</p>
            <p>Ingredients: ${recipe.ingredient}</p>
            <p>Instructions: ${recipe.instruction}</p>
            <div id="editForm_${recipe.id}" style="display:none;"></div>
        `;

        const dtlBtn = document.createElement('button');
        dtlBtn.textContent = 'Delete';
        dtlBtn.addEventListener('click', async () => {
            await deleteRecipe(recipe.id);
            getRecipe();
        });

        const edtBtn = document.createElement('button');
        edtBtn.textContent = 'Edit';
        edtBtn.addEventListener('click', () => {
            showEditForm(recipe);
        });

        recipeItem.appendChild(dtlBtn);
        recipeItem.appendChild(edtBtn);
        recipeList.appendChild(recipeItem);
    });
}

async function deleteRecipe(id) {
    try {
        await axios.delete(`http://localhost:3000/recipes/delete-recipe/${id}`,{ headers: { 'Authorization': token }});
    } catch (error) {
        console.error(error);
        alert('Failed to delete your recipe');
    }
}

function showEditForm(recipe) {
    const editFormDiv = document.getElementById(`editForm_${recipe.id}`);
    if (editFormDiv) {
        editFormDiv.style.display = 'block';
        editFormDiv.innerHTML = `
            <form id="editForm_${recipe.id}_form" class="editForm">
                <label for="name_${recipe.id}">Name:</label>
                <input type="text" id="name_${recipe.id}" name="name" value="${recipe.name}" required>
                <label for="time_${recipe.id}">Cooking time:</label>
                <input type="number" id="time_${recipe.id}" name="time" value="${recipe.time}" required>
                <label for="ingredient_${recipe.id}">Ingredients:</label>
                <input type="text" id="ingredient_${recipe.id}" name="ingredient" value="${recipe.ingredient}" required>
                <label for="instruction_${recipe.id}">Instructions:</label>
                <textarea id="instruction_${recipe.id}" name="instruction" required>${recipe.instruction}</textarea>
                <button type="submit">Save</button>
                <button type="button" onclick="hideEditForm(${recipe.id})">Cancel</button>
            </form>
        `;
        document.getElementById(`editForm_${recipe.id}_form`).addEventListener('submit', async (event) => {
            event.preventDefault();
            const updatedRecipe = {
                name: document.getElementById(`name_${recipe.id}`).value,
                time: document.getElementById(`time_${recipe.id}`).value,
                ingredient: document.getElementById(`ingredient_${recipe.id}`).value,
                instruction: document.getElementById(`instruction_${recipe.id}`).value,
            };
            try {
                await axios.put(`http://localhost:3000/recipes/edit-recipe/${recipe.id}`, updatedRecipe, { headers: { 'Authorization': token } });
                getRecipe();
            } catch (error) {
                console.error(error);
                alert('Failed to edit your recipe');
            }
        });
    } else {
        console.error('Edit form div not found:', `editForm_${recipe.id}`);
    }
}

function hideEditForm(id) {
    const editFormDiv = document.getElementById(`editForm_${id}`);
    if (editFormDiv) {
        editFormDiv.style.display = 'none';
    }
}


document.getElementById('searchBtn').addEventListener('click' , () => {
    const searchQuery = document.getElementById('searchInput').value;
    searchRecipe(searchQuery);
});


async function searchRecipe (searchQuery = ''){
    try{
        const res = await axios.get(`http://localhost:3000/recipes/search-recipe` ,{ params: { search: searchQuery },headers: { 'Authorization': token }});
        console.log('search response' , res.data);
        const searchRecipe = document.getElementById('searchRecipe');
        searchRecipe.innerHTML = '';
        res.data.searchRecipes.forEach(recipe => {
            const recipeItem = document.createElement('div');
            recipeItem.innerHTML = `
                <h3>${recipe.name}<p>Created by: ${recipe.User.username}</p></h3>
                <p>Cooking time: ${recipe.time} hour</p>
                <p>Ingredients: ${recipe.ingredient}</p>
                <p>Instructions: ${recipe.instruction}</p>
            `;
            searchRecipe.appendChild(recipeItem);
        })
    }catch (error) {
        console.error(error);
        alert('Failed to fetch search recipe');
    }
};


async function browseRecipes(){
    try{
        const res = await axios.get('http://localhost:3000/recipes/browse-recipes');
        const browseRecipesDiv = document.getElementById('browseRecipes');
        browseRecipesDiv.innerHTML = '';
        res.data.browseRecipes.forEach(recipe => {
            const recipeItem = document.createElement('div');
            recipeItem.innerHTML = `
                <h3>${recipe.name}<p>Created by: ${recipe.User.username}</p></h3>
                        <p>Cooking time: ${recipe.time} hour</p>
                        <p>Ingredients: ${recipe.ingredient}</p>
                        <p>Instructions: ${recipe.instruction}</p>
                        <div id="reviews_${recipe.id}"></div>

                        <div id="reviews_${recipe.id}" class="reviews-section"></div>
                        <form id="reviewForm_${recipe.id}" class="review-form">
                        <input type="hidden" name="recipeId" value="${recipe.id}">
   
                        <div class="input-group">
                            <input type="text" id="comment_${recipe.id}" name="comment" placeholder="Comment here...">
                            <button type="submit">Submit</button>
                         </div> 
                         </form>  `;
            browseRecipesDiv.appendChild(recipeItem);
        });
        document.querySelectorAll('.review-form').forEach(form => {
            form.addEventListener('submit' , async(event) => {
            event.preventDefault();
            const recipeId = event.target.recipeId.value;
            const comment = event.target.comment.value;
            try{
                const response = await axios.post(`http://localhost:3000/reviews/add-review`, {recipeId , comment},{ headers: { 'Authorization': token }});
                loadReviews(recipeId);
                alert('Added review');
                event.target.comment.value = '';
            } catch (error) {
                console.error('Error while submitting review:', error);
                alert('Failed to add review');
            }
        });
    })
    res.data.browseRecipes.forEach(recipe => {
        loadReviews(recipe.id);
    });
    
    } catch (error) {
        console.error(error);
    }
}  


async function loadReviews(recipeId){
    try{
        const response = await axios.get(`http://localhost:3000/reviews/get-review/${recipeId}`);
    const reviewsDiv = document.getElementById(`reviews_${recipeId}`);
    reviewsDiv.innerHTML='';
    response.data.reviews.forEach(review => {
        const reviewItem = document.createElement('div');
        reviewItem.innerHTML = ` <p> ${review.User.username} : ${review.comment} </p>`;
        reviewsDiv.appendChild(reviewItem);
        });
    } catch (error) {
        console.error('Error while loading reviews:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    getRecipe();
    browseRecipes()
});
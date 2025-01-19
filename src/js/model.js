import { async } from 'regenerator-runtime';
import { API_URL , RES_PER_PAGE , KEY } from './config.js';
import { getjson  , sendjson } from './helper.js';


export const state = {
    recipe: {},
    srch :{
        query:'',
        results : [],
        resultsPerPage: RES_PER_PAGE,
        page : 1,
    },
    bookmarks : [],
};

const createRecipeObject = function(data){
    const {recipe} = data.data;
        return {
            id: recipe.id,
            title: recipe.title,
            publisher: recipe.publisher,
            sourceUrl: recipe.source_url,
            image: recipe.image_url,
            servings: recipe.servings,
            cookingTime: recipe.cooking_time,
            ingredients: recipe.ingredients,
            ...(recipe.key && {key: recipe.key}),
        };
};

export const loadRecipe = async function (id) {
    try{
        const data = await getjson(`${API_URL}${id}?key=${KEY}`);
       
        state.recipe = createRecipeObject(data);
        

        if(state.bookmarks.some(bookmark => bookmark.id === id)){
            state.recipe.bookmarked = true;
        }else state.recipe.bookmarked = false;
        
    } catch(err){
        console.error(err);
        throw err;
    }
};


export const loadSearchResults = async function (query) {
    try{
        state.srch.query = query;
        const data = await getjson(`${API_URL.slice(0,-1)}?search=${query}&key=${KEY}`);
        

        state.srch.results = data.data.recipes.map(rec => {return {
            id :rec.id,title: rec.title , publisher:rec.publisher, image :rec.image_url,
            ...(rec.key && {key: rec.key}),
        }});
        

        //store in localstorage
        localStorage.setItem('searchResults', JSON.stringify(state.srch.results));

        state.srch.page = 1;
    }catch(err){
        throw err;
    }
    
};

export const loadStoredSearchResults = function() {
    const stored = localStorage.getItem('searchResults');
    if (!stored) return;
    state.srch.results = JSON.parse(stored);
  };


export const getSearchResultsPage = function(page = state.srch.page){
    state.srch.page = page;
    return state.srch.results.slice((page-1)*state.srch.resultsPerPage,page*state.srch.resultsPerPage);
}

export const updateServings = function(newServings){
    state.recipe.ingredients.forEach(ing => {
        ing.quantity = ing.quantity * newServings / state.recipe.servings;
    });

    state.recipe.servings = newServings;
}


const saveBookmarks = function(){
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

export const addBookmark = function(recipe){
    state.bookmarks.push(recipe);

    //Mark current recipe as bookmarked

    if(recipe.id === state.recipe.id) state.recipe.bookmarked = true;

    saveBookmarks();
};

export const deleteBookmark = function(id){
    const index = state.bookmarks.findIndex(el => el.id === id);
    state.bookmarks.splice(index , 1);

    //Mark current recipe as not bookmarked

    if(id === state.recipe.id) state.recipe.bookmarked = false;

    saveBookmarks();
};

const init = function(){
    const storage = localStorage.getItem('bookmarks');
    if(storage) state.bookmarks = JSON.parse(storage);
};
init();

const clearBookmarks = function(){
    localStorage.clear('bookmarks');
}
// clearBookmarks();

export const uploadRecipe = async function(newRecipe){
    try{
        const ingredients = Object.entries(newRecipe).filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '').map(ing => {
            const ingArr = ing[1].split(',').map(el => el.trim());
            if(ingArr.length !== 3) throw new Error('Wrong ingredient format! Please use the correct format :)');
            const [quantity, unit, description] = ingArr;
            return {quantity: quantity ? +quantity : null, unit, description};
        });

        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients,
        };

        const data = await sendjson(`${API_URL}?key=${KEY}`, recipe);
        state.recipe = createRecipeObject(data);
        addBookmark(state.recipe);
        
    }catch(err){
        throw err;
    }
}
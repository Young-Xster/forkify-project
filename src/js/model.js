import { async } from 'regenerator-runtime';
import { API_URL , RES_PER_PAGE } from './config.js';
import { getjson } from './helper.js';

export const state = {
    recipe: {},
    srch :{
        query:'',
        results : [],
        resultsPerPage: RES_PER_PAGE,
        page : 1,
    },
};

export const loadRecipe = async function (id) {
    try{
        const data = await getjson(`${API_URL}${id}`);
        console.log(data);
        
        const {recipe} = data.data;
        state.recipe = {
            id: recipe.id,
            title: recipe.title,
            publisher: recipe.publisher,
            sourceUrl: recipe.source_url,
            image: recipe.image_url,
            servings: recipe.servings,
            cookingTime: recipe.cooking_time,
            ingredients: recipe.ingredients
        };
        
    } catch(err){
        console.error(err);
        throw err;
    }
};


export const loadSearchResults = async function (query) {
    try{
        state.srch.query = query;
        const data = await getjson(`${API_URL.slice(0,-1)}?search=${query}`);
        

        state.srch.results = data.data.recipes.map(rec => {return {
            id :rec.id,title: rec.title , publisher:rec.publisher, image :rec.image_url,
        }});
        
    }catch(err){
        throw err;
    }
    
};


export const getSearchResultsPage = function(page = state.srch.page){
    state.srch.page = page;
    return state.srch.results.slice((page-1)*state.srch.resultsPerPage,page*state.srch.resultsPerPage);
}
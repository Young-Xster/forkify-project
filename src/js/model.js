import { async } from 'regenerator-runtime';
import { API_URL } from './config.js';
import { getjson } from './helper.js';

export const state = {
    recipe: {},
    srch :{
        query:'',
        results : [],
    },
};

export const loadRecipe = async function (id) {
    try{
        const data = await getjson(`${API_URL}${id}`);
        
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
            id :rec.id,title: rec.title , publisher:rec.publisher, image : rec.image,
        }});
        
    }catch(err){
        throw err;
    }
    
};
loadSearchResults('pizza');
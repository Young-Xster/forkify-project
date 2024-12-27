import * as model from './model.js';
import recipeView from './view/recipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

const recipeContainer = document.querySelector('.recipe');



// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////



const controlRecipes = async function () {
  try{
    let id = window.location.hash.slice(1);
    console.log(id);
    if(!id) return;
    
    recipeView.renderSpinner();
    
    //loading recipe

    await model.loadRecipe(id);
    
    

    // rendering recipe

    recipeView.render(model.state.recipe);

   
      
        

  }catch(err){
    alert(err);
  }
};

['hashchange' , 'load'].forEach(ev => window.addEventListener(ev , controlRecipes));


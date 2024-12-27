import * as model from './model.js';
import recipeView from './view/recipeView.js';
import searchView from './view/searchView.js';

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
    
    recipeView.renderError();
  }
};




const controlSerchResults = async function(){
try{

  //get search query
  const query = searchView.getQuery();
  if(!query) return;
  
  //load results
  await model.loadSearchResults(query);

  //render results
  console.log(model.state.srch.results);
  

}catch (err){
  recipeView.renderError();
}

};
controlSerchResults();

const init = function(){
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSerchResults);
}
init();


import * as model from './model.js';
import { TIMEOUT_SEC , MODAL_CLOSE_SEC } from './config.js';
import recipeView from './view/recipeView.js';
import resultsView from './view/resultsView.js';
import bookmarksView from './view/bookmarksView.js';
import searchView from './view/searchView.js';
import paginationView from './view/paginationView.js';
import addRecipeView from './view/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// const recipeContainer = document.querySelector('.recipe');
// document.querySelector('.results').value = '';

if(module.hot){
  module.hot.accept();
}




// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////



const controlRecipes = async function () {
  try{

    let id = window.location.hash.slice(1);

    if(!id) return;
    
    recipeView.renderSpinner();

    resultsView.update(model.getSearchResultsPage());
    
    //loading recipe
    
    await model.loadRecipe(id);
    
    // rendering recipe
    
    recipeView.render(model.state.recipe);
    
    // resultsView.render(model.state.srch.results);
    controlPagination(model.state.srch.page);
    
    bookmarksView.update(model.state.bookmarks);

  }catch(err){
    
    recipeView.renderError();
  }


};




const controlSearchResults = async function(){
try{

  resultsView.renderSpinner(); 

  //get search query
  const query = searchView.getQuery();
  if(!query) return;
  
  //load results
  await model.loadSearchResults(query);


  //render results

  // resultsView.render(model.state.srch.results);
  controlPagination(model.state.srch.page);

  // render initial pagination buttons
  paginationView.render(model.state.srch);
  

}catch (err){
  resultsView.renderError();
}

};

const controlPagination = function (page){
  resultsView.render(model.getSearchResultsPage(page));
  paginationView.render(model.state.srch);
}


const corntrolServings = function(newServings){
  //update the recipe servings (in state)
  model.updateServings(newServings);
  //update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
}


const controlAddBookmark = function(){

  //add or remove bookmark
  if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  // else model.deleteBookmark(model.state.recipe.id);
  else model.deleteBookmark(model.state.recipe.id);

  //update recipe view
  recipeView.update(model.state.recipe);

  //render bookmarks
  bookmarksView.render(model.state.bookmarks);
}

const controlBookmarks = function(){
  bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe = async function(newRecipe){
  try{
    // addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);

    recipeView.render(model.state.recipe);

    addRecipeView.renderMessage();

    bookmarksView.render(model.state.bookmarks);

    //change id in url
    window.history.pushState(null , '' , `#${model.state.recipe.id}`);

    
    setTimeout(function(){
      addRecipeView.toggleWindow();
    }, TIMEOUT_SEC * MODAL_CLOSE_SEC * 1000);
    
  }catch(err){
    addRecipeView.renderError(err.message);
  }
}

const init = function(){


  model.loadStoredSearchResults();
  if (model.state.srch.results.length) {
    resultsView.render(model.state.srch.results);
    paginationView.render(model.state.srch);
  }
  bookmarksView.addHandlerRender(controlBookmarks);

  recipeView.addHandlerUpdateServings(corntrolServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  recipeView.addHandlerRender(controlRecipes);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  
}
init();


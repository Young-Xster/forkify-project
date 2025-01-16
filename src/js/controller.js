import * as model from './model.js';
import recipeView from './view/recipeView.js';
import resultsView from './view/resultsView.js';
import searchView from './view/searchView.js';
import paginationView from './view/paginationView.js';

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
    
    //loading recipe

    await model.loadRecipe(id);

    // console.log(model.state.recipe);
    

    // rendering recipe

    recipeView.render(model.state.recipe);

    // resultsView.render(model.state.srch.results);
    controlPagination(model.state.srch.page);



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
  recipeView.renderError();
}

};

const controlPagination = function (page){
  resultsView.render(model.getSearchResultsPage(page));
  paginationView.render(model.state.srch);
}

const init = function(){
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
}
init();


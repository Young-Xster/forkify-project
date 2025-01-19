import view from './view.js';
import icons from 'url:../../img/icons.svg';

class addRecipeView extends view{
    _parentElement = document.querySelector('.upload');
    _message = 'Recipe was successfully uploaded';
    _window = document.querySelector('.add-recipe-window');
    _overlay = document.querySelector('.overlay');
    _btnOpen = document.querySelector('.nav__btn--add-recipe');
    _btnClose = document.querySelector('.btn--close-modal');

    constructor(){
        super();
        this._addHandlerShowWindow();
        this._addHandlerHideWindow();
    }

    toggleWindow(){
        this._overlay.classList.toggle('hidden');
        this._window.classList.toggle('hidden');
    }

    _addHandlerShowWindow(){
        this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
    }


    _addHandlerHideWindow(){
        this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
        this._overlay.addEventListener('click', this.toggleWindow.bind(this));
    }

    addHandlerUpload(handler){
        this._parentElement.addEventListener('submit', function(e){
            e.preventDefault();
            const dataArr = [...new FormData(this)];
            const data = Object.fromEntries(dataArr);
            handler(data);
        });
    }


    _generateMarkup(){
        const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
        const currentPage = this._data.page;
        // Page 1 and there are other pages
        if(currentPage === 1 && numPages > 1){
            return this._generateMarkupButton(currentPage, 'next');
        }
        // Last page
        if(currentPage === numPages && numPages > 1){
            return this._generateMarkupButton(currentPage, 'prev');
        }
        // Other page
        if(currentPage < numPages){
            return this._generateMarkupButton(currentPage, 'prev') + this._generateMarkupButton(currentPage, 'next');
        }
        // Page 1 and there are no other pages
        return '';
    }

    _generateMarkupButton(page, type){
        return `<button data-goto="${type === 'prev' ? page - 1 : page + 1}" class="btn--inline pagination__btn--${type}">
            <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-${type === 'prev' ? 'left' : 'right'}"></use>
            </svg>
          </button>`
    }

}


export default new addRecipeView();
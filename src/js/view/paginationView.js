import view from './view.js';
import icons from 'url:../../img/icons.svg';

class paginationView extends view{
    _parentElement = document.querySelector('.pagination');


    addHandlerClick(handler){
        this._parentElement.addEventListener('click', function(e){
            const btn = e.target.closest('.btn--inline');
            if(!btn) return;
            const goToPage = +btn.dataset.goto;
            handler(goToPage);
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

export default new paginationView();
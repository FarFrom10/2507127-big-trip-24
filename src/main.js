import FiltersView from './view/filters-view.js';
import BoardPresenter from './presenter/board-presenter.js';
import { render } from './render.js';
import BoardModel from './model/board-model.js';


const siteTripControlsFilters = document.querySelector('.trip-controls__filters');
render(new FiltersView, siteTripControlsFilters);

const bodyMainContainer = document.querySelector('main .page-body__container');

const boardModel = new BoardModel();

const boardPresenter = new BoardPresenter({boardContainer: bodyMainContainer, boardModel});


boardPresenter.init();

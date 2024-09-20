import { remove, render, replace } from '../framework/render';
import EventItemView from '../view/event-item-view';
import FormEditEventView from '../view/form-edit-event-view';

const mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

export default class EventPresenter{
  #eventListContainer = null;
  #handleDataChange = null;
  #handleModeChange = null;

  #eventComponent = null;
  #eventEditComponent = null;

  #eventData = null;
  #typeOffers = null;
  #allTypes = null;

  #mode = mode.DEFAULT;

  constructor({eventListContainer, onDataChange, onModeChange}) {
    this.#eventListContainer = eventListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init({eventData, typeOffers, allTypes}){
    this.#eventData = eventData;
    this.#typeOffers = typeOffers;
    this.#allTypes = allTypes;

    const prevEventComponent = this.#eventComponent;
    const prevEventEditComponent = this.#eventEditComponent;

    this.#eventComponent = new EventItemView({
      eventData: this.#eventData,
      onEditClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick,
    });

    this.#eventEditComponent = new FormEditEventView({
      eventData: this.#eventData,
      typeOffers: this.#typeOffers,
      allTypes: this.#allTypes,
      onFormSubmit: this.#handleFormSubmit,
      onFormClose: this.#handleFormClose,
    });

    if (prevEventComponent === null || prevEventEditComponent === null) {
      render(this.#eventComponent, this.#eventListContainer);
      return;
    }

    if (this.#mode === mode.DEFAULT) {
      replace(this.#eventComponent, prevEventComponent);
    }

    if (this.#mode === mode.EDITING) {
      replace(this.#eventEditComponent, prevEventEditComponent);
    }

    remove(prevEventComponent);
    remove(prevEventEditComponent);
  }

  destroy(){
    remove(this.#eventComponent);
    remove(this.#eventEditComponent);
  }

  resetView(){
    if (this.#mode !== 'DEFAULT') {
      this.#replaceFormToEvent();
    }
  }

  #handleFavoriteClick = () => {
    const event = {...this.#eventData.event, isFavorite: !this.#eventData.event.isFavorite};
    this.#handleDataChange({
      eventData:{...this.#eventData, event},
      typeOffers: this.#typeOffers,
      allTypes: this.#allTypes
    });
  };

  #handleEditClick = () => {
    this.#replaceEventToForm();
  };

  #handleFormSubmit = () => {
    this.#replaceFormToEvent();
  };

  #handleFormClose = () => {
    this.#replaceFormToEvent();

  };

  #escKeyDownHandler = (evt) => {
    if(evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToEvent();
    }
  };

  #replaceEventToForm(){
    replace(this.#eventEditComponent, this.#eventComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = mode.EDITING;
  }

  #replaceFormToEvent(){
    replace(this.#eventComponent, this.#eventEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = mode.DEFAULT;
  }

}

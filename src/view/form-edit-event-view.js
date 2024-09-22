import AbstractView from '../framework/view/abstract-view.js';
import {TimeFormat } from '../utils/const.js';
import { humanizeDate } from '../utils/event.js';


function createEventTypeItemTemplate(type) {
  return `
    <div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
    </div>
  `;
}

function createFormHeaderTypeTemplate(event, allTypes){
  const eventTypeList = allTypes.map((type) => createEventTypeItemTemplate(type)).join('');

  return `
    <div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-1">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src="img/icons/${event.type}.png" alt="Event type icon">
                    </label>
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

                    <div class="event__type-list">
                      <fieldset class="event__type-group">
                        <legend class="visually-hidden">Event type</legend>

                        ${eventTypeList}
                      </fieldset>
                    </div>
                  </div>
  `;
}

function createFormHeaderEventNameTemplate(event, destination){
  return `
    <div class="event__field-group  event__field-group--destination">
                    <label class="event__label  event__type-output" for="event-destination-1">
                      ${event.type}
                    </label>
                    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
                    <datalist id="destination-list-1">
                      <option value="Amsterdam"></option>
                      <option value="Geneva"></option>
                      <option value="Chamonix"></option>
                    </datalist>
                  </div>
  `;
}

function createFormHeaderTimeTemplate(event){
  const startTime = humanizeDate(event.dateFrom, TimeFormat.FORM_EDIT);
  const endTime = humanizeDate(event.dateTo, TimeFormat.FORM_EDIT);

  return `
    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-1">From</label>
      <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startTime}">
      &mdash;
      <label class="visually-hidden" for="event-end-time-1">To</label>
      <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endTime}">
    </div>
  `;
}

function createFormHeaderPriceTemplate({basePrice}){
  return `
    <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-1">
                      <span class="visually-hidden">Price</span>
                      &euro;
                    </label>
                    <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
                  </div>
  `;
}

function createFormHeaderButtonsTemplate(){
  return `
    <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
    <button class="event__reset-btn" type="reset">Cancel</button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  `;
}

function createFormHeaderTemplate(event, destination, allTypes) {

  return `
    <header class="event__header">
                  ${createFormHeaderTypeTemplate(event, allTypes)}
                  ${createFormHeaderEventNameTemplate(event, destination)}
                  ${createFormHeaderTimeTemplate(event)}
                  ${createFormHeaderPriceTemplate(event)}
                  ${createFormHeaderButtonsTemplate()}
                </header>
  `;
}

function createEventOfferTemplate(offer){

  return `
    <div class="event__offer-selector">
                        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.name}-1" type="checkbox" name="event-offer-${offer.name}">
                        <label class="event__offer-label" for="event-offer-${offer.name}-1">
                          <span class="event__offer-title">${offer.title}</span>
                          &plus;&euro;&nbsp;
                          <span class="event__offer-price">${offer.price}</span>
                        </label>
                      </div>
  `;
}

function createEventPhotoTemplate({src, description}){
  return `<img class="event__photo" src=${src} alt="${description}">`;
}

function createEventPhotoContainerTemplate({pictures}){
  const photoList = pictures.map((item) => createEventPhotoTemplate(item)).join('');

  return `
    <div class="event__photos-container">
                      <div class="event__photos-tape">
                      ${photoList}
                      </div>
                    </div>
  `;
}

function createEventDestinationTemplate(destination) {
  return `
    <section class="event__section  event__section--destination">
                    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                    <p class="event__destination-description">${destination.description}</p>
                    ${destination.pictures.length > 0 ? createEventPhotoContainerTemplate(destination) : ''}
                  </section>
  `;
}

function createOfferListTemplate(offerList) {
  return `
  <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
                      ${offerList}
                    </div>
  `;
}

function createEventDetailsTemplate(offerList, destination) {
  return `
      <section class="event__details">
                  <section class="event__section  event__section--offers">
                    ${offerList.length ? createOfferListTemplate(offerList) : '' }
                  </section>
                  ${destination}
                </section>
  `;
}

function createFormAddEventTemplate(eventData, typeOffers, allTypes) {
  const {event, destination} = eventData;
  const offerList = typeOffers.map((offer) => createEventOfferTemplate(offer)).join('');

  return `
    <form class="event event--edit" action="#" method="post">
      ${createFormHeaderTemplate(event, destination, allTypes)}
      ${createEventDetailsTemplate(offerList, createEventDestinationTemplate(destination))}
    </form>
  `;
}


export default class FormEditEventView extends AbstractView{
  #eventData = null;
  #typeOffers = null;
  #allTypes = null;
  #handleFormSubmit = null;
  #handleFormClose = null;

  constructor({eventData, typeOffers, allTypes, onFormSubmit, onFormClose}) {
    super();
    this.#eventData = eventData;
    this.#typeOffers = typeOffers;
    this.#allTypes = allTypes;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleFormClose = onFormClose;

    this.setEventListeners();
  }

  get template() {
    return createFormAddEventTemplate(this.#eventData, this.#typeOffers, this.#allTypes);
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit();
  };

  #formCloseHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormClose();
  };

  setEventListeners() {
    this.element.addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#formCloseHandler);
  }

}

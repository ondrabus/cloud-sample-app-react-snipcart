import React, { Component } from 'react';
import { CoffeeStore } from '../Stores/Coffee';
import { translate } from 'react-translate';

let getState = props => {
  return {
    coffees: CoffeeStore.getCoffees(props.language),
    filter: CoffeeStore.getFilter()
  };
};

class Coffees extends Component {
  constructor(props) {
    super(props);

    this.state = getState(props);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    CoffeeStore.addChangeListener(this.onChange);
    CoffeeStore.provideCoffees(this.props.language);
  }

  componentWillUnmount() {
    CoffeeStore.removeChangeListener(this.onChange);
    CoffeeStore.unsubscribe();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.language !== nextProps.language) {
      CoffeeStore.provideCoffees(nextProps.language);
      return {
        language: nextProps.language
      };
    }
    return null;
  }

  onChange() {
    this.setState(getState(this.props));
  }

  render() {
    let formatPrice = (price, language) => {
      return price.toLocaleString(language, {
        style: 'currency',
        currency: 'USD'
      });
    };

    let renderProductStatus = productStatus => {
      if (productStatus.value.length === 0) {
        return <span />;
      }

      let text = productStatus.value.map(x => x.name).join(', ');

      return <span className="product-tile-status">{text}</span>;
    };

    let filter = coffee => {
      return this.state.filter.matches(coffee);
    };

    let coffees = this.state.coffees.filter(filter).map((coffee, index) => {
      let id = coffee.system.id;
      let country = coffee.country.value;
      let price = coffee.price.value;
      let formattedPrice = formatPrice(coffee.price.value, this.props.language);
      let quantity = coffee.quantity.value;

      let name =
        coffee.productName.value.trim().length > 0
          ? coffee.productName.value
          : this.props.t('noNameValue');

      let imageLink =
        coffee.image.value[0] !== undefined ? (
          <img
            alt={name}
            className=""
            src={coffee.image.value[0].url}
            title={name}
          />
        ) : (
          <div
            style={{ height: '257.15px' }}
            className="product-tile-image placeholder-tile-image"
          >
            {this.props.t('noTeaserValue')}
          </div>
        );

      let status = renderProductStatus(coffee.productStatus);

      let buyButtonStyles =
        'snipcart-add-item btn ' +
        (quantity > 0 ? 'buy-button' : 'buy-button--disabled');
      let quantityStyles =
        quantity > 0
          ? 'product-quantity--in-stock'
          : 'product-quantity--out-of-stock';
      let quantityTitle = quantity > 0 ? 'in stock' : 'out of stock';

      return (
        <div className="col-md-6 col-lg-4" key={index}>
          <article className="product-tile">
            <h1 className="product-heading">{name}</h1>
            {status}
            <figure className="product-tile-image">{imageLink}</figure>
            <div className="product-item-quantity">
              <span className={quantityStyles}>
                {' '}
                {`${quantityTitle}: ${quantity} pcs`}
              </span>
            </div>
            <div className="product-tile-info">
              <span className="product-tile-price">{formattedPrice}</span>
            </div>
          </article>
          <div>
            <button
              className={buyButtonStyles}
              disabled={quantity < 1}
              data-item-id={id}
              data-item-name={name}
              data-item-price={price}
              data-item-url="https://kentico.github.io/cloud-sample-app-react-snipcart/products.json"
              data-item-description={country}
              data-item-image={coffee.image.value[0].url}
            >
              Buy coffee!
            </button>
          </div>
        </div>
      );
    });

    return (
      <div id="product-list" className="col-md-8 col-lg-9 product-list">
        {coffees}
      </div>
    );
  }
}

export default translate('Coffees')(Coffees);

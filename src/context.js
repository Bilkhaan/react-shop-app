import React, { Component } from 'react';
import { storeProducts, detailProduct } from './data';

const ProductContext = React.createContext();

class ProductProvider extends Component {
  state = {
    products: [],
    cart: [],
    detailProduct,
    openModal: false,
    modalProduct: detailProduct,
    cartSubTotal: 0,
    cartTax: 0,
    cartTotal: 0
  };

  componentDidMount() {
    this.setProducts();
  }

  setProducts = () => {
    let products = [];
    storeProducts.forEach(item => products.push({...item}));
    this.setState(
      () => (
        { products }
      )
    );
  }

  getProduct = id => {
    return this.state.products.find((product) => (product.id === id));
  };

  handleDetail = (id) => {
    const product = this.getProduct(id);
    this.setState(() => (
      { detailProduct: product }
    ));
  };

  openTheModal = id => {
    const product = this.getProduct(id);
    this.setState(() => (
      {
        openModal: true,
        modalProduct: product
      }
    ));
  }

  closeModal = () => {
    this.setState(() => (
      {
        openModal: false,
      }
    ));
  }

  addToCart = (id) => {
    let tempProducts = [...this.state.products];
    const index = tempProducts.indexOf(this.getProduct(id));
    const product = tempProducts[index];
    product.inCart = true;
    product.count = 1;
    const price = product.price;
    product.total = price;
    this.setState(
      () => (
        {
          products: tempProducts,
          cart: [...this.state.cart, product]
        }
      ),
      () => {
        this.addTotals();
      }
    );
  };

  getCartItem = id => {
    return this.state.cart.find((item) => (item.id === id));
  };

  increment = (id) => {
    const tempCart = [...this.state.cart];
    const tempProduct = tempCart.find((item) => item.id === id );
    const index = tempCart.indexOf(tempProduct);
    const product = tempCart[index];

    product.count = product.count + 1;
    product.total = product.count * product.price;

    this.setState(
      () => ({ cart: [...tempCart] }),
      () => this.addTotals()
    )
  };

  decrement = (id) => {
    const tempCart = [...this.state.cart];
    const tempProduct = tempCart.find((item) => item.id === id );
    const index = tempCart.indexOf(tempProduct);
    const product = tempCart[index];

    product.count = product.count - 1;

    if (product.count === 0) {
      this.removeItem(id);
    } else {
      product.total = product.count * product.price;

      this.setState(
        () => ({ cart: [...tempCart] }),
        () => this.addTotals()
      )
    }
  };

  removeItem = (id) => {
    let tempProducts = [...this.state.products];
    let tempCart = [...this.state.cart];

    tempCart = tempCart.filter((item) => item.id !== id);

    const index = tempProducts.indexOf(this.getProduct(id));
    let removedProduct = tempProducts[index];
    removedProduct.inCart = false;
    removedProduct.count = 0;
    removedProduct.total = 0;

    this.setState(
      () => ({
        cart: [...tempCart],
        products: [...tempProducts]
      }),
      () => {
        this.addTotals();
      }
    );
  };

  clearCart = () => {
    this.setState(
      () => (
        {
          cart: [],
          cartSubTotal: 0,
          cartTax: 0,
          cartTotal: 0
        }
      ),
      () => {
        this.setProducts();
      }
    );
  };

  addTotals = () => {
    let subTotal = 0;
    this.state.cart.map((item) => subTotal += item.total );
    const tempTax = subTotal * 0.1;
    const tax = parseFloat(tempTax.toFixed(2));
    const total = tax + subTotal;

    this.setState(() => ({
      cartSubTotal: subTotal,
      cartTax: tax,
      cartTotal: total
    }));
  }

  render() {
    return (
      <ProductContext.Provider value={{
        ...this.state,
        handleDetail: this.handleDetail,
        addToCart: this.addToCart,
        openTheModal: this.openTheModal,
        closeModal: this.closeModal,
        increment: this.increment,
        decrement: this.decrement,
        removeItem: this.removeItem,
        clearCart: this.clearCart
      }}>
        {this.props.children}
      </ProductContext.Provider>
    );
  }
}

const ProductConsumer = ProductContext.Consumer;

export { ProductProvider, ProductConsumer };
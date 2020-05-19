import React, { Component } from 'react';
import { storeProducts, detailProduct } from './data';

const ProductContext = React.createContext();

class ProductProvider extends Component {
  state = {
    products: [],
    cart: [],
    detailProduct,
    openModal: false,
    modalProduct: detailProduct
  };

  componentDidMount() {
    this.setProducts();
  }

  setProducts = () => {
    let products = [];
    storeProducts.forEach(item => products.push({...item}));
    this.setState(() => (
      { products }
    ));
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
    product.price = price;
    this.setState(() => (
      {
        products: tempProducts,
        cart: [...this.state.cart, product]
      }
    ));
  };

  render() {
    return (
      <ProductContext.Provider value={{
        ...this.state,
        handleDetail: this.handleDetail,
        addToCart: this.addToCart,
        openTheModal: this.openTheModal,
        closeModal: this.closeModal

      }}>
        {this.props.children}
      </ProductContext.Provider>
    );
  }
}

const ProductConsumer = ProductContext.Consumer;

export { ProductProvider, ProductConsumer };
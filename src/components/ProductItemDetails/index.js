// Write your code here
import {Component} from 'react'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productItemDetails: {},
    similarProducts: [],
    quantity: 1,
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.fetchProductsDetails()
  }

  fetchProductsDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const similarProducts = data.similar_products.map(each => ({
        id: each.id,
        imageUrl: each.image_url,
        title: each.title,
        style: each.style,
        price: each.price,
        description: each.description,
        brand: each.brand,
        totalReviews: each.total_reviews,
        rating: each.rating,
        availability: each.availability,
      }))
      const productItemDetails = {
        id: data.id,
        imageUrl: data.image_url,
        title: data.title,
        style: data.style,
        price: data.price,
        description: data.description,
        brand: data.brand,
        totalReviews: data.total_reviews,
        rating: data.rating,
        availability: data.availability,
      }
      this.setState({
        productItemDetails,
        similarProducts,
        apiStatus: apiStatusConstants.success,
      })
    } else if (response.status === 404) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onIncreaseQuantity = () =>
    this.setState(prevState => ({quantity: prevState.quantity + 1}))

  onDecreaseQuantity = () => {
    let {quantity} = this.state
    if (quantity > 1) {
      quantity -= 1
    }
    this.setState({quantity})
  }

  renderProductDetails = () => {
    const {productItemDetails, quantity} = this.state
    const {
      imageUrl,
      title,
      price,
      rating,
      totalReviews,
      description,
      availability,
      brand,
    } = productItemDetails
    return (
      <div className="product-item-container">
        <img src={imageUrl} alt="product" className="product-item-image" />
        <div className="product-item-details">
          <h1 className="product-item-title">{title}</h1>
          <p className="price-details">Rs {price}/-</p>
          <div className="rating-reviews-container">
            <div className="rating-container">
              <p className="rating">{rating}</p>
              <img
                src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                alt="star"
                className="star"
              />
            </div>
            <p className="total-reviews-text">{totalReviews} Reviews</p>
          </div>
          <p className="product-item-description">{description}</p>
          <p className="brand-details-color">
            <span className="product-item-brand">Available: </span>
            {availability}
          </p>
          <p className="brand-details-color">
            <span className="product-item-brand">Brand: </span>
            {brand}
          </p>
          <hr className="separator" />
          <div className="quantity-container">
            <button
              type="button"
              className="plus-minus-btn"
              onClick={this.onDecreaseQuantity}
              data-testid="minus"
            >
              <BsDashSquare className="plus-minus-icon" />
            </button>
            <p className="quantity">{quantity}</p>
            <button
              type="button"
              className="plus-minus-btn"
              onClick={this.onIncreaseQuantity}
              data-testid="plus"
            >
              <BsPlusSquare className="plus-minus-icon" />
            </button>
          </div>
          <button type="button" className="add-to-cart-btn">
            ADD TO CART
          </button>
        </div>
      </div>
    )
  }

  renderSimilarProducts = () => {
    const {similarProducts} = this.state
    return (
      <div className="similar-products-section">
        <h1 className="similar-products-heading">Similar Products</h1>
        <ul className="similar-products-list">
          {similarProducts.map(each => (
            <SimilarProductItem key={each.id} productDetails={each} />
          ))}
        </ul>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="product-not-found-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="products-not-found-img"
      />
      <h1 className="product-not-found-heading">Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="continue-shopping-btn">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  renderLoaderView = () => (
    <div className="products-details-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderProductItemPage = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return (
          <>
            {this.renderProductDetails()}
            {this.renderSimilarProducts()}
          </>
        )
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderProductItemPage()}
      </>
    )
  }
}

export default ProductItemDetails

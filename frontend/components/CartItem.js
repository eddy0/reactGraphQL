import React, {Component} from 'react'
import styled from 'styled-components';
import PropTypes from 'prop-types'
import formatMoney from '../lib/formatMoney'
import RemoveCart from './RemoveCart'



const CartItemStyle = styled.li`
  padding: 1rem 0;
  border-bottom: 1px solid ${props => props.theme.lightGrey};
  display: grid;
  align-items: center;
  grid-template-columns: auto 1fr auto;
  img {
  margin-right: 1rem;
  }
  h3, p {
    margin: 0;
  }

`

class CartItem extends Component {
    render() {
        const item = this.props.item.item
        return (
                    <CartItemStyle>
                        <img width="100px" src={item.image} alt={item.title} />
                        <div className="cart-item-details">
                            <h3>{item.title}</h3>
                            <p>
                                {formatMoney(this.props.item.quantity * item.price)}
                                {' -'}
                                <em>
                                    {this.props.item.quantity}
                                     x
                                    {formatMoney(item.price)}
                                </em>
                            </p>
                        </div>
                        <RemoveCart id={this.props.item.id}/>
                        </CartItemStyle>
                )
    }
}

CartItem.propTypes = {
    item: PropTypes.object.isRequired
}

export default CartItem
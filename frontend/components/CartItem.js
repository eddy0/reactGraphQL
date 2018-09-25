import React, {Component} from 'react'
import styled from 'styled-components';
import PropTypes from 'prop-types'
import formatMoney from '../lib/formatMoney'



const CartItemStyle = styled.li`

`

class CartItem extends Component {
    render() {
        console.log('this.props.item', this.props.item)
        const item = this.props.item.item
        return (
                    <CartItemStyle>
                        <img width="100px" src={item.image} alt={item.title} />
                        <span>{item.title}</span>
                        <div className="cart-item-details">
                            <h3>{item.title}</h3>
                            <p>
                                {formatMoney(item.price)}
                                {' x '}
                                <em>
                                    {this.props.item.quantity}
                                </em>
                            </p>
                        </div>
                        {this.props.item.id}
                        </CartItemStyle>
                )
    }
}

CartItem.propTypes = {
    item: PropTypes.object.isRequired
}

export default CartItem
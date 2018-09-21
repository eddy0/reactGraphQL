import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Title from './styles/Title'
import ItemStyles from './styles/ItemStyles'

class Item extends Component {
    render() {
        const {item} = this.props
        return (
            <ItemStyles>
                <Title> {item.title}</Title>
            </ItemStyles>
        )
    }
}


Item.propTypes = {
    item: PropTypes.object.isRequired
}

export default Item

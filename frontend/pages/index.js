import React from 'react'
import Items from '../components/Items'



class Home extends React.Component {
    render() {
        let page = Number(this.props.query.page)
        if (!page || page <= 1) {
            page = 1
        }
        return (
            <div>
                <Items page={page}/>
            </div>
        )
    }
}

export default Home
import PleaseSignIn from '../components/PleaseSignIn'
import Order from '../components/Order'



const order = (props) => {
    return (
        <PleaseSignIn>
            <Order id={props.query.id}  />
        </PleaseSignIn>
    )
}

export default order

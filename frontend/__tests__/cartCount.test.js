import CartCount from '../components/CartCount'
import {shallow, mount} from 'enzyme'
import toJSON from 'enzyme-to-json'



describe('CartCount', function() {
    it('should render', function() {
        shallow(<CartCount count={10}/>)
    })
    
    it('should snapshot', function() {
        const wrapper = shallow(<CartCount count={11}/>)
        expect(toJSON(wrapper)).toMatchSnapshot()
        wrapper.setProps({count: 10})
        expect(toJSON(wrapper)).toMatchSnapshot()
    
    })
})


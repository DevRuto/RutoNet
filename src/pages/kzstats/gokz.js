import '../../sass/table.scss';
import React from 'react';
import {
    Container
} from 'bloomer';
import GokzTable from '../../components/GokzTable';

class KzStats extends React.Component {
    render() {
        return (
            <Container style={{overflow: 'auto'}}>
                <GokzTable url='http://localhost:5002/api/gokz?count=50' />
            </Container>
        );
    }
}

export default KzStats;
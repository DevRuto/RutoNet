import React from 'react';

import {Table} from 'bloomer';
import * as moment from 'moment';
import 'moment-duration-format';
import {BigNumber} from 'bignumber.js';

function convertToSteamLink(steamId32) {
    return 'http://steamcommunity.com/profiles/' + (new BigNumber('76561197960265728')).plus(steamId32);
};

function generateReplayLink(replay_id) {
    if (replay_id === null) return 'N/A';
    return (<a href={('/replay/'+replay_id)}>WATCH</a>);
}

class GokzTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            times: null,
            error: null
        }
    }

    componentDidMount() {
        fetch(this.props.url)
            .then(res => res.json())
            .then(data => {
                this.setState({
                    loaded: true,
                    times: data
                })
            }, error => {
                this.setState({
                    loaded: true,
                    error
                });
            });
    }

    render() {
        const { error, loaded, times } = this.state;
        if (error)
            return <div>Error loading recent times: {error.message} @ {this.props.url} </div>
        else if (!loaded)
            return <div>Loading...</div>
        return (
            <div>
                <Table isStriped className='is-hoverable is-responsive'>
                    <thead>
                        <tr>
                            <th>TimeID</th>
                            <th>Player</th>
                            <th>Time</th>
                            <th>Teleports</th>
                            <th>Map</th>
                            <th>Course</th>
                            <th>Mode</th>
                            <th>When</th>
                            <th>Replay</th>
                        </tr>
                    </thead>
                    <tbody>
                        {times.map(time => {
                            return (
                            <tr key={time.time_id}>
                                <th>{time.time_id}</th>
                                <td><a href={convertToSteamLink(time.steam_id32)}>{time.player_name}</a></td>
                                <td>{moment.duration(time.run_time).format('mm:ss.SS')}</td>
                                <td>{time.teleports}</td>
                                <th>{time.map_name}</th>
                                <td>{time.course === 0 ? 'MAIN' : 'BONUS'}</td>
                                <td>{time.mode === 0 ? 'Vanilla' : time.mode === 1 ? 'SimpleKZ' : 'KZTimer'}</td>
                                <td>{moment(time.created).fromNow()}</td>
                                <td>{generateReplayLink(time.replay_id)}</td>
                            </tr>
                        )})}
                    </tbody>
                </Table>
            </div>
        );
    }
}

export default GokzTable; 
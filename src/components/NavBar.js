import React from "react";
import {
    Navbar,
    NavbarBrand,
    NavbarBurger,
    NavbarDropdown,
    NavbarItem,
    NavbarLink,
    NavbarMenu,
    NavbarStart,
    Icon, NavbarEnd
} from 'bloomer';

const NavRoute = route => (
    <route.component {...route} />
);

const NavGroup = route => (
    <NavbarItem hasDropdown isHoverable>
        <NavbarItem href={route.path}>{route.name}</NavbarItem>
        <NavbarDropdown>
            {route.routes.map((route, i) => <NavItem key={i} {...route} />)}
        </NavbarDropdown>
    </NavbarItem>
);

const NavItem = route => (
    <NavbarItem href={route.path}>{route.name}</NavbarItem>
);

const NavMobile = route => (
    <NavbarItem isHidden='desktop' href={route.path}>
        <Icon className={route.icon} />
    </NavbarItem>
);

const routes = [
    {
        path: '/',
        name: 'Home',
        icon: 'fas fa-home',
        component: NavItem
    },
    {
        path: '/kzstats',
        name: 'KZ Stats',
        icon: 'fas fa-server',
        component: NavGroup,
        routes: [
            {
                path: '/kzstats/kztimer',
                name: 'KZTimer',
                component: NavItem
            },
            {
                path: '/kzstats/gokz',
                name: 'GOKZ',
                component: NavItem
            },
            {
                path: '/kzstats/biribiri',
                name: 'Biribiri',
                component: NavItem
            }
        ]
    },
    {
        path: '/replay',
        name: 'Replays',
        icon: 'fas fa-film',
        component: NavItem
    }
];

class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isActive: false
        };
        this.onNavClick = this.onNavClick.bind(this);
    }

    onNavClick() {
        this.setState(s => ({
            isActive: !s.isActive
        }));
    }

    render() {
        return (
            <Navbar>
                <NavbarBrand>
                    <NavbarItem href='#'>Ruto</NavbarItem>
                    {routes.map((route, i) => <NavMobile key={i} {...route} />)}
                    <NavbarBurger isActive={this.state.isActive} onClick={this.onNavClick}/>
                </NavbarBrand>
                <NavbarMenu isActive={this.state.isActive} onClick={this.onNavClick}>
                    <NavbarStart>
                        {routes.map((route, i) => <NavRoute key={i} {...route} />)}
                    </NavbarStart>
                    <NavbarEnd>
                        <NavbarItem href='https://github.com/devruto'>
                            <Icon className='fab fa-github' />
                        </NavbarItem>
                        <NavbarItem href='https://gitlab.com/ruto'>
                            <Icon className='fab fa-gitlab' />
                        </NavbarItem>
                        <NavbarItem href='https://bitbucket.org/rutokz'>
                            <Icon className='fab fa-bitbucket' />
                        </NavbarItem>
                    </NavbarEnd>
                </NavbarMenu>
            </Navbar>
        );
    }
}

export default NavBar;
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import {faTools,faCogs,faTrash,faProjectDiagram,faBriefcase} from '@fortawesome/free-solid-svg-icons';


export const SideNavigation = (props) => {
	return(
		<SideNav
			    onSelect={(selected) => {
			        // Add your code here
			    }}
			>
			    <SideNav.Toggle />
			    <SideNav.Nav defaultSelected="home">
			    	<NavItem eventKey="tools">
			            <NavIcon>
			            <FontAwesomeIcon icon={faTools} /></NavIcon>
			            <NavText eventKey="tools">
			                <div className="side-menu-header">Tools</div>
			            </NavText>
			            <NavItem>
			            	<NavText>
			            		<div class="legend" def="AND"></div><span class="centerNav">AND </span>
			            	</NavText>
			            </NavItem>
			            <NavItem>
			            	<NavText>
			            		<div class="legend" def="OR"></div><span class="centerNav">OR </span>
			            	</NavText>
			            </NavItem>
			            <NavItem>
			            	<NavText>
			            		<div class="legend" def="NOT"></div><span class="centerNav">NOT </span>
			            	</NavText>
			            </NavItem>
			        </NavItem>

			        <NavItem eventKey="home">
			            <NavIcon>
			                <i className="fa fa-fw fa-home" style={{ fontSize: '1.75em' }} />
			            </NavIcon>
			            <NavText>
			                Home
			            </NavText>
			        </NavItem>
			        <NavItem eventKey="charts">
			            <NavIcon>
			                <i className="fa fa-fw fa-line-chart" style={{ fontSize: '1.75em' }} />
			            </NavIcon>
			            <NavText>
			                Charts
			            </NavText>
			            <NavItem eventKey="charts/linechart">
			                <NavText>
			                    Line Chart
			                </NavText>
			            </NavItem>
			            <NavItem eventKey="charts/barchart">
			                <NavText>
			                    Bar Chart
			                </NavText>
			            </NavItem>
			        </NavItem>
			    </SideNav.Nav>
			</SideNav>
		)
}
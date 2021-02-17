import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import {faTools,faCogs,faTrash,faProjectDiagram,faBriefcase} from '@fortawesome/free-solid-svg-icons';


export const SideNavigation = (props) => {
	return(
		<SideNav
		style={{zIndex:'1'}}
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
			            <NavItem onClick={()=>props.addNode('AND','#00cab6','#000000','Conjunction')}>
			            	<NavText>	
			            		<div class="legend" def="AND"></div><span class="centerNav">AND </span>
			            	</NavText>
			            </NavItem>
			            <NavItem onClick={()=>props.addNode('OR','#00cab6','#000000','Conjunction')}>
			            	<NavText>
			            		<div class="legend" def="OR"></div><span class="centerNav">OR </span>
			            	</NavText>
			            </NavItem>
			            <NavItem onClick={()=>props.addNode('NOT','#00cab6','#000000','Conjunction')}>
			            	<NavText>
			            		<div class="legend" def="NOT"></div><span class="centerNav">NOT </span>
			            	</NavText>
			            </NavItem>
			        </NavItem>

			        <NavItem eventKey="condition">
			            <NavIcon>
			            <FontAwesomeIcon icon={faCogs} /></NavIcon>
			            <NavText eventKey="side-menu" eventKey="condition">
			                <div className="side-menu-header">Condition</div>
			            </NavText>
			            <NavItem eventKey="condition/AND" onClick={()=>{props.addCondition()}}>
			            	<NavText>
			            		<div class="legend" def="simplecon"></div>
			            		<span class="centerNav">Create Condition </span>
			            	</NavText>
			            </NavItem>
			            {/*
			            <NavItem eventKey="condition/OR">
			            	<NavText>
			            		<div class="legend" def="currencycon"></div>
			            		<span class="centerNav">Currency Condition </span>
			            	</NavText>
			            </NavItem> 
			            <NavItem onClick={()=>props.editComplexConditionModal('DEFAULT_TYPE',false)}>
			            	<NavText>
			            		<div class="legend" def="defaultvalue"></div>
			            		<span class="centerNav">Default Value </span>
			            	</NavText>
			            </NavItem>
			            */} 
			        </NavItem>  

			        <NavItem eventKey="deleteSelected" onClick={()=>{props.deleteSelected()}}>
			         	<NavIcon>
			            <FontAwesomeIcon icon={faTrash} /></NavIcon> 
			            	<NavText>
			            		 <div className="side-menu-header">Delete</div>
			            	</NavText> 
			         </NavItem> 

			         <NavItem eventKey="edge" onClick={()=>{props.addEdge()}}>
			         	<NavIcon>
			            <FontAwesomeIcon icon={faProjectDiagram} /></NavIcon> 
			            	<NavText>
			            		 <div className="side-menu-header">Edge</div>
			            	</NavText> 
			         </NavItem>  


			    </SideNav.Nav>
			</SideNav>
		)
}
import React, { Component } from 'react';
import { Card, Button, Grid } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import { Link } from '../../routes';

import ContractPIList from '../../ethereum/ContractPIList';
import web3 from '../../ethereum/web3';

import Accounts from '../../ethereum/const/Accounts.json';

import {Pi} from '../../utils/pi';

class InsurerIndex extends Component {

  static async getInitialProps() {
    const contracts = await 
		ContractPIList.methods.getInsurerContracts(Accounts.Insurer).call();

    return { contracts };
   }

	 state = {
			contractStatus: []
	 };

	 async getSummary(address) {
			 let summary = await Pi.getSummary(address);
			 var _contractStatus = this.state.contractStatus;
			 _contractStatus[address] = summary[0];// status (int)
			 this.setState({contractStatus: _contractStatus});
	 }

   renderContracts() {
     const items = this.props.contracts.map(address => {
			this.getSummary(address);
       return {
         header: address,
         description: (
					 <Grid columns='equal' divided>
							 <Grid.Row stretched>
									 <Grid.Column>
											 <Link route={`/insurer/view/${address}`}>
													 <a>View Contract</a>
											 </Link>
									 </Grid.Column>
									 <Grid.Column width={3}>
											{Pi.renderStatus(this.state.contractStatus[address])}
									 </Grid.Column>
							 </Grid.Row>
					 </Grid>
         ),
         fluid: true
       };
     });

     return <Card.Group items={items} />;
   }

  render() {
    return (
      <Layout>
        <div>
          <h3>Your contracts with Patient</h3>
					{this.renderContracts()}
					<p></p>
					<Link route="/">
						<a>
							<Button content='Back' icon='left arrow' labelPosition='left' floated='right' />
						</a>
					</Link>
        </div>
      </Layout>
    );
  }
}

export default InsurerIndex;

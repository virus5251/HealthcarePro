import React, { Component } from 'react';
import { Card, Button, Form } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import { Link } from '../../routes';
import web3 from '../../ethereum/web3';

import Accounts from '../../ethereum/const/Accounts.json';
import DeployAddress from '../../ethereum/deployed_address.json';

class AdminIndex extends Component {

	state = {
		balance: [],
		loading: true		
	};

	async componentDidMount() {
		var balanceMap = [];
		balanceMap[Accounts.Patient] = await web3.eth.getBalance(Accounts.Patient);
		balanceMap[Accounts.Clinic] = await web3.eth.getBalance(Accounts.Clinic);
		balanceMap[Accounts.Insurer] = await web3.eth.getBalance(Accounts.Insurer);
		balanceMap[DeployAddress.ContractCPList] = await web3.eth.getBalance(DeployAddress.ContractCPList);
		balanceMap[DeployAddress.ClinicCategory] = await web3.eth.getBalance(DeployAddress.ClinicCategory);
		balanceMap[DeployAddress.ContractPIList] = await web3.eth.getBalance(DeployAddress.ContractPIList);
		balanceMap[DeployAddress.InsuranceCategory] = await web3.eth.getBalance(DeployAddress.InsuranceCategory);
		this.setState({ balance: balanceMap, loading: false });
	}

	roundAmount(amount) {
		console.log('Amount = ' + amount);
		console.log('ROUND = ' + parseFloat(amount).toFixed(2));
		return parseFloat(amount).toFixed(2);
	}

	getBalance(account) {
		var balance = this.state.balance[account];
		if (typeof balance === "undefined") {
			balance = '0';
		}
		return this.roundAmount(web3.utils.fromWei('' + balance, 'ether'));
	}

	render() {
		return (
			<Layout>
				<Form loading={this.state.loading}>
					<div>
						<h3>Administration Page</h3>
						<Link route="/">
							<a>
								<Button content='Back' icon='left arrow' labelPosition='left' floated='right' />
							</a>
						</Link>
						<h4>Account Infomation</h4>
						<div className="ui segments">
							<div className="ui red segment">
								<strong>Name: </strong> Patient
								<br />
								<strong>Address: </strong> {Accounts.Patient}
								<br />
								<strong>Balance: </strong> {this.getBalance(Accounts.Patient)} ETH
							</div>
							<div className="ui blue segment">
								<strong>Name: </strong> Clinic
								<br />
								<strong>Address: </strong> {Accounts.Clinic}
								<br />
								<strong>Balance: </strong> {this.getBalance(Accounts.Clinic)} ETH
							</div>
							<div className="ui green segment">
								<strong>Name: </strong> Insurer
								<br />
								<strong>Address: </strong> {Accounts.Insurer}
								<br />
								<strong>Balance: </strong> {this.getBalance(Accounts.Insurer)} ETH
							</div>
						</div>
					</div>
				</Form>
			</Layout>
		);
	}
}

export default AdminIndex;

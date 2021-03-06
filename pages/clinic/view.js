import React, { Component } from 'react';
import { Form, Button, Message, Segment, Label } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import EtherUint from '../../components/EtherUint';
import { Router, Link } from '../../routes';

import ContractCP from '../../ethereum/ContractCP';
import ContractCPList from '../../ethereum/ContractCPList';
import ContractPIList from '../../ethereum/ContractPIList';
import web3 from '../../ethereum/web3';

import Accounts from '../../ethereum/const/Accounts.json';
import { Cp } from './cp';
import { datetime } from '../../utils/datetime';
import { eth } from '../../utils/eth';

class ClinicViewIndex extends Component {

	static async getInitialProps(props) {
		return {
			address: props.query.address,
		};
	}

	async componentDidMount() {
		const summary = await Cp.getSummary(this.props.address);
		this.setState( {
			address: this.props.address,
			status: summary[0],
			patient: summary[1],
			clinic: summary[2],
			checkedItems: summary[3],
			totalContractValue: summary[4],
			balance: summary[5],
			document: summary[6],
			contractPi: summary[7],
			patientPaidAmount: summary[8],
			patientPayStatus: summary[9],
			insurerPaidAmount: summary[10],
			insurerPayStatus: summary[11],
			isEnabledConfirm: (summary[0] == 0),
			loading: false
		});
	}

	state = {
		errorMessage: '',
		loading: true,
		checkedItems: [],
		isEnabledConfirm: false
	};

	onConfirm = async event => {
		event.preventDefault();

		this.setState({ loading: true, errorMessage: '' });

		const contractCP = ContractCP(this.state.address);

		try {
			await contractCP.methods
				.clinicAcceptPatient()
				.send({
					from: Accounts.Clinic,
					gas: 6000000
				});

			Router.pushRoute('/clinic');
		} catch (err) {
			this.setState({ errorMessage: err.message });
		}

		this.setState({ loading: false });
	};

	render() {
		return (
			<Layout>
				<h3>Patient Contract Infomation</h3>
				<Form error={!!this.state.errorMessage} loading={this.state.loading}>
					<Message error header="Oops!" content={this.state.errorMessage} />
					<div>
						<Segment.Group>
							<Segment><strong>Contract Address: </strong>{this.state.address}</Segment>
							<Segment><strong>Status: </strong><Label color={Cp.renderStatusColor(this.state.status)}>{Cp.renderStatus(this.state.status)}</Label></Segment>
							<Segment><strong>Patient Address: </strong>{this.state.patient}</Segment>
							<Segment><strong>Insurance Address: </strong>{eth.renderAccount(this.state.contractPi)}</Segment>
							<Segment><strong>Clinic Address: </strong>{this.state.clinic}</Segment>
							<Segment><strong>Checked Items: </strong>{Cp.renderCheckedItems(this.state.checkedItems).join(', ')}</Segment>
							<Segment><strong>Total Value: </strong><EtherUint value={this.state.totalContractValue}/></Segment>
							<Segment><strong>Patient payment: </strong>{eth.fromWei(this.state.patientPaidAmount, 'ether')} ETH {this.state.patientPaidAmount == 0 ? '' : Cp.renderPayStatus(this.state.patientPayStatus)}</Segment>
							<Segment><strong>Insurer payment: </strong>{eth.fromWei(this.state.insurerPaidAmount, 'ether')} ETH {this.state.insurerPaidAmount == 0 ? '' : Cp.renderPayStatus(this.state.insurerPayStatus)}</Segment>
							<Segment><strong>Balance: </strong>{eth.fromWei(this.state.balance, 'ether')} ETH</Segment>
							<Segment>
								<Link route={`/clinic/document/${this.state.address}`}>
									<a>
										<Button basic color='blue' content='View Document' icon='image' labelPosition='right' />
									</a>
								</Link>
							</Segment>
						</Segment.Group>
						<div>
							<Button color='teal' disabled={!this.state.isEnabledConfirm} onClick={this.onConfirm}>Confirm</Button>
							<Link route="/clinic">
								<a>
									<Button content='Back' icon='left arrow' labelPosition='left' floated='right' />
								</a>
							</Link>
						</div>
					</div>
				</Form>
			</Layout>
		);
	}
}

export default ClinicViewIndex;

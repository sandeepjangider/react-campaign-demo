import React, { Component } from 'react';
import classes from './Campaigns.module.css';
import { Table, Form, Input, Button, ButtonGroup, Label, FormGroup } from 'reactstrap';
import Pagination from '../Pagination/Pagination';

class Campaigns extends Component {

    constructor (props) {
        super(props);
        this.state = {
            campaigns: [],
            currentPage: 1,
            campaignsPerPage: 5
        }
    }

    campaignData;
    
    componentDidMount() {
        this.campaignData = JSON.parse(localStorage.getItem('campaigns'));
        
        if (this.campaignData && this.campaignData.length > 0) {
            this.setState({
                campaigns : this.campaignData
            })
        } else {
            this.setState({
                campaigns : []
            })
        }
    }

    async onSubmitHandler(event) {
        event.preventDefault();

        this.campaignData = JSON.parse(localStorage.getItem('campaigns')); 
        let maxId;  
        let allIds;
        let dataArr;

        if (this.campaignData && this.campaignData.length > 0) {

            allIds = this.campaignData.map( cmp => {
                return cmp.id;
            });
            maxId = Math.max(...allIds) + 1;
            dataArr = [...this.campaignData];

        } else {

            maxId = 1;
            dataArr = [];
        }

        const updatedData = [...dataArr, {
            id: maxId, 
            campaign_name: event.target.campaign_name.value, 
            paused: false, 
            status:'Running', 
            comments: [],
            edit: false,
            showHistory: false,
            addComment: false
        }];

        await this.setState({campaigns: updatedData});

        document.getElementById('campaignForm').reset();
        
        localStorage.setItem('campaigns',JSON.stringify(this.state.campaigns));
        
    }

    async deleteCampaignHandler(id) {
        const campaignIndex = this.state.campaigns.findIndex(cmp => {
            return cmp.id === id;
          });

        const campaigns = [...this.state.campaigns];
        campaigns.splice(campaignIndex, 1);
        await this.setState({campaigns: campaigns});

        localStorage.setItem('campaigns',JSON.stringify(this.state.campaigns));
    }

    async changeStatusHandler(id) {
        const campaignIndex = this.state.campaigns.findIndex(cmp => {
            return cmp.id === id;
          });
        
        const campaign = {
            ...this.state.campaigns[campaignIndex]
        };
        if(campaign.paused) {
            campaign.status = 'Running';
            campaign.paused = false;
        } else {
            campaign.status = 'Paused';
            campaign.paused = true;
        }

        const campaigns = [...this.state.campaigns];
        campaigns[campaignIndex] = campaign;
        await this.setState({campaigns: campaigns});

        localStorage.setItem('campaigns',JSON.stringify(this.state.campaigns));
    }

    editHandler(id) {
        const campaignIndex = this.state.campaigns.findIndex(cmp => {
            return cmp.id === id;
          });

        const campaigns = [...this.state.campaigns];
        campaigns[campaignIndex].edit = true;

        this.setState({campaigns: campaigns});
    }

    nameChangeHandler(event, id) {
        const campaignIndex = this.state.campaigns.findIndex(cmp => {
            return cmp.id === id;
          });

        const campaigns = [...this.state.campaigns];
        campaigns[campaignIndex].campaign_name = event.target.value;

        this.setState({campaigns: campaigns});
    }

    updateHandler(id) {
        const campaignIndex = this.state.campaigns.findIndex(cmp => {
            return cmp.id === id;
          });

        const campaigns = [...this.state.campaigns];
        campaigns[campaignIndex].edit = false;

        this.setState({campaigns: campaigns});  

        localStorage.setItem('campaigns',JSON.stringify(this.state.campaigns));
    }

    showHistoryHandler(id) {
        const campaignIndex = this.state.campaigns.findIndex(cmp => {
            return cmp.id === id;
          });

        const campaigns = [...this.state.campaigns];
        const showHistory = campaigns[campaignIndex].showHistory;
        campaigns[campaignIndex].showHistory = !showHistory;

        this.setState({campaigns: campaigns});
    }

    addCommentHandler(id) {
        const campaignIndex = this.state.campaigns.findIndex(cmp => {
            return cmp.id === id;
          });

        const campaigns = [...this.state.campaigns];
        const addComment = campaigns[campaignIndex].addComment;
        campaigns[campaignIndex].addComment = !addComment;

        this.setState({campaigns: campaigns});
    }

    async saveCommentHandler(event,id) {
        const campaignIndex = this.state.campaigns.findIndex(cmp => {
            return cmp.id === id;
          });
        
        const campaigns = [...this.state.campaigns];
        campaigns[campaignIndex].addComment = false;

        campaigns[campaignIndex].comments = [...campaigns[campaignIndex].comments, event.target.comment.value];

        await this.setState({campaigns: campaigns});

        localStorage.setItem('campaigns',JSON.stringify(this.state.campaigns));
    }


    render() {
        //  Current Campaigns
        const indexOfLastCampaign = this.state.currentPage * this.state.campaignsPerPage;
        const indexOfFirstCampaign =  indexOfLastCampaign - this.state.campaignsPerPage;
        const currentCampaigns = this.state.campaigns.slice(indexOfFirstCampaign, indexOfLastCampaign);

        //  Change Page
        const paginate = (event, pageNumber) => {

            event.preventDefault();
            this.setState({currentPage: pageNumber});
            
        } 

        const campaignList = currentCampaigns.map((cmp) => {
            let pauseResumeBtn;
            let campaignName;
            let history;
            let commentBox;

            if (cmp.status === 'Running') {
                pauseResumeBtn = <Button onClick={() => this.changeStatusHandler(cmp.id)} outline color="info">Pause</Button>;
            } else {
                pauseResumeBtn = <Button onClick={() => this.changeStatusHandler(cmp.id)} outline color="info">Resume</Button>;
            }

            if (cmp.edit) {
                campaignName = <td><input onChange={(event) => this.nameChangeHandler(event,cmp.id)} type="text" value={cmp.campaign_name} name="campaign_name" /> &nbsp; <Button onClick={() => this.updateHandler(cmp.id)} outline size='sm' color="primary"> Update </Button></td>;
            } else {
                campaignName = <td><span className={classes.Link} onClick={()=>this.showHistoryHandler(cmp.id)}>{cmp.campaign_name}</span> &nbsp; <Button onClick={()=>this.editHandler(cmp.id)} outline size='sm' color="primary"> Edit </Button></td>;
            }

            if (cmp.showHistory) {
            history = <div>
                        <p>{cmp.campaign_name}</p>
                        <p>Comments::<br/>{
                            cmp.comments.map( (item, i) => {
                            return <span key={i}>{i+1+'. '}{item}<br/></span>
                            })
                        }</p>
                    </div>;
            }

            if (cmp.addComment) {
                commentBox = <div>
                    <form onSubmit={(event)=>this.saveCommentHandler(event,cmp.id)}>
                        <input type="text" name="comment" />&nbsp;
                        <button>Add</button>
                    </form>
                </div>;
            }

            return (
                <tr key={cmp.id} >
                    <td className={classes.Link} onClick={()=>this.showHistoryHandler(cmp.id)}>{cmp.id}</td>
                    {campaignName}
                    <td>{cmp.status}</td>
                    <td>
                        <ButtonGroup size="sm">
                            <Button onClick={() => this.deleteCampaignHandler(cmp.id)} outline color="danger">Delete</Button>
                            {pauseResumeBtn}
                            <Button onClick={()=>this.addCommentHandler(cmp.id)} outline color="warning">Add Comment</Button>
                        </ButtonGroup>
                        {commentBox}
                    </td>
                    <td>{history}</td>
                </tr>
            );
        });

        return (
            <React.Fragment>
                <div className={classes.AddCampaign}>
                    <Form onSubmit={(event) => this.onSubmitHandler(event)} id="campaignForm">
                        <FormGroup>
                            <Label>Add New Campaign</Label>
                            <Input name="campaign_name" placeholder="Enter campaign name" type="text"/>
                        </FormGroup>
                        <Button> Submit </Button>
                    </Form>
                </div>
                <div className={classes.Campaigns}>
                    <strong>All Campaigns List</strong>
                    <Table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Campaign Name</th>
                                <th>Status</th>
                                <th>Actions</th>
                                <th>Campaign History</th>
                            </tr>
                        </thead>
                        <tbody>
                            {campaignList}
                        </tbody>
                    </Table>
                    <Pagination campaignsPerPage={this.state.campaignsPerPage} totalCampaigns={this.state.campaigns.length} paginate={paginate}/>
                </div>
            </React.Fragment>
        );
    }
    
}

export default Campaigns;
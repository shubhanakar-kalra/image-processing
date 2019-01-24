import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import PrimarySearchAppBar from '../components/header';
import Snackbar from '../components/snackBar';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
});


class CenteredGrid extends React.Component {

  state = {
    url: null,
    message: '',
    showSnackBar: false
  }

  handleFileRead = (e) => {
    this.setState({ url: e.target.result });
  };

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
        return;
    }

    this.setState({ showSnackBar: false });
  };

  handleUploadImage = (input) => {
    const file = input.target.files[0];
    if (file && file.size > 100000) {
      const fileReader = new FileReader();
      fileReader.onload = this.handleFileRead;
      fileReader.readAsDataURL(file);
    } else {
      this.setState({ showSnackBar: true, message: 'Image size should be greater than 1MB' });
    }
  }

  render() {
    const { classes } = this.props;
    const { showSnackBar, message } = this.state;
    return (
      <div className={classes.root}>
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <PrimarySearchAppBar />
          </Grid>
          <Grid item xs={4}>

          </Grid>
          <Grid container item xs={8} alignItems="center" justify="center">
            {!this.state.url && <Button variant="contained" color="default" className={classes.button}>
              <input
                type="file"
                onChange={this.handleUploadImage}
                accept=".jpeg"
              />
            </Button>}
            {this.state.url && <img src={this.state.url} alt='no' />}
          </Grid>
        </Grid>
        <Snackbar open={showSnackBar} message={message} handleClose={this.handleClose}/>
      </div>
    );
  }
}

export default withStyles(styles)(CenteredGrid);
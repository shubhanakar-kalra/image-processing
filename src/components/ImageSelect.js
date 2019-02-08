import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const styles = {

};

class ImageSelect extends Component {
  render() {
    const { classes } = this.props;
    return (
      <Button variant="contained" color="default" className={classes.button}>
        <input
          type="file"
          onChange={this.props.handleUploadImage}
          accept="image/*"
        />
      </Button>
    )
  }
}
export default withStyles(styles)(ImageSelect);

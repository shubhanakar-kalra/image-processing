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
  image: {
    position: 'absolute',
    height: "400px",
    width: "400px"
  },
  canvasElement: {
    position: "realtive",
    zIndex: 2
  }
});


class CenteredGrid extends React.Component {

  state = {
    url: null,
    message: '',
    showSnackBar: false,
    isMarking: false,
    polygons: [],
    mapping: []
  }

  getCoordinates = (e) => {
    const { offsetX: posX, offsetY: posY } = e.nativeEvent;
    console.log("Co-ordinates", posX, posY);
    const { mapping } = this.state;
    const pos = [posX, posY];
    mapping.push(pos);
    this.drawLine(mapping);
    this.setState({ mapping })
  }

  removePreviousMarker = () => {
    const { mapping } = this.state;
    if (mapping.length > 2) {
      mapping.pop();
      mapping.pop();
      this.setState({ mapping });
    }
  }

  addPolygon = () => {
    const { polygons } = this.state;
    let { mapping } = this.state;
    if (mapping.length >= 3) {
      polygons.push(mapping);
      mapping = [];
      this.setState({ polygons, mapping });
    }
  }

  drawLine(mapping) {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    if (mapping.length >= 2) {
      let lc = mapping.slice(-2);
      console.log(`(${lc[0]}),(${lc[1]})`)
      ctx.beginPath();
      ctx.moveTo(lc[0][0], lc[0][1]);
      ctx.lineTo(lc[1][0], lc[1][1]);
      ctx.stroke();
    }
    // ctx.beginPath();
    //   ctx.moveTo(0, 0);
    //   ctx.lineTo(100, 100);
    //   ctx.stroke();
  }

  fillColor = () => {
    const { polygons } = this.state;
    console.log("fill color", polygons);
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    if (polygons.length) {
      polygons.map(polygon => {
        let region = new Path2D();
        polygon.map((val, index) => {
          if (index === 0) {
            region.moveTo(val[0], val[1]);
          }
          region.lineTo(val[0], val[1]);
        })
  
        region.closePath();
  
        // Fill path
        ctx.fillStyle = 'green';
        ctx.fill(region, 'evenodd');
      })
    }
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
            {this.state.url && !this.state.isMarking &&
              <>
                <canvas className={classes.canvasElement} height="400" width="400" id="myCanvas" onMouseDown={this.getCoordinates} />
                <img className={classes.image} id="myImg" src={this.state.url} alt='no' />
                <div style={{ position: "absolute", top: "520px" }}>
                  <button onClick={this.addPolygon}>Add Polygon</button>
                  <button onClick={this.removePreviousMarker}>Remove Previous Marker</button>
                  <button onClick={this.fillColor}>Complete Mapping</button>
                </div>
              </>}

          </Grid>
        </Grid>
        <Snackbar open={showSnackBar} message={message} handleClose={this.handleClose} />
      </div>
    );
  }
}

export default withStyles(styles)(CenteredGrid);
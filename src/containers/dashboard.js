import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import ReactImageMapper from './../components/imageMapper';

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
  },
  colorList: {
    marginTop: '10px',
    overflow: 'auto',
    overflowX: 'hidden',
    paddingRight: '13px',
    listStyle: 'none'

  },
  colorListItem: {
    width: '31%',
    height: '100px',
    float: 'left',
    marginRight: '3.5%',
    marginBottom: '10px',
    background: '#DDD',
    border: '1px solid #000',
    boxSizing: 'border-box',
    borderRadius: '5px',
    boxShadow: '0px 1px 1px #999',
    padding: '10px 5px',
    textAlign: 'center',
    lineHeight: '10px',
    fontSize: '13px',
    color: '#272c33',
    fontFamily: 'OpenSansRegular',
    textTransform: 'lowercase',
    position: 'relative',
    cursor: 'pointer'
  },
  colorText: {
    position: 'absolute',
    bottom: 0,
    display: 'inline-block',
    left: 0,
    width: '100%'
  }
});

const colors = [
  { name: "Yellow", color: "#FFF200" },
  { name: "Orange", color: "#FC6600" },
  { name: "Red", color: "#D30000" },
  { name: "Pink", color: "#FC0FC0" },
  { name: "Violet", color: "#B200ED" },
  { name: "blue", color: "#0018F9" },
  { name: "Green", color: "#388143" },
  { name: "Brown", color: "#7C4700" },
  { name: "Gray", color: "#828282" },
]


class CenteredGrid extends React.Component {

  state = {
    url: null,
    message: '',
    showSnackBar: false,
    isMarking: false,
    // polygons: [[[39, 167], [5, 259], [119, 257], [123, 168], [43, 169]],
    // [[186, 121], [243, 188], [344, 185], [254, 109], [197, 108], [189, 119]]],

    polygons: [],
    mapping: [],
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
  }

  mappedRegions = () => {
    const { polygons } = this.state;
    return polygons.map((polygon, index) => ({
      name: String(index),
      shape: "poly",
      coords: polygon.flat()
    }))
  }

  completeMarking = () => {
    this.setState({ isMarking: false });
    this.forceUpdate();
  }


  addEventListener = (e) => {
    const pos = {
      x: e.clientX,
      y: e.clientY
    };
  }

  resetCanvas = () => {
    let canvas = this.canvas;
    let ctx = canvas.getContext("2d");
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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
      this.setState({ isMarking: true });
    } else {
      this.setState({ showSnackBar: true, message: 'Image size should be greater than 1MB' });
    }
  }

  onDragEvent = (e) => {
    e.dataTransfer.setData("text/plain", e.target.id)
  }

  setRefernce = (node) => {
    this.canvas = node;
  }

  resetMapping = () => {
    this.setState({ polygons: [], mapping: [], isMarking: true })
  }

  render() {
    console.log("canvas", this.canvas);
    const { classes } = this.props;
    const { showSnackBar, message } = this.state;
    const mappedRegions = this.mappedRegions();
    console.log("mappedRegions", mappedRegions, this.refs);
    const MAP = {
      name: "my-map",
      areas: mappedRegions
    }
    return (
      <div className={classes.root}>
        <Grid container spacing={24}>
          <Grid item xs={12}>
            {/* <PrimarySearchAppBar /> */}
          </Grid>
          <Grid item xs={4}>
            <div style={{boxSizing: 'border-box', padding: '15px', display: 'block'}}>
              <ul className={classes.colorList}>
                {colors.map(val => {
                  return (
                    <>
                      <li draggable={true}
                        id={val.color}
                        className={classes.colorListItem}
                        style={{ backgroundColor: val.color, width: "100px" }}
                        onDragStart={(e) => this.onDragEvent(e)}
                      >
                      <label>{val.name}</label>
                      <div className={classes.colorText}>{val.color}</div></li>
                    </>
                  )
                })}
              </ul>
            </div>
          </Grid>
          <Grid container item xs={8} alignItems="center" justify="center">
            {!this.state.url && <Button variant="contained" color="default" className={classes.button}>
              <input
                type="file"
                onChange={this.handleUploadImage}
                accept=".jpeg"
              />
            </Button>}
            {this.state.url && this.state.isMarking &&
              <>
                <canvas className={classes.canvasElement} ref={node => this.canvas = node} height="400" width="400" id="myCanvas" onMouseDown={this.getCoordinates} />
                <img className={classes.image} id="myImg" src={this.state.url} alt='no' />
                <div style={{ position: "absolute", bottom: "10px" }}>
                  <button onClick={this.addPolygon}>Add Polygon</button>
                  <button onClick={this.removePreviousMarker}>Remove Previous Marker</button>
                  <button onClick={this.completeMarking}>Complete Mapping</button>
                </div>
              </>}
            {this.state.url && !this.state.isMarking &&
              <>
                <ReactImageMapper
                  src={this.state.url}
                  map={MAP}
                  height={400}
                  width={400}
                  setRefernce={this.setRefernce}
                />
                <div style={{ position: "absolute", bottom: "10px" }}>
                  <button onClick={this.resetCanvas}>Reset color</button>
                  <button onClick={this.resetMapping}>Reset Mapping</button>
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
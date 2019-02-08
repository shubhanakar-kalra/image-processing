import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import RootRef from '@material-ui/core/RootRef';

import ReactImageMapper from './../components/imageMapper';
import Snackbar from '../components/SnackBar';
import AppBar from '../components/Header';
import ImageSelect from '../components/ImageSelect';

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
    position: 'absolute'
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

  constructor(props) {
    super(props);
    this.container = React.createRef();
  }

  state = {
    url: null,
    message: '',
    showSnackBar: false,
    isMarking: false,
    polygons: [],
    mapping: [],
    dimensions: null,
  }

  getCoordinates = (e) => {
    const { offsetX: posX, offsetY: posY } = e.nativeEvent;
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
    var c = this.canvas;
    var ctx = c.getContext("2d");
    ctx.fillStyle = "#FFFFFF";
    ctx.strokeStyle = "#FFFFFF";
    if (mapping.length >= 2) {
      if (mapping.length == 2) {
        this.drawPoint(ctx, mapping[0]);
      }
      let lc = mapping.slice(-2);
      ctx.beginPath();
      ctx.moveTo(lc[0][0], lc[0][1]);
      ctx.lineTo(lc[1][0], lc[1][1]);
      ctx.stroke();
      this.drawPoint(ctx, lc[1]);
    }
  }

  drawPoint(ctx, point) {
    const x = point[0];
    const y = point[1];
    const pointSize = 3;
    ctx.beginPath(); //Start path
    ctx.arc(x, y, pointSize, 0, Math.PI * 2, true); // Draw a point using the arc function of the canvas with a point structure.
    ctx.fill(); 
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
    if (file && file.size > 1000000) {
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
  
  componentDidMount() {
    this.setState({
      dimensions: {
        width: this.container.current.offsetWidth,
        height: this.container.current.offsetHeight,
      },
    });
  }

  renderCanvas = () => {
    const { classes } = this.props;
    const { url, isMarking, dimensions } = this.state;
    const mappedRegions = this.mappedRegions();
    const map = {
      name: "my-map",
      areas: mappedRegions
    }
    if (isMarking) {
      return (
        <React.Fragment>
          <canvas className={classes.canvasElement} ref={node => this.canvas = node} height={dimensions.height} width={dimensions.width} id="myCanvas" onMouseDown={this.getCoordinates} />
           <img className={classes.image} id="myImg" src={this.state.url} height={dimensions.height} width={dimensions.width} alt='no' />
        </React.Fragment>
      )
    }
    return (
      <React.Fragment>
        <ReactImageMapper
          src={url}
          map={map}
          height={dimensions.height}
          width={dimensions.width}
          setRefernce={this.setRefernce}
        />
        <div style={{ position: "absolute", bottom: "10px" }}>
          <button onClick={this.resetCanvas}>Reset color</button>
          <button onClick={this.resetMapping}>Reset Mapping</button>
        </div>
      </React.Fragment>
    )
  }

  render() {
    const { classes } = this.props;
    const { showSnackBar, message, dimensions, url } = this.state;
    return (
      <div>
        <AppBar
          showButton={this.state.url}
          isMarking={this.state.isMarking}
          addPolygon={this.addPolygon}
          removeMarker={this.removePreviousMarker}
          completeMarking={this.completeMarking}
          resetCanvas={this.resetCanvas}
          resetMapping={this.resetMapping}
        />
        <div className={classes.root}>
          <Grid container spacing={0}>
            <Grid container item xs={3}>
              <div style={{boxSizing: 'border-box', padding: '15px', display: 'block'}}>
                <ul className={classes.colorList}>
                  {colors.map(val => (
                    <React.Fragment>
                      <li draggable={true}
                        id={val.color}
                        className={classes.colorListItem}
                        style={{ backgroundColor: val.color, width: "100px" }}
                        onDragStart={(e) => this.onDragEvent(e)}
                      >
                        <label>{val.name}</label>
                        <div className={classes.colorText}>{val.color}</div>
                      </li>
                    </React.Fragment>
                  ))}
                </ul>
              </div>
            </Grid>
            <RootRef rootRef={this.container}>
              <Grid container item xs={9} alignItems="center" justify="center">
                  {!url && <ImageSelect handleUploadImage={this.handleUploadImage} />}
                  {dimensions && url && this.renderCanvas()}
              </Grid>
            </RootRef>
          </Grid>
        </div>
        <Snackbar open={showSnackBar} message={message} handleClose={this.handleClose} />
      </div>
    );
  }
}

export default withStyles(styles)(CenteredGrid);
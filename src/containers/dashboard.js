import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import classNames from 'classnames';
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
    position: 'absolute; top:0px; left:0px'
  },
  canvasElement: {
    position: 'absolute; top:0px; left:0px',
    zIndex: 2
  },
  containerWrapper: {
    width: '100%',
    height: 'calc(100vh - 64px) !important',
    position: 'relative'
  },
  colorList: {
    marginTop: '10px',
    overflow: 'auto',
    overflowX: 'hidden',
    paddingRight: '13px',
    listStyle: 'none'
  },
  selectImage: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
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
    this.state = {
      url: null,
      message: '',
      showSnackBar: false,
      isMarking: false,
      polygons: [],
      mapping: [],
      dimensions: null,
    };
  }

  componentDidMount() {
    this.setState({ dimensions: { height: this.containerWrapper.offsetHeight, width: this.containerWrapper.offsetWidth } });
  }

  getCoordinates = (e) => {
    const c = this.canvas;
    const ctx = c.getContext('2d');
    let { layerX: posX, layerY: posY} = e.nativeEvent;
    const { mapping } = this.state;
    const pos = [posX, posY];
    mapping.push(pos);
    this.drawPoint(ctx, { x: posX, y: posY });
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
    if (mapping.length >= 2) {
      const c = this.canvas;
      const ctx = c.getContext("2d");
      const lc = mapping.slice(-2);
      ctx.beginPath();
      ctx.moveTo(lc[0][0], lc[0][1]);
      ctx.lineTo(lc[1][0], lc[1][1]);
      ctx.stroke();
    }
  }
  
  drawPoint(ctx, { x, y }) {
    const pointSize = 3;
    ctx.fillStyle = "#FFFFFF";
    ctx.strokeStyle = "#FFFFFF";
    ctx.beginPath();
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
  
  renderCanvas = () => {
    const { classes } = this.props;
    const { url, isMarking, dimensions: { height, width } } = this.state;
    const mappedRegions = this.mappedRegions();
    const map = {
      name: "my-map",
      areas: mappedRegions
    };
    
    return isMarking ?
      (
        <React.Fragment>
          <canvas className={classes.canvasElement} height={height} width={width} ref={el=> this.canvas = el} onMouseDown={this.getCoordinates} />
          <img className={classNames(classes.image, classes.myImg)} height={height} width={width} src={this.state.url} alt='no' />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <ReactImageMapper
            src={url}
            map={map}
            height={height}
            width={width}
            setRefernce={this.setRefernce}
            />
        </React.Fragment>
      );
  }
  
  render() {
    const { classes } = this.props;
    const { showSnackBar, message, url, dimensions } = this.state;
    return (
      <div>
        <div>
          <Grid container zeroMinWidth className={classes.root}>
            <Grid item xs={12}>
              <AppBar
                showButton={this.state.url}
                isMarking={this.state.isMarking}
                addPolygon={this.addPolygon}
                removeMarker={this.removePreviousMarker}
                completeMarking={this.completeMarking}
                resetCanvas={this.resetCanvas}
                resetMapping={this.resetMapping}
              />
            </Grid>
            <Grid item xs={3}>
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
            <Grid item xs={9} className={classes.selectImage}>
              <div className={classes.containerWrapper} ref={el => this.containerWrapper = el}>
                {!url && <ImageSelect handleUploadImage={this.handleUploadImage} />}
                {dimensions && url && this.renderCanvas()}
              </div>
            </Grid>
          </Grid>
        </div>
        <Snackbar open={showSnackBar} message={message} handleClose={this.handleClose} />
      </div>
    );
  }
}

export default withStyles(styles)(CenteredGrid);
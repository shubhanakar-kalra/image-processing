import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Fab from '@material-ui/core/Fab';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    width: '100%',
  },
  margin: {
    margin: theme.spacing.unit,
  },
  grow: {
    flexGrow: 1,
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
});

class PrimarySearchAppBar extends React.Component {
  state = {
    anchorEl: null,
    mobileMoreAnchorEl: null,
  };

  renderButton = (text, handler) => {
    return (
      <Fab
        variant="extended"
        size="small"
        color="primary"
        aria-label="Add"
        onClick={handler}
        className={this.props.classes.margin}
      >
        {text}
      </Fab>
    )
  }

  render() {
    const { classes, showButton, addPolygon, removePreviousMarker, completeMarking } = this.props;

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography className={classes.title} variant="h6" color="inherit" noWrap>
              Color Dropper
            </Typography>
            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
            {showButton && this.renderButton("Map", addPolygon)}
            {showButton && this.renderButton("Undo Map", removePreviousMarker)}
            {showButton && this.renderButton("visualize", completeMarking)}
            </div>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default withStyles(styles)(PrimarySearchAppBar);
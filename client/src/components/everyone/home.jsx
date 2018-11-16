import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import StarIcon from "@material-ui/icons/StarBorder";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import Theme from "../themes/defaulTheme";
import LoginIcon from "@material-ui/icons/ExitToApp";
import history from "../common/history";

const styles = theme => ({
  "@global": {
    body: {
      backgroundColor: "#eceff1"
    }
  },
  appBar: {
    position: "relative"
  },
  toolbarTitle: {
    flex: 1
  },
  layout: {
    width: "auto",
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(900 + theme.spacing.unit * 3 * 2)]: {
      width: 900,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  heroContent: {
    maxWidth: 600,
    margin: "0 auto",
    padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 6}px`
  },
  cardHeader: {
    backgroundColor: theme.palette.grey[200]
  },
  cardPricing: {
    display: "flex",
    justifyContent: "center",
    alignItems: "baseline",
    marginBottom: theme.spacing.unit * 2
  },
  cardActions: {
    [theme.breakpoints.up("sm")]: {
      paddingBottom: theme.spacing.unit * 2
    }
  },
  footer: {
    marginTop: theme.spacing.unit * 8,
    borderTop: `1px solid ${theme.palette.divider}`,
    padding: `${theme.spacing.unit * 6}px 0`
  },
  button: {
    margin: theme.spacing.unit
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  }
});

const tiers = [
  {
    title: "Básico",
    price: "20",
    description: ["1 computadora", "2 GB de almacenamiento"],
    buttonText: "Iniciar",
    buttonVariant: "outlined"
  },
  {
    title: "Pro",
    subheader: "Más popular",
    price: "25",
    description: [
      "5 computadoras",
      "10 GB de almacenamiento",
      "Soporte técnico"
    ],
    buttonText: "Iniciar",
    buttonVariant: "contained"
  },
  {
    title: "Dorada",
    price: "50",
    description: [
      "20 computadoras",
      "30 GB de almacenamiento",
      "Soporte técnico"
    ],
    buttonText: "Iniciar",
    buttonVariant: "outlined"
  }
];

function goTo(val) {
  if (val === "Pro") {
    history.push("/pro");
  }
  if (val === "Básico") {
    history.push("/basic");
  }
  if (val === "Dorada") {
    history.push("/golden");
  }
}

function Pricing(props) {
  const { classes } = props;

  return (
    <Theme>
      <CssBaseline />
      <AppBar position="static" color="primary" className={classes.appBar}>
        <Toolbar>
          <Typography
            variant="h6"
            color="inherit"
            noWrap
            className={classes.toolbarTitle}
          >
            Suburban
          </Typography>
          <Button
            style={{ color: "#ffffff" }}
            className={classes.button}
            onClick={() => {
              history.push("/signin");
            }}
          >
            <LoginIcon className={classes.leftIcon} />
            Login
          </Button>
        </Toolbar>
      </AppBar>
      <main className={classes.layout}>
        {/* Hero unit */}
        <div className={classes.heroContent}>
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="textPrimary"
            gutterBottom
          >
            Precios
          </Typography>
          <Typography
            variant="h6"
            align="center"
            color="textSecondary"
            component="p"
          >
            Maneja tu negocio de una forma efectiva con este sistema POS manejo
            de inventario, compras y ventas con facturación
          </Typography>
        </div>
        {/* End hero unit */}
        <Grid container spacing={40} alignItems="flex-end">
          {tiers.map(tier => (
            // Enterprise card is full width at sm breakpoint
            <Grid
              item
              key={tier.title}
              xs={12}
              sm={tier.title === "Enterprise" ? 12 : 6}
              md={4}
            >
              <Card>
                <CardHeader
                  title={tier.title}
                  subheader={tier.subheader}
                  titleTypographyProps={{ align: "center" }}
                  subheaderTypographyProps={{ align: "center" }}
                  action={tier.title === "Pro" ? <StarIcon /> : null}
                  className={classes.cardHeader}
                />
                <CardContent>
                  <div className={classes.cardPricing}>
                    <Typography component="h2" variant="h3" color="textPrimary">
                      ${tier.price}
                    </Typography>
                    <Typography variant="h6" color="textSecondary">
                      /mo
                    </Typography>
                  </div>
                  {tier.description.map(line => (
                    <Typography variant="subtitle1" align="center" key={line}>
                      {line}
                    </Typography>
                  ))}
                </CardContent>
                <CardActions className={classes.cardActions}>
                  <Button
                    fullWidth
                    variant={tier.buttonVariant}
                    color="primary"
                    onClick={() => goTo(tier.title)}
                  >
                    {tier.buttonText}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </main>
    </Theme>
  );
}

Pricing.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Pricing);
